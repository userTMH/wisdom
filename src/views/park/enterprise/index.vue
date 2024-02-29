<template>
  <div class="enterprise-coment">
    <div style="display: flex;width: 390px;justify-content: space-between;align-items: center;">
      企业名称：
      <el-input v-model="pages.name" style="width: 220px;" placeholder="请输入企业名称" size="small"></el-input>
      <el-button type="primary" size="small" @click="Inquire">查询</el-button>
    </div>
    <div style=" margin: 15px 0px 0px 0px ;padding: 15px 0px;border-top: 1px solid #ccc;">
      <el-button type="primary" size="small">添加企业</el-button>
    </div>
    <div>
      <el-table :data="tableData" style="width: 100%" @expand-change="tab">
        <el-table-column type="expand">
          <template v-slot="{ row }">
            <el-table :data="row.list" style="width: 100%">
              <el-table-column prop="buildingName" label="租赁楼宇">
              </el-table-column>
              <el-table-column prop="startTime" label="租赁起止时间">
              </el-table-column>
              <el-table-column prop="status" label="合同状态">
                <template v-slot="{ row }">
                  <el-tag v-show="row.status == 0">待生效</el-tag>
                  <el-tag v-show="row.status == 1" type="success">生效中</el-tag>
                  <el-tag v-show="row.status == 2" type="info">已到期</el-tag>
                  <el-tag v-show="row.status == 3" type="warning">已退租</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template v-slot="{ row }">
                  <el-button type="text">续租</el-button>
                  <el-button type="text">退租</el-button>
                  <el-button type="text" :disabled="row.status != 3">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号">
        </el-table-column>
        <el-table-column label="企业名称" prop="name">
        </el-table-column>
        <el-table-column label="联系人" prop="contact">
        </el-table-column>
        <el-table-column label="联系电话" prop="contactNumber">
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-button type="text" @click="addH">添加合同</el-button>
            <el-button type="text">查看</el-button>
            <el-button type="text">编辑</el-button>
            <el-button type="text" :disabled="row.existContractFlag == 1">删除</el-button>
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
    <!-- 对话框 -->
    <el-dialog title="添加合同" :visible.sync="dialogVisible" width="40%" :before-close="handleClose">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm"
        label-position="top">
        <el-form-item label="租赁楼宇" prop="buildingId">
          <el-select v-model="ruleForm.buildingId" placeholder="请选择活动区域">
            <el-option v-for="(item, index) in addList" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="租赁起止日期" prop="rentTime">
          <el-date-picker v-model="ruleForm.rentTime" type="daterange" range-separator="至" start-placeholder="开始日期"
            end-placeholder="结束日期" value-format="yyyy-MM-dd" />
        </el-form-item>
        <el-form-item label="租赁合同" prop="contractId">
          <el-upload class="upload-demo" action="#" :http-request="uploadHandle" multiple :limit="3"
            :file-list="fileList">
            <el-button size="small" type="primary" plain>上传文件</el-button>
            <div slot="tip" class="el-upload__tip">支持扩展名:.doc.docx.pdf,文件大小不得超过5m</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { enterpriselistApi, enterpriserentApi, enterpribuildingApi } from '@/api/park'
export default {
  name: 'VueWisdomIndex',

  data() {
    return {
      tableData: [],
      list: [],
      pages: {
        name: '',
        page: 1,
        pageSize: 10
      },
      total: 0,
      //对话框状态
      dialogVisible: false,
      ruleForm: {
        buildingId: null, // 楼宇id
        contractId: null, // 合同id
        contractUrl: '', // 合同Url
        enterpriseId: null, // 企业名称
        type: 0, // 合同类型
        rentTime: [] // 合同时间
      },
      rules: {
        buildingId: [
          { required: true, message: '请选择楼宇', trigger: 'change' }
        ],
        rentTime: [
          { required: true, message: '请选择租赁日期', trigger: 'change' }
        ],
        contractId: [
          { required: true, message: '请上传合同文件' }
        ]
      },
      fileList: [],
      addList: []
    };
  },
  created() {
    this.getList()
  },
  methods: {
    //获取列表数据
    async getList() {
      const res = await enterpriselistApi(this.pages)
      // console.log(res);
      this.tableData = res.data.rows.map((item) => {
        return { ...item, list: [] }
      })
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
    //展开合同
    async tab(e, a) {
      const isExpend = a.find(item => item.id === e.id)
      if (isExpend) {
        const res = await enterpriserentApi(e.id)
        // console.log(res);
        const add = this.tableData.find((item) => {
          return item.id == e.id
        })
        add.list = res.data
      }
    },
    //对话框事件
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => { });
    },
    //添加合同
    async addH() {
      this.dialogVisible = true
      const res = await enterpribuildingApi()
      // console.log(res);
      this.addList = res.data.data
    },
    // 上传合同
    async uploadHandle(fileData) {
      // 处理FormData
      const { file } = fileData
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'contract')
      // 上传并赋值
      const res = await uploadAPI(formData)
      const { id, url } = res.data
      this.ruleForm.contractId = id
      this.ruleForm.contractUrl = url
      // 单独校验表单
      this.$refs.addForm.validate('contractId')
    },
    //确认事件
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    //查找事件
    Inquire() {
      this.getList()
    },
  },
};
</script>

<style lang="scss" scoped>
.enterprise-coment {
  background-color: #ffffff;
  padding: 15px;
}
</style>
