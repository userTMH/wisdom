<template>
  <div class="cost-coment">
    <div class="conent-top" style="padding-bottom: 10px;border-bottom: 1px solid #ccc;">
      企业名称：
      <el-input v-model="pages.enterpriseName" style="width: 220px;" placeholder="请输入企业名称" size="small"></el-input>
      缴费时间：
      <el-date-picker v-model="DateRange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
        type="daterange" @change="Tiem" format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss">
      </el-date-picker>
      <el-button type="primary" size="small" style="margin-left: 10px;" @click="getList()">查询</el-button>
    </div>
    <div style="margin: 10px 0px;">
      <el-button type="primary" size="small" @click="add">添加账单</el-button>
    </div>
    <div>
      <!-- 表格 -->
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" label="序号">
        </el-table-column>
        <el-table-column prop="billNumber" label="账号编号">
        </el-table-column>
        <el-table-column prop="enterpriseName" label="企业名称">
        </el-table-column>
        <el-table-column prop="buildingName" label="租赁楼宇">
        </el-table-column>
        <el-table-column prop="propertyFeePrice" label="物业费(元/m²)">
        </el-table-column>
        <el-table-column prop="paymentAmount" label="账单金额(元)">
        </el-table-column>
        <el-table-column prop="createTime" label="缴费时间">
        </el-table-column>
        <el-table-column label="地址">
          <template v-slot="{ row }">
            <el-button type="text" @click="proper(row)">查看</el-button>
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
    <!-- 添加对话框 -->
    <el-dialog title="添加账单" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm"
        label-position="top" style="width: 70%;margin: auto;">
        <el-form-item label="选择租户" prop="enterpriseId">
          <el-select v-model="ruleForm.enterpriseId" placeholder="请选择租户" @change="prepayList" size="small"
            style="width: 100%;">
            <el-option v-for="(item, index) in enterpriseList" :key="index" :label="item.name"
              :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="租赁楼宇" prop="buildingId">
          <el-select v-model="ruleForm.buildingId" placeholder="请选择租赁楼宇" @change="prepayList" size="small"
            style="width: 100%;">
            <el-option v-for="(item, index) in buildingList" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="缴费周期" prop="DateRanges">
          <el-date-picker v-model="ruleForm.DateRanges" @change="prepayList" type="daterange" range-separator="至"
            start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" size="small"
            style="width: 100%;">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="支付金额" prop="paymentAmount">
          <el-input v-model="ruleForm.paymentAmount" placeholder="请输入支付金额" :disabled="true" size="small"
            style="width: 100%;"></el-input>
        </el-form-item>

        <el-form-item label="支付方式" prop="paymentMethod">
          <el-select v-model="ruleForm.paymentMethod" placeholder="请选择支付方式" size="small" style="width: 100%;">
            <el-option label="微信" value="1"></el-option>
            <el-option label="支付宝" value="2"></el-option>
            <el-option label="现金" value="3"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 查看 -->
    <el-dialog title="查看账单" :visible.sync="dialog" width="50%" :before-close="handle">
      <div style="width: 60%;margin: auto; color: #909399;display: flex;">
        <div style="text-align: right;margin-right: 10px;">
          <p>租户名称:</p>
          <p>租赁楼宇:</p>
          <p>缴费周期:</p>
          <p>物业费(元/m²):</p>
          <p>账单金额(元):</p>
          <p>支付方式:</p>
          <p>缴费时间:</p>
        </div>
        <div style="color: #000;">
          <p>{{ dialog.billNumber }}</p>
          <p>{{ dialog.buildingName }}</p>
          <p>{{ dialog.startTime }}至{{ dialog.endTime }}</p>
          <p>{{ dialog.propertyFeePrice }}</p>
          <p>{{ dialog.paymentAmount }}</p>
          <p>{{ dialog.paymentMethodValue }}</p>
          <p>{{ dialog.createTime }}</p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog = false">取 消</el-button>
        <el-button type="primary" @click="dialog = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { propertyfeeApi, prepayment, enterpriseApi, buildingApi, propertyApi, properfeeApi, editApi } from '@/api/propety'
export default {
  name: 'VueWisdomIndex',

  data() {
    return {
      DateRange: '',
      pages: {
        enterpriseName: '',
        start: '',
        end: '',
        page: 1,
        pageSize: 10
      },
      tableData: [],    //列表数据
      total: 0,   //列表总数量
      dialogVisible: false,   //对话框状态
      ruleForm: {
        enterpriseId: null,
        buildingId: null,
        startTime: '',
        endTime: '',
        paymentAmount: null,
        paymentMethod: null,
        DateRanges: '',
      },
      rules: {
        enterpriseId: [
          { required: true, message: '请选择租户', trigger: 'blur' }
        ],
        buildingId: [
          { required: true, message: '请选择租赁楼宇', trigger: 'blur' }
        ],
        DateRanges: [
          { required: true, message: '请选择租赁楼宇', trigger: 'blur' }
        ],
        paymentAmount: [
          { required: true, message: '请选择支付金额', trigger: 'blur' }
        ],
        paymentMethod: [
          { required: true, message: '请选择支付方式', trigger: 'blur' }
        ],
      },
      enterpriseList: [],   //选择租户数据
      buildingList: [],    //租赁楼宇数据
      properf: {},   //查看数据
      dialog: false,   //查看弹窗状态
    };
  },
  created() {
    this.getList()
  },
  methods: {
    //获取列表数据
    async getList() {
      const res = await propertyfeeApi(this.pages)
      // console.log(res);
      this.tableData = res.data.rows
      this.total = res.data.total
      this.pages.start = null
      this.pages.end = null
    },
    //日期选择
    Tiem(e) {
      this.pages.start = this.DateRange[0]
      this.pages.end = this.DateRange[1]
    },
    //对话框关闭事件
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.$refs.ruleForm.resetFields();
          this.dialogVisible = false
          this.ruleForm.DateRanges = ''
        })
        .catch(_ => { });
    },
    handle(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.dialog = false
        })
        .catch(_ => { });
    },
    //打开对话框事件
    async add() {
      this.dialogVisible = true
      //获取租户信息
      const res = await enterpriseApi()
      // console.log(res);
      this.enterpriseList = res.data

      //获取楼宇信息
      const res1 = await buildingApi()
      // console.log(res1);
      this.buildingList = res1.data

    },
    //获取支付金额
    async prepayList() {
      this.ruleForm.startTime = this.ruleForm.DateRanges[0]
      this.ruleForm.endTime = this.ruleForm.DateRanges[1]
      if (this.ruleForm.buildingId != null && this.ruleForm.startTime != undefined && this.ruleForm.endTime != undefined) {
        const res = await prepayment({
          buildingId: this.ruleForm.buildingId,
          startTime: this.ruleForm.startTime,
          endTime: this.ruleForm.endTime
        })
        // console.log(res);
        if (res.code == 10000) {
          this.ruleForm.paymentAmount = res.data
        }
      }
    },
    //确认按钮
    submitForm() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          // alert('submit!');
          delete this.ruleForm.DateRanges
          const res = await propertyApi(this.ruleForm)
          // console.log(res);
          if (res.code == 10000) {
            this.$message.success('添加成功')
            this.getList()
            this.$refs.ruleForm.resetFields();
            this.dialogVisible = false
            this.ruleForm.DateRanges = ''
          } else {
            this.$message.success('添加失败')
            this.getList()
            this.$refs.ruleForm.resetFields();
            this.dialogVisible = false
            this.ruleForm.DateRanges = ''
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    //查看
    async proper(row) {
      this.dialog = true
      const res = await properfeeApi(row.id)
      // console.log(res);
      this.dialog = res.data
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
  },
};
</script>

<style lang="scss" scoped>
.cost-coment {
  background-color: #ffffff;
  padding: 15px;
}
</style>
