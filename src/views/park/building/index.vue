<template>
  <div class="building-coment">
    <div style="display: flex;width: 390px;justify-content: space-between;align-items: center;">
      楼宇名称：
      <el-input style="width: 220px;" v-model="pages.name" placeholder="请输入楼宇名称" size="small"></el-input>
      <el-button type="primary" size="small" @click="Inquire">查询</el-button>
    </div>
    <div style=" margin: 15px 0px 0px 0px ;padding: 15px 0px;border-top: 1px solid #ccc;">
      <el-button type="primary" size="small" @click="add(0)">添加楼宇</el-button>
    </div>
    <div>
      <template>
        <el-table :data="tableData" style="width: 100%" v-loading="loading" element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading" element-loading-background="rgba(ff, ff, ff, 0.8)">
          <el-table-column type="index" label="序号">
          </el-table-column>
          <el-table-column prop="name" label="楼宇名称">
          </el-table-column>
          <el-table-column prop="floors" label="层数">
          </el-table-column>
          <el-table-column prop="area" label="在管面积(m²)">
          </el-table-column>
          <el-table-column prop="propertyFeePrice" label="物业费(元/m²)">
          </el-table-column>
          <el-table-column prop="status" label="状态">
            <template v-slot="{ row }">
              <span>{{ row.status == 0 ? '空置中' : '租赁中' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作">
            <template v-slot="{ row }">
              <el-button type="text" @click="add(row)">编辑</el-button>
              <el-button type="text" @click="edit(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!-- 分页 -->
      <div style="display: flex;justify-content: space-between;">
        <p></p>
        <el-pagination @size-change="handleSizeChange" @current-change="handleSizeChanges" :current-page="pages.page"
          :page-sizes="[10, 20, 30, 40]" :page-size="pages.pageSize" layout="total, prev, sizes, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>
    <!-- 添加编辑弹窗 -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible" :before-close="handleClose">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm" label-position="top">
        <el-form-item label="楼宇名称" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入楼宇名称"></el-input>
        </el-form-item>
        <el-form-item label="楼宇层数" prop="floors">
          <el-input v-model="ruleForm.floors" placeholder="请输入楼宇层数"></el-input>
        </el-form-item>
        <el-form-item label="在管面积" prop="area">
          <el-input v-model="ruleForm.area" placeholder="请输入在管面积">
            <template slot="append">m²</template>
          </el-input>
        </el-form-item>
        <el-form-item label="物业费" prop="propertyFeePrice">
          <el-input v-model="ruleForm.propertyFeePrice" placeholder="请输入物业费">
            <template slot="append">元/m²</template>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { buildingApi, buildingaddApi, buildingreviseApi, buildingeditApi } from '@/api/park'
export default {
  name: 'VueWisdomIndex',

  data() {
    return {
      tableData: [],
      pages: {
        name: '',
        page: 1,
        pageSize: 10
      },
      total: 0,
      //加载状态
      loading: false,
      //对话框状态
      dialogFormVisible: false,
      //表单数据
      ruleForm: {
        name: '',
        floors: null,
        area: null,
        propertyFeePrice: null
      },
      rules: {
        name: [
          { required: true, message: '请输入楼宇名称', trigger: 'blur' },
        ],
        floors: [
          { required: true, message: '请输入楼宇层数', trigger: 'blur' },
        ],
        area: [
          { required: true, message: '请输入在管面积', trigger: 'blur' },
        ],
        propertyFeePrice: [
          { required: true, message: '请输入物业费', trigger: 'blur' },
        ],
      },
      title: ''
    };
  },
  created() {
    this.getList()
  },
  methods: {
    //获取列表数据
    async getList() {
      this.loading = true
      const res = await buildingApi(this.pages)
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
    //查找事件
    Inquire() {
      this.getList()
    },
    //对话框事件
    handleClose() {
      this.ruleForm = {
        name: '',
        floors: null,
        area: null,
        propertyFeePrice: null
      }
      this.dialogFormVisible = false
      this.getList()
    },
    //弹窗
    add(e) {
      this.dialogFormVisible = true
      if (e != 0) {
        delete e.status
        this.title = "编辑楼宇"
        // console.log(e);
        this.ruleForm = JSON.parse(JSON.stringify(e))
      } else {
        this.title = "添加楼宇"
      }
    },
    //确定事件
    submitForm() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          if (this.title == '编辑楼宇') {
            const res = await buildingreviseApi(this.ruleForm)
            // console.log(res);
            if (res.code == 10000) {
              this.$message.success('编辑成功')
              this.handleClose()
              this.getList()
              this.text = false
            } else {
              this.$message.error('编辑失败')
            }
          } else {
            const res = await buildingaddApi(this.ruleForm)
            // console.log(res);
            if (res.code == 10000) {
              this.$message.success('添加成功')
              this.handleClose()
              this.getList()
            } else {
              this.$message.error('添加失败')
            }
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    //删除事件
    edit(e) {
      this.$confirm('是否确认删除当前楼宇?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await buildingeditApi(e.id)
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
        this.getList()
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
.building-coment {
  background-color: #ffffff;
  padding: 15px;
}
</style>
