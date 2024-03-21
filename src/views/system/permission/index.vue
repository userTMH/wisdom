<template>
  <div class="permission-coment">
    <div style="width: 25%;  padding: 10px;">
      <div class="box" :class="{ active: act == index }" @click="tab(index, item.roleId)"
        v-for="(item, index) in leftList" :key="index">
        <p>
          <i class="el-icon-user"></i>
          <el-tooltip class="item" effect="dark" :content="item.remark" placement="top">
            <span style="margin-left: 5px;">{{ item.roleName }}</span>
          </el-tooltip>
        </p>

        <el-dropdown>
          <span class="el-dropdown-link">
            <i class="el-icon-more"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="edit(item.roleId)">编辑</el-dropdown-item>
            <el-dropdown-item @click.native="deletes(item.roleId)">删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div>
        <el-button style="width: 95%;margin: auto;" size="small" v-auth-btn="'sys:role:add_edit'"
          @click="add">添加角色</el-button>
      </div>
    </div>


    <div style="width: 70%;border-left: 1px solid #f3f4f6;margin-left: 10px;">
      <el-tabs v-model="activeName" @tab-click="handleClick" style="padding: 10px;">
        <el-tab-pane label="用户管理" name="first">
          <div style="display: flex;">
            <div style="width: 20%;border-left: 1px solid #f3f4f6;padding: 10px;" v-for="(item, index) in dataList"
              :key="index">
              <div style="width: 100%;background-color: #f5f7fa;padding: 1px 15px;text-align: center;">
                <p>{{ item.title }}</p>
              </div>
              <el-tree :data="item.children" show-checkbox node-key="id" :default-expanded-keys="item.perms"
                :default-checked-keys="item.perms" :props="defaultProps" ref="tree">
              </el-tree>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { roleListApi, treeListApi, sysroleApi, deletesApi } from '@/api/system'
export default {
  name: 'VueWisdomIndex',

  data() {
    return {
      leftList: [],
      activeName: 'first',
      act: 0,
      roleId: 0,
      dataList: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      }
    };
  },

  created() {
    this.getList()
    this.treeList()
  },

  methods: {
    //左侧角色菜单
    async getList() {
      const res = await roleListApi()
      // console.log(res);
      this.leftList = res.data
      this.Find(res.data[0].roleId)
    },
    //树形结构数据
    async treeList() {
      const res = await treeListApi()
      // console.log(res);
      this.dataList = res.data.map(item => {
        return {
          ...item,
          perms: [],
        }
      })
      this.dataList.forEach((item) => {
        item.disabled = true
        item.children.forEach((a) => {
          a.disabled = true
          if (a.children) {
            a.children.forEach((b) => {
              b.disabled = true
            })
          }
        })
      })
    },
    //查询当前角色详情-权限和分配人数
    async Find(id) {
      const res = await sysroleApi(id)
      // console.log(res);
      this.dataList.forEach((item, index) => {
        item.perms = res.data.perms[index]
      })
    },

    handleClick(tab, event) {
      console.log(tab.index);
    },
    //Tab切换
    tab(id, row) {
      this.act = id
      this.roleId = row
      this.$refs.tree.forEach((item, index) => {
        item.setCheckedKeys([])
      })
      this.Find(row)
    },
    add() {
      this.$router.push('/system/role/add')
    },
    //删除
    deletes(e) {
      // console.log(e);
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await deletesApi(e)
        if (res.code == 10000) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    //编辑
    edit(e) {
      // this.$route.params(`/system/role/add/?id=${id}`)
      this.$router.push({
        path: '/system/role/add/',
        query: {
          // url的参数, 类似get请求的传参
          id: e
        },
      })
    },
  },
};
</script>

<style lang="scss" scoped>
.permission-coment {
  background-color: #ffffff;
  display: flex;

  .box {
    padding: 5px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.active {
  background-color: #edf5ff;
}
</style>
