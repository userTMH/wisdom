<template>
  <div style="height: calc(100vh);display: flex;flex-direction: column;">
    <div style="width: 100%;padding: 20px;">
      <el-page-header @back="goBack" content="添加角色">
      </el-page-header>
    </div>
    <div style="height:80% ; background-color: #f4f6f8;padding: 20px;display: flex;">
      <el-steps direction="vertical" :active="active" style="height: 170px;">
        <el-step title="角色信息"></el-step>
        <el-step title="权限信息"></el-step>
        <el-step title="检查并完成"></el-step>
      </el-steps>
      <div v-if="active == 1"
        style="width: 700px;height: 230px; margin-left: 200px;background-color: #fff;padding: 10px 0px;">
        <p style="border-left: 2px solid #4770ff;padding-left: 10px;">角色信息</p>
        <div>
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm"
            style="width: 80%;margin: auto;">
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="ruleForm.roleName" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" prop="remark">
              <el-input type="textarea" v-model="ruleForm.remark" placeholder="请输入"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <div v-if="active == 2"
        style="width: 700px;overflow: auto; margin-left: 200px;background-color: #fff;padding: 10px 0px;">
        <p style="border-left: 2px solid #4770ff;padding-left: 10px;">权限配置</p>
        <div style="width: 90%;margin: auto; display: flex;flex-wrap: wrap;">
          <div style="width: 30%;margin-left: 10px;border-left: 1px solid #f3f4f6;padding: 10px;"
            v-for="(item, index) in dataList" :key="index">
            <div style="width: 100%;background-color: #f5f7fa;padding: 1px 15px;text-align: center;">
              <p>{{ item.title }}</p>
            </div>
            <el-tree :data="item.children" show-checkbox node-key="id" :props="defaultProps" ref="tree"
              default-expand-all>
            </el-tree>
          </div>
        </div>
      </div>

      <div v-if="active == 3"
        style="width: 700px;overflow:auto; margin-left: 200px;background-color: #fff;padding: 10px 0px;">
        <p style="border-left: 2px solid #4770ff;padding-left: 10px;">检查并完成</p>
        <div style="margin-left: 50px;margin-bottom: 20px;color: #ccc;">
          <div>角色名称: <span style="color: #000;">{{ ruleForm.roleName }}</span></div>
          <div>角色描述: <span style="color: #000;">{{ ruleForm.remark }}</span></div>
          <div>角色权限:</div>
        </div>
        <div style="width: 80%;margin: auto; display: flex;flex-wrap: wrap;">
          <div style="width: 30%;margin-left: 10px;border-left: 1px solid #f3f4f6;padding: 10px;"
            v-for="(item, index) in diabledTree" :key="index">
            <div style="width: 100%;background-color: #f5f7fa;padding: 1px 15px;text-align: center;">
              <p>{{ item.title }}</p>
            </div>
            <el-tree :data="item.children" show-checkbox node-key="id" :props="defaultProps" ref="diabled"
              default-expand-all :highlight-current="false">
            </el-tree>
          </div>
        </div>
      </div>
    </div>
    <div style="text-align: center;padding: 20px;background-color: #fff;">
      <el-button v-if="active != 1" @click="active--">上一步</el-button>
      <el-button type="primary" @click="submitForm">下一步</el-button>
    </div>
  </div>
</template>

<script>
import { treeListApi, sysroApi, sysroleApi } from '@/api/system'

export default {
  name: 'VueWisdomIndex',

  data() {
    return {
      active: 1,
      ruleForm: {
        roleName: '',
        remark: '',
        perms: []
      },
      rules: {
        roleName: [
          { required: true, message: '请输角色名称!', trigger: 'blur' },
        ],
      },
      diabledTree: [],
      dataList: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      eid: 0
    };
  },
  created() {
    this.treeList()
    this.eid = this.$route.query.id;
    if (this.eid == 0) {
      this.ruleForm = {
        roleName: '',
        remark: '',
        perms: []
      }
    } else {
      this.getList()
    }
  },
  methods: {
    goBack() {
      this.$router.back()
    },
    async getList() {
      const res = await sysroleApi(this.eid)
      // console.log(res);
      this.ruleForm = res.data
      console.log(this.$refs.tree);
      this.$refs.tree.forEach((tree, index) => {
        tree.setCheckedKeys(this.ruleForm.perms[index])
      })
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
      this.diabledTree = res.data.map(item => {
        return {
          ...item,
          perms: [],
        }
      })
    },

    async submitForm() {
      if (this.active == 1) {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            // alert('submit!');
            this.active++
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      } else if (this.active == 2) {
        this.ruleForm.perms = []
        this.$refs.tree.forEach(tree => {
          this.ruleForm.perms.push(tree.getCheckedKeys())
        })
        if (this.ruleForm.perms.length == 0) {
          this.$message({
            type: 'error',
            message: '请至少选择一个权限点'
          })
        } else {
          this.active++
          this.$nextTick(() => {
            this.$refs.diabled.forEach((tree, index) => {
              tree.setCheckedKeys(this.ruleForm.perms[index])
            })
          });
          this.diabledTree.forEach((item) => {
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
        }
      } else {
        const res = await sysroApi(this.ruleForm)
        // console.log(res);
        if (res.code == 10000) {
          this.$message.success('添加成功')
          this.$router.back()
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
