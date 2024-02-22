<template>
  <div class="billing-coment">
    <div class="conent-top" style="padding-bottom: 15px;">
      <el-button type="primary" size="small" style="margin-left: 10px;" @click="add">增加停车计费规则</el-button>
    </div>
    <div>
      <!-- 表格 -->
      <el-table :data="tableData" style="width: 100%" v-loading="loading" element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading" element-loading-background="rgba(ff, ff, ff, 0.8)">
        <el-table-column type="index" label="序号">
        </el-table-column>
        <el-table-column prop="ruleNumber" label="计费规则编号" width="120">
        </el-table-column>
        <el-table-column prop="ruleName" label="计费规则名称" width="120">
        </el-table-column>
        <el-table-column prop="freeDuration" label="免费时长(分钟)" width="120">
        </el-table-column>
        <el-table-column prop="chargeCeiling" label="收费上限(元)" width="120">
          <template v-slot="{ row }">
            <span>{{ row.chargeCeiling ? row.chargeCeiling : '--' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="chargeType" label="计费方式" width="120">
          <template v-slot="{ row }">
            <span>{{ row.chargeType == 'duration' ? '时长收费' : row.chargeType == 'partition' ? '分段收费' : '按次收费' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="ruleNameView" label="计费规则" width="360">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template v-slot="{ row }">
            <el-button type="text" size="small" @click="add(row)">编辑</el-button>
            <el-button type="text" size="small">删除</el-button>
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
    <!-- 弹窗 -->
    <el-dialog title="添加计费规则" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm"
        label-position="top" style="width: 75%;margin: auto;">
        <!-- 计费规则编号 -->
        <el-form-item label="计费规则编号" prop="ruleNumber">
          <el-input v-model="ruleForm.ruleNumber" size="small" placeholder="请输入计费规则编号"></el-input>
        </el-form-item>

        <!-- 计费规则名称 -->
        <el-form-item label="计费规则名称" prop="ruleName">
          <el-input v-model="ruleForm.ruleName" size="small" placeholder="请输入计费规则名称"></el-input>
        </el-form-item>

        <!-- 计费方式(全天收费) -->
        <el-form-item label="计费方式(全天收费)" prop="chargeType">
          <el-radio-group v-model="ruleForm.chargeType" size="medium">
            <el-radio border label="duration" value="duration">时长收费</el-radio>
            <el-radio border label="turn" value="turn">按次收费</el-radio>
            <el-radio border label="partition" value="partition">分段收费</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 免费时长、收费上限 -->
        <el-form-item label="" prop="freeDuration">
          <template v-slot="{ row }">
            <div style="display: flex;justify-content: space-between;align-items: center;">
              <span style="width: 55%;">免费时长</span>
              <span style="width: 45%;">收费上限</span>
            </div>
            <div style="display: flex;justify-content: space-between;align-self: start;">
              <el-input-number v-model="ruleForm.freeDuration" controls-position="right" :min="1" :max="10"
                style="width: 40%;"></el-input-number>分钟
              <el-input v-model="ruleForm.chargeCeiling" placeholder="请输入收费上限" style="width: 40%;"></el-input>元
            </div>
          </template>
        </el-form-item>

        <!-- 计费规则 -->
        <el-form-item label="计费规则">
          <!-- 时长收费 -->
          <div style="display: flex;justify-content: space-between;align-self: start;"
            v-if="ruleForm.chargeType == 'duration'">
            <!-- 时长计费单位时间 -->
            <el-form-item prop="durationTime" style="width: 20%;">
              每
              <el-input-number controls-position="right" :min="1" :max="10" style="width: 80%;" placeholder="请输入"
                v-model="ruleForm.durationTime"></el-input-number>
            </el-form-item>
            <!-- 时长计费单位价格 -->
            <el-form-item prop="durationType" style="width: 20%;">
              <el-select v-model="ruleForm.durationType" placeholder="请选择">
                <el-option label="小时" value="hour"></el-option>
                <el-option label="分钟" value="minute"></el-option>
              </el-select>
            </el-form-item>

            <!-- 时长收费类型 -->
            <el-form-item prop="durationPrice" style="width: 30%;display: flex;">
              <el-input v-model="ruleForm.durationPrice" placeholder="请输入收费上限" style="width: 80%;"></el-input>元
            </el-form-item>
          </div>

          <!-- 按次收费 -->
          <div style="display: flex;align-self: start;" v-if="ruleForm.chargeType == 'turn'">
            每次
            <!-- 按次收费：每次价格 -->
            <el-form-item prop="turnPrice" style="width: 50%;margin:0px 10px;">
              <el-input v-model="ruleForm.turnPrice" placeholder="请输入金额" style="width: 80%;"></el-input>元
            </el-form-item>
          </div>

          <!-- 分段收费 -->
          <div v-if="ruleForm.chargeType == 'partition'">

            <div style="display: flex;align-self: start;margin-bottom: 10px;">
              <!-- 分段收费:段内时间 -->
              <el-form-item prop="partitionFrameTime" style="width: 50%;margin-right: 10px;">
                <el-input-number controls-position="right" :min="1" :max="10" style="width: 40%;" placeholder="请输入"
                  v-model="ruleForm.partitionFrameTime"></el-input-number>
                小时内，每小时收费
              </el-form-item>
              <!-- 分段收费:段内费用 -->
              <el-form-item prop="partitionFramePrice" style="width: 20%;margin: 0px 10px;">
                <el-input v-model="ruleForm.partitionFramePrice" placeholder="请输入" style="width: 80%;"></el-input>元
              </el-form-item>
            </div>

            <div style="display: flex;align-self: start;margin-top: 30px;">
              <!-- 分段收费:超出时间 -->
              每增加
              <el-form-item prop="partitionIncreaseTime" style="width: 30%;margin: 0px 10px;">
                <el-input-number controls-position="right" :min="1" :max="10" style="width: 100%;" placeholder="请输入"
                  v-model="ruleForm.partitionIncreaseTime"></el-input-number>
              </el-form-item>
              小时，增加
              <!-- 分段收费:超出范围收费价钱 -->
              <el-form-item prop="partitionIncreasePrice" style="width: 30%;margin: 0px 10px;">
                <el-input v-model="ruleForm.partitionIncreasePrice" placeholder="请输入"></el-input>
              </el-form-item>元
            </div>
          </div>
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
import { rulelistApi, ruleListApi } from '@/api/car'
export default {
  name: 'VueWisdomIndex',

  data() {
    return {
      pages: {
        page: 1,
        pageSize: 10
      },
      //数据总数
      total: 0,
      //表格数据
      tableData: [],
      // 加载动画状态
      loading: false,
      //弹窗状态
      dialogVisible: false,
      ruleForm: {
        ruleNumber: '',//计费规则编号
        ruleName: '',//计费规则名称
        freeDuration: null,//免费时长
        chargeCeiling: null,//收费上限
        chargeType: 'duration',//收费类型
        // 时长收费
        durationTime: null,//时长计费单位时间
        durationPrice: null,//时长计费单位价格
        durationType: '',//时长收费类型
        // 按次收费
        turnPrice: null,//按次收费：每次价格
        // 分段收费
        partitionFrameTime: null,//分段收费:段内时间
        partitionFramePrice: null,//分段收费:段内费用
        partitionIncreaseTime: null,//分段收费:超出时间
        partitionIncreasePrice: null//分段收费:超出范围收费价钱
      },
      rules: {
        ruleNumber: [
          { required: true, message: '请输入计费规则编号', trigger: 'blur' },
        ],
        ruleName: [
          { required: true, message: '请输入计费规则名称', trigger: 'blur' },
        ],
        durationTime: [
          { required: true, message: '请输入计费时间', trigger: 'blur' },
        ],
        durationPrice: [
          { required: true, message: '请输入计费金额', trigger: 'blur' },
        ],
        durationType: [
          { required: true, message: '请输入计费时间单位', trigger: 'blur' },
        ],
        turnPrice: [
          { required: true, message: '请输入计费金额!', trigger: 'blur' },
        ],
        partitionFrameTime: [
          { required: true, message: '请输入计费时间!', trigger: 'blur' },
        ],
        partitionFramePrice: [
          { required: true, message: '请输入计费金额!', trigger: 'blur' },
        ],
        partitionIncreaseTime: [
          { required: true, message: '请输入计费时间!', trigger: 'blur' },
        ],
        partitionIncreasePrice: [
          { required: true, message: '请输入计费金额!', trigger: 'blur' },
        ],
      }
    };
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.loading = true
      const res = await rulelistApi(this.pages)
      // console.log(res);
      if (res.code == 10000) {
        this.tableData = res.data.rows
        this.total = res.data.total
        this.loading = false
      }
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
    //弹窗关闭事件
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => { });
    },
    //打开弹窗
    add(e) {
      this.dialogVisible = true
    },
    //确定按钮
    submitForm() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          const res = await ruleListApi(this.ruleForm)
          // console.log(res);
          if (res.code == 10000) {
            this.$message.success('添加成功')
            this.getList()
            this.$refs.ruleForm.resetFields();
            this.dialogVisible = false
          } else {
            this.$message.success('添加失败')
            this.getList()
            this.$refs.ruleForm.resetFields();
            this.dialogVisible = false
          }

        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.billing-coment {
  background-color: #ffffff;
  padding: 15px;
}

.el-radio {
  // padding: 10px 15px;
  border: 1px solid #5a7fff;
  // border-radius: 5px;
}
</style>
