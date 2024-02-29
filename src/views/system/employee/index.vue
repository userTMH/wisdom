<template>
  <div class="employee-coment">
    <div style="display: flex;width: 390px;justify-content: space-between;align-items: center;">
      员工名称：
      <el-input v-model="pages.name" style="width: 220px;" placeholder="请输入员工名称" size="small"></el-input>
      <el-button type="primary" size="small" @click="getList">查询</el-button>
    </div>
    <div style=" margin: 15px 0px 0px 0px ;padding: 15px 0px;border-top: 1px solid #ccc;">
      <el-button type="primary" size="small" @click="add">添加员工</el-button>
    </div>
    <div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" label="序号">
        </el-table-column>
        <el-table-column prop="name" label="员工名称">
        </el-table-column>
        <el-table-column prop="userName" label="登录账号">
        </el-table-column>
        <el-table-column prop="phonenumber" label="联系方式">
        </el-table-column>
        <el-table-column prop="roleName" label="角色">
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template v-slot="{ row }">
            <span>{{ row.status == 0 ? '未启用' : '启用' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="添加时间">
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-button type="text" @click="add(row)">编辑</el-button>
            <el-button type="text" @click="erase(row)">删除</el-button>
            <el-button type="text" @click="reset(row)">重置密码</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div style="display: flex;justify-content: space-between;">
        <p></p>
        <el-pagination @size-change="handleSizeChange" @current-change="handleSizeChanges" :current-page="pages.page"
          :page-sizes="[10, 20, 30, 40]" :page-size="pages.pageSize" layout="total, prev, sizes, pager, next"
          :total="total">
        </el-pagination>
      </div>
    </div>
    <!-- 添加弹窗 -->
    <el-dialog :title="title" :visible.sync="dialogVisible" width="40%" :before-close="handleClose">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm"
        label-position="top" style="width: 70%;margin: auto;">
        <el-form-item label="员工名称" prop="name">
          <el-input v-model="ruleForm.name" size="small" placeholder="请填写员工姓名"></el-input>
        </el-form-item>
        <el-form-item label="登录账号" prop="userName">
          <el-input v-model="ruleForm.userName" size="small" placeholder="请填写登录账号"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="phonenumber">
          <el-input v-model="ruleForm.phonenumber" size="small" placeholder="请填写联系方式"></el-input>
        </el-form-item>
        <el-form-item>
          <p>默认密码:12345</p>
        </el-form-item>
        <el-form-item label="分配角色" prop="roleId">
          <el-select v-model="ruleForm.roleId" placeholder="请选择分配角色" size="small" style="width: 100%;">
            <el-option v-for="(item, index) in roles" :key="index" :label="item.roleName"
              :value="item.roleId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="员工状态" prop="status">
          <el-radio-group v-model="ruleForm.status" size="small">
            <el-radio :label="0">禁用</el-radio>
            <el-radio :label="1">启用</el-radio>
          </el-radio-group>
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
import { userList, roleList, sysuserApi, deleteApi, editApi, resetApi } from '@/api/system'
export default {
  name: 'VueWisdomIndex',

  data() {
    return {
      pages: {
        name: '',
        page: 1,
        pageSize: 10
      },
      total: 0,
      tableData: [],
      dialogVisible: false,
      title: '',
      ruleForm: {
        name: '',   //员工姓名
        userName: '',   //登录账号
        phonenumber: '',    //联系方式
        roleId: '',   //用户角色名称
        status: null,    //用户状态
      },
      rules: {
        name: [
          { required: true, message: '请填写员工姓名', trigger: 'blur' },
        ],
        userName: [
          { required: true, message: '请填写登录账号', trigger: 'blur' },
        ],
        phonenumber: [
          { required: true, message: '请填写联系方式', trigger: 'blur' },
        ],
        roleId: [
          { required: true, message: '请选择分配角色', trigger: 'blur' },
        ],
        status: [
          { required: true, message: '请选择员工状态', trigger: 'blur' },
        ],
      },
      //
      roles: []
    };
  },
  created() {
    this.getList()
  },
  methods: {
    //获取列表数据
    async getList() {
      const res = await userList(this.pages)
      // console.log(res);
      this.tableData = res.data.rows
      this.total = res.data.total
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
          this.$refs.ruleForm.resetFields();
          this.dialogVisible = false
        })
        .catch(_ => { });
    },
    //对话框事件
    async add(row) {
      this.dialogVisible = true
      if (row.id) {
        this.title = '编辑员工'
        const res = await roleList()
        // console.log(res);
        this.roles = res.data
        this.ruleForm = JSON.parse(JSON.stringify(row))
      } else {
        this.title = '添加员工'
        const res = await roleList()
        // console.log(res);
        this.roles = res.data
      }
    },
    //确认事件
    submitForm() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          if (this.title == '添加员工') {
            const res = await sysuserApi(this.ruleForm)
            // console.log(res);
            if (res.code == 10000) {
              this.$message.success('添加成功')
              this.getList()
              this.$refs.ruleForm.resetFields();
              this.dialogVisible = false
            }
          } else {
            delete this.ruleForm.createTime
            const res = await editApi(this.ruleForm)
            // console.log(res);
            if (res.code == 10000) {
              this.$message.success('编辑成功')
              this.getList()
              this.$refs.ruleForm.resetFields();
              this.dialogVisible = false
            }
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    //删除事件
    erase(row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await deleteApi(row.id)
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
    //重置密码
    async reset(row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await resetApi({ id: row.id })
        // console.log(res);
        if (res.code == 10000) {
          this.$message({
            type: 'success',
            message: '重置密码成功!'
          });
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
.employee-coment {
  background-color: #ffffff;
  padding: 15px;
}
</style>
