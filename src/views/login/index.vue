<template>
  <div class="login-container">
    <div class="login-left">
    </div>
    <div class="login-right">
      <div class="right-content">
        <p style="padding-bottom: 76px;font-size: 26px;">智慧园区-登录</p>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm" label-position="top"
          hide-required-asterisk:true>
          <el-form-item label="账号" prop="username">
            <el-input v-model="ruleForm.username" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="ruleForm.password" size="mini" show-password></el-input>
          </el-form-item>
          <el-form-item label="" prop="">
            <el-checkbox label="记住我" name="type"></el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="width: 100%;" @click="submitForm">登录</el-button>
          </el-form-item>
        </el-form>
        <p style="color: red; font-size: 14px;">仅用于IT培训教学使用,为保障您的个人信息安全,请勿向平台录入任何个人敏感信息(如手机号、身份证号等)!</p>
      </div>
    </div>
  </div>
</template>

<script>
import { loginApi } from '@/api/login'
import axios from 'axios'
export default {
  name: 'Login',
  data() {
    return {
      ruleForm: {
        username: 'demo',
        password: 'zh@hm#23'
      },
      rules: {
        username: [
          { required: true, message: '请输入账号!', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码!', trigger: 'blur' },
        ],
      },
    }
  },
  methods: {
    submitForm() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          // alert('submit!');
          const res = await this.$store.dispatch('user/Login', this.ruleForm)
          this.$router.push('/')
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
  }
}
</script>
<style lang="scss" scoped>
$bg: #fff;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  width: 100vw;
  height: 100vh;
  display: flex;

  .login-left {
    width: 60%;
    background-image: url(https://fe-hmzs.itheima.net/assets/login-bg-e4ea539c.svg);
    background-size: 100%;
  }

  .login-right {
    width: 40%;
    display: flex;
    justify-content: center;

    .right-content {
      width: 300px;
      height: 254px;
    }
  }
}
</style>
