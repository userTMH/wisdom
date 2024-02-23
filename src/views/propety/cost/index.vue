<template>
  <div class="cost-coment">
    <div class="conent-top" style="padding-bottom: 10px;border-bottom: 1px solid #ccc;">
      企业名称：
      <el-input v-model="pages.enterpriseName" style="width: 220px;" placeholder="请输入企业名称" size="small"></el-input>
      缴费时间：
      <el-date-picker v-model="DateRange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
        type="daterange">
      </el-date-picker>
      <el-button type="primary" size="small" style="margin-left: 10px;" @click="getList()">查询</el-button>
    </div>
    <div style="margin: 10px 0px;">
      <el-button type="primary">添加账单</el-button>
    </div>
    <div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" label="序号">
        </el-table-column>
        <el-table-column prop="name" label="账号编号">
        </el-table-column>
        <el-table-column prop="address" label="企业名称">
        </el-table-column>
        <el-table-column prop="address" label="租赁楼宇">
        </el-table-column>
        <el-table-column prop="address" label="物业费(元/m²)">
        </el-table-column>
        <el-table-column prop="address" label="账单金额(元)">
        </el-table-column>
        <el-table-column prop="address" label="缴费时间">
        </el-table-column>
        <el-table-column label="地址">
          <template v-slot="{ row }">
            <el-button type="text">查看</el-button>
            <el-button type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
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
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
      ]
    };
  },

  methods: {
    async getList() {
      // const res=await
      console.log(this.DateRange);
    }
  },
};
</script>

<style lang="scss" scoped>
.cost-coment {
  background-color: #ffffff;
  padding: 15px;
}
</style>
