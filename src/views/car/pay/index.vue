<template>
  <div class="pay-coment">
    <div class="conent-top">
      车牌号码：<el-input v-model="pages.carNumber" style="width: 220px;" placeholder="请输入车牌号码" size="small"></el-input>
      缴纳状态：<el-select v-model="pages.paymentStatus" placeholder="未选择" size="small" style="margin-left: 10px;">
        <el-option label="全部" value="null"></el-option>
        <el-option label="代缴纳" value="0"></el-option>
        <el-option label="已缴纳" value="1"></el-option>
      </el-select>
      <el-button type="primary" size="small" style="margin-left: 10px;" @click="getList()">查询</el-button>
    </div>
    <div>
      <el-table :data="tableData" style="width: 100%" v-loading="loading" element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading" element-loading-background="rgba(ff, ff, ff, 0.8)">
        <el-table-column type="index" label="序号">
        </el-table-column>
        <el-table-column prop="carNumber" label="车牌号码">
        </el-table-column>
        <el-table-column prop="chargeType" label="收费类型">
          <template v-slot="{ row }">
            <span>{{ row.chargeType == "temp" ? '临时停车' : '月卡' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="parkingTime" label="停车总时长">
        </el-table-column>
        <el-table-column prop="actualCharge" label="缴纳费用(元)">
        </el-table-column>
        <el-table-column prop="paymentStatus" label="缴纳状态">
          <template v-slot="{ row }">
            <span>{{ row.paymentStatus == 0 ? '未缴纳' : '已缴纳' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="paymentMethod" label="缴纳方式">
          <template v-slot="{ row }">
            <span>{{ row.paymentMethod == "Alipay" ? '支付宝' : row.paymentMethod == "WeChat" ? '微信' : '--' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="paymentTime" label="缴纳时间">
        </el-table-column>
      </el-table>
      <div style="display: flex;justify-content: space-between;">
        <p></p>
        <el-pagination @size-change="handleSizeChange" @current-change="handleSizeChanges" :current-page="pages.page"
          :page-sizes="[10, 20, 30, 40]" :page-size="pages.pageSize" layout="total, prev, sizes, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { paymentlistApi } from '@/api/car'
export default {
  name: 'VueWisdomIndex',

  data() {
    return {
      pages: {
        carNumber: '',
        paymentStatus: null,
        page: 1,
        pageSize: 10
      },
      total: 0,
      tableData: [],
      loading: false
    };
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.loading = true
      const res = await paymentlistApi(this.pages)
      // console.log(res);
      if (res.code == 10000) {
        this.total = res.data.total
        this.tableData = res.data.rows
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
  },
};
</script>

<style lang="scss" scoped>
.pay-coment {
  background-color: #ffffff;
  padding: 15px;
}

.conent-top {
  border-bottom: 1px solid #ccc;
  padding-bottom: 15px;
}
</style>
