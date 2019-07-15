<template>
  <div class="login-container">
    <div class="login-box">
      <div class="avatar_box">
        <img src="../assets/logo.png" alt />
      </div>
      <!-- 登录表单区域 -->
      <!-- 组件的template里可以加入全局组件，比如在element.js里暴露的自定义组件 -->
      <el-form label-width="0px" class="login_form" :model="loginForm" :rules="loginFormRules" ref="loginFormRef">
        <el-form-item prop="username">
          <el-input
            type="text"
            placeholder="请输入内容"
            prefix-icon="iconfont icon-user"
            v-model="loginForm.username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            prefix-icon="iconfont icon-3702mima"
            v-model="loginForm.password"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button @click="resetLoginForm" type="info">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>


<script>
export default {
  data: function() {
    return {
      // 给用户名和密码双向数据绑定
      loginForm: {
        username: "admin",
        password: "123456"
      },
      //添加验证规则
      loginFormRules: {
        username: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入登录密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
      resetLoginForm() {
          //resetFields重置方法
        this.$refs.loginFormRef.resetFields();
      },
      //点击了提交，对整个表达进行校验
      login() {
      this.$refs.loginFormRef.validate(async valid => {
          console.log(valid)
          //没通过就中断函数，停止提交
          if(!valid) {
            return;
          }
          // 表单校验成功就可以提交数据给后端了
          console.log(34)
          const {data: res} = await this.$http.post("login",this.loginForm);
          console.log(res,343)
          if(res.meta.status!=200) {
            this.$message.error('登录失败！')
            return;
          }
          //这里表明后端登录成功
          this.$message.success("登录成功！！")
          //将登录成功的token保存到sessionStorage里
          sessionStorage.setItem("token",res.data.token);
          this.$router.push("/home");
      })
        
      }
}
}
</script>


<style lang="less" scoped>
.login-container {
  position: relative;
  background-color: #2b4b6b;
  height: 100%;
}
.login-box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
}
.avatar_box {
  width: 130px;
  height: 130px;
  border: 1px solid #ccc;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns {
  //使用flex布局
  display: flex;
  justify-content: flex-end;
}
</style>

