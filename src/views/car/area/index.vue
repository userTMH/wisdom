<template>
  <div class="area-coment">
    <div style=" margin: 15px 0px 0px 0px ;padding: 15px 0px;">
      <el-button type="primary" size="small" @click="add(0)">添加区域</el-button>
    </div>
    <div>
      <el-table :data="tableData" style="width: 100%" v-loading="loading" element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(ff, ff, ff, 0.8)">
        <el-table-column type="index" label="序号" width="150">
        </el-table-column>
        <el-table-column prop="areaName" label="区域名称" width="150">
        </el-table-column>
        <el-table-column prop="spaceNumber" label="车位数(个)" width="150">
        </el-table-column>
        <el-table-column prop="areaProportion" label="面积(m²)" width="150">
        </el-table-column>
        <el-table-column prop="ruleName" label="计费规则" width="150">
          <template v-slot="{ row }">
            <el-tooltip class="item" effect="dark" :content="row.hoverRuleName" placement="top">
              <span>{{ row.ruleName }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" width="150">
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template v-slot="{ row }">
            <el-button type="text" @click="add(row)">编辑</el-button>
            <el-button type="text" @click="esint(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style=" display: flex;justify-content: space-between;">
        <p></p>
        <el-pagination @size-change="handleSizeChange" @current-change="handleSizeChanges" :current-page="pages.page"
          :page-sizes="[10, 20, 30, 40]" :page-size="pages.pageSize" layout="total, prev, sizes, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>
    <!-- 对话框 -->
    <el-dialog :title="title" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm"
        label-position="top">
        <el-form-item label="区域名称" prop="areaName">
          <el-input v-model="ruleForm.areaName" size="mini" style="width: 94%;" placeholder="请输入区域名称"></el-input>
        </el-form-item>
        <el-form-item label="车位数(个)" prop="spaceNumber">
          <el-input-number v-model="ruleForm.spaceNumber" controls-position="right" :min="1" :max="10" size="mini"
            style="width: 94%;" placeholder="请输入车位个数"></el-input-number>
        </el-form-item>
        <el-form-item label="面积(m²)" prop="areaProportion">
          <el-input v-model="ruleForm.areaProportion" size="mini" style="width: 94%;margin-right: 5px;"
            placeholder="请输入面积"></el-input>m²
        </el-form-item>
        <el-form-item label="关联计费规则" prop="ruleId">
          <el-select v-model="ruleForm.ruleId" placeholder="请选择" size="mini" style="width: 94%;">
            <el-option v-for="(item, index) in droplist" :key="index" :label="item.ruleName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="ruleForm.remark" size="mini" style="width: 94%;"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { listApi, dropListApi, areaApi, deleteApi, areasApi } from '@/api/car'
export default {
  name: 'VueWisdomIndex',

  data() {
    return {
      tableData: [],
      pages: {
        page: 1,
        pageSize: 10
      },
      total: 0,
      //对话框状态
      dialogVisible: false,
      droplist: [],
      ruleForm: {
        areaName: '',
        spaceNumber: '',
        areaProportion: '',
        ruleId: '',
        remark: '',
      },
      rules: {
        areaName: [
          { required: true, message: '请输入区域名称', trigger: 'blur' },
        ],
        spaceNumber: [
          { required: true, message: '请输入车位个数', trigger: 'blur' },
        ],
        areaProportion: [
          { required: true, message: '请输入面积', trigger: 'blur' },
        ],
        ruleId: [
          { required: true, message: '请选择关联计费规则', trigger: 'blur' },
        ],
      },
      title: "",
      loading: false,
    };
  },
  created() {
    this.getList()
  },
  methods: {
    //获取下拉数据
    async dropList() {
      const res = await dropListApi()
      // console.log(res);
      this.droplist = res.data.rows
    },
    //获取列表数据
    async getList() {
      this.loading = true
      const res = await listApi(this.pages)
      // console.log(res);
      this.tableData = res.data.rows
      this.total = res.data.total
      this.loading = false
    },
    //分页事件
    handleSizeChanges(e) {
      // console.log(e);
      this.pages.page = e
      this.getList()
    },
    handleSizeChange(e) {
      // console.log(e);
      this.pages.pageSize = e
      this.getList()
    },
    //对话框关闭
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          // done();
          this.dialogVisible = false
          this.ruleForm = {
            areaName: '',
            spaceNumber: '',
            areaProportion: '',
            ruleId: '',
            remark: '',
          }
        })
        .catch(_ => { });
    },
    //开启对话框
    add(e) {
      this.dropList()
      if (e == 0) {
        this.title = "添加区域"
        this.dialogVisible = true
      } else {
        // console.log(e);
        this.title = "编辑区域"
        this.ruleForm = JSON.parse(JSON.stringify(e))
        this.dialogVisible = true
      }
    },
    //确认按钮
    submitForm() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          if (this.title == '添加区域') {
            const res = await areaApi(this.ruleForm)
            // console.log(res);
            if (res.code == 10000) {
              this.$message.success('添加成功')
              this.dialogVisible = false
              this.dialogVisible = false
              this.ruleForm = {
                areaName: '',
                spaceNumber: '',
                areaProportion: '',
                ruleId: '',
                remark: '',
              }
              this.getList()
            }
          } else {
            delete this.ruleForm.ruleName
            delete this.ruleForm.hoverRuleName
            const res = await areasApi(this.ruleForm)
            // console.log(res);
            if (res.code == 10000) {
              this.$message.success('编辑成功')
              this.dialogVisible = false
              this.dialogVisible = false
              this.ruleForm = {
                areaName: '',
                spaceNumber: '',
                areaProportion: '',
                ruleId: '',
                remark: '',
              }
              this.getList()
            }
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    //删除
    esint(row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await deleteApi(row.id)
        if (res.code == 10000) {
          this.$message.success('删除成功')
          this.getList()
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  },
};
</script>

<style lang="scss" scoped>
.area-coment {
  background-color: #ffffff;
  padding: 15px;
}
</style>
