<template>
  <div class="manage-coment">
    <div class="conent-top" style="padding-bottom: 10px;border-bottom: 1px solid #ccc;">
      一体杆称名称：
      <el-input v-model="pages.poleName" style="width: 220px;" placeholder="请输入一体杆称名称" size="small"></el-input>
      一体杆编号：
      <el-input v-model="pages.poleNumber" style="width: 220px;" placeholder="请输入一体杆编号" size="small"></el-input>
      运行状态：
      <el-select v-model="pages.poleStatus" placeholder="请选择运行状态">
        <el-option label="全部" :value="null"></el-option>
        <el-option label="异常" value="1"></el-option>
        <el-option label="正常" value="0"></el-option>
      </el-select>
      <el-button type="primary" size="small" style="margin-left: 10px;" @click="getList()">查询</el-button>
    </div>
    <div style="margin: 10px 0px;">
      <el-button type="primary" size="small" @click="add">添加账单</el-button>
      <el-button size="small" @click="edits">批量删除</el-button>
    </div>
    <div>
      <!-- 表格 -->
      <el-table :data="tableData" style="width: 100%" @select="sel">
        <el-table-column type="selection" label="序号">
        </el-table-column>
        <el-table-column prop="poleName" label="一体杆名称">
        </el-table-column>
        <el-table-column prop="poleNumber" label="一体杆编号">
        </el-table-column>
        <el-table-column prop="poleIp" label="一体杆IP">
        </el-table-column>
        <el-table-column prop="areaName" label="安装区域">
        </el-table-column>
        <el-table-column prop="poleType" label="一体杆类型">
          <template v-slot="{ row }">
            {{ row.poleType == "entrance" ? '出口' : row.poleType == "export" ? '入口' : '' }}
          </template>
        </el-table-column>
        <el-table-column prop="poleStatus" label="运行状态">
          <template v-slot="{ row }">
            {{ row.poleStatus == 0 ? '正常' : '异常' }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-button type="text" @click="add(row)">编辑</el-button>
            <el-button type="text" @click="edit(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div style="display: flex;justify-content: space-between;">
        <p></p>
        <el-pagination @size-change="handleSizeChange" @current-change="handleSizeChanges" :current-page="pages.page"
          :page-sizes="[10, 20, 30, 40]" :page-size="pages.pageSize" layout="total, prev, sizes, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>
    <!-- 弹出框 -->
    <el-dialog :title="title" :visible.sync="dialogVisible" width="40%" :before-close="handleClose">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" style="width: 70%;margin: auto;" label-width="100px"
        class="demo-ruleForm" label-position="top">
        <el-form-item label="一体杆名称" prop="poleName">
          <el-input v-model="ruleForm.poleName" placeholder="请输入一体杆名称" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="一体杆编号" prop="poleNumber">
          <el-input v-model="ruleForm.poleNumber" placeholder="请输入一体杆编号" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="一体杆IP" prop="poleIp">
          <el-input v-model="ruleForm.poleIp" placeholder="请输入一体杆IP" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="关联区域" prop="areaId">
          <el-select v-model="ruleForm.areaId" placeholder="请选择关联区域" size="mini" style="width: 100%;">
            <el-option v-for="(item, index) in dropList" :key="index" :label="item.areaName"
              :value="item.areaId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="一体杆类型" prop="poleType">
          <el-select v-model="ruleForm.poleType" placeholder="请选择一体杆类型" size="mini" style="width: 100%;">
            <el-option label="出口" value="export"></el-option>
            <el-option label="入口" value="entrance"></el-option>
          </el-select>
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
import { listApi, dropListApi, infoApi, infosApi, editApi } from '@/api/rod'
export default {
  name: 'VueWisdomIndex',

  data() {
    return {
      pages: {
        poleName: '',
        poleNumber: '',
        poleStatus: '',
        page: 1,
        pageSize: 10
      },
      tableData: [],    //列表数据
      total: 0,   //列表总数量
      dialogVisible: false,    //弹出窗状态
      title: '',   //弹窗标题
      ruleForm: {
        poleName: '',
        poleNumber: '',
        poleIp: '',
        areaId: null,
        poleType: ''
      },
      rules: {
        poleName: [
          { required: true, message: '请输入一体杆名称', trigger: 'blur' },
        ],
        poleNumber: [
          { required: true, message: '请输入一体杆编号', trigger: 'blur' },
        ],
        poleIp: [
          { required: true, message: '请输入一体杆IP', trigger: 'blur' },
        ],
        areaId: [
          { required: true, message: '请选择关联区域', trigger: 'blur' },
        ],
        poleType: [
          { required: true, message: '请选择一体杆类型', trigger: 'blur' },
        ],
      },
      dropList: [],   //关联区域下拉列表数据
      editList: []    //批量删除数据
    };
  },
  created() {
    this.getList()
  },
  methods: {
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
    //获取列表数据
    async getList() {
      const res = await listApi(this.pages)
      // console.log(res);
      this.tableData = res.data.rows
      this.total = res.data.total
    },
    //打开弹出窗
    async add(row) {
      this.dialogVisible = true
      if (row.id) {
        this.title = '编辑一体杆'
        const res = await dropListApi()
        // console.log(res);
        if (res.code == 10000) {
          this.dropList = res.data
        }
        this.ruleForm = JSON.parse(JSON.stringify(row))
      } else {
        this.title = '添加一体杆'
        const res = await dropListApi()
        // console.log(res);
        if (res.code == 10000) {
          this.dropList = res.data
        }
      }
    },
    //弹出窗关闭事件
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.$refs.ruleForm.resetFields();
          this.dialogVisible = false
        })
        .catch(_ => { });
    },
    //确认按钮
    submitForm() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          if (this.title == '添加一体杆') {
            const res = await infoApi(this.ruleForm)
            // console.log(res);
            if (res.code == 10000) {
              this.$message.success('添加成功')
              this.$refs.ruleForm.resetFields();
              this.getList()
              this.dialogVisible = false
            }
          } else {
            delete this.ruleForm.poleStatus
            delete this.ruleForm.areaName
            const res = await infosApi(this.ruleForm)
            // console.log(res);
            if (res.code == 10000) {
              this.$message.success('编辑成功')
              this.$refs.ruleForm.resetFields();
              this.getList()
              this.dialogVisible = false
            }
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    //删除
    edit(row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await editApi(row.id)
        // console.log(res);
        if (res.code == 10000) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getList()
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    //批量删除
    edits() {
      if (this.editList) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const res = await editApi(this.editList)
          // console.log(res);
          if (res.code == 10000) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getList()
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      } else {
        this.$message({
          type: 'info',
          message: '请选择删除的数据'
        });
      }

    },
    //获取批量删除选中数据
    sel(e) {
      const arr = e.map(item => item.id)
      this.editList = arr.join()
    }
  },
};
</script>

<style lang="scss" scoped>
.manage-coment {
  background-color: #ffffff;
  padding: 15px;
}
</style>
