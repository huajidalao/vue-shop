<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- /面包屑导航 -->
    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <!-- 用栅格系统来控制宽度 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="userInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table style="width: 100%" border :data="userlist">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <!-- 状态栏 -->
        <el-table-column label="状态">
          <!-- 将按钮做成可切换的 -->
          <!-- 这是父给子传递数据 -->
          <template slot-scope="scope">
            <el-switch
              active-color="#13ce66"
              inactive-color="#ff4949"
              v-model="scope.row.mg_state"
              @change="userStateChanged(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <!-- /状态栏 -->
        <!-- 操作栏 -->
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
            <el-tooltip effect="dark" content="分配角色" placement="top" enterable>
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <!-- /操作栏 -->
      </el-table>
      <!-- /用户列表区域 -->

      <!-- 做分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange "
        :current-page="userInfo.pagenum"
        :page-sizes="[1, 2, 3, 4]"
        :page-size="userInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- /卡片 -->
    <!-- 做添加用户的对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
      @close="addDialogClosed"
    >
      <!-- 做输入框 -->
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="ruleForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="ruleForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- /做输入框 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!--/ 做添加用户的对话框 -->

    <!-- 做编辑，点击编辑出现对话框-->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="rules"
        ref="editFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- /做编辑 -->

    <!-- 做删除用户 -->

    <!-- /做删除用户 -->
  </div>
</template>


<script>
export default {
  data: function() {
    var checkEmail = (rule, val, callback) => {
      //设定规则对象
      const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if (!reg.test(val)) {
        //如果为错就callback错误对象
        callback(new Error("不符合邮箱规则"));
      }
      callback();
    };
    var checkMobile = (rule, val, callback) => {
      //设定规则对象
      const reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (!reg.test(val)) {
        //如果为错就callback错误对象
        callback(new Error("不符合手机号的规则"));
      }
      callback();
    };
    // -----------------------------------------------
    return {
      data: "",
      userInfo: {
        query: "",
        //多少页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 1
      },
      userlist: [],
      total: 0,
      dialogVisible: false,
      rules: {
        // 这个name、password、email、mobile就是prop里的
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "用户名的长度在6~15个字符之间",
            trigger: "blur"
          }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      },
      ruleForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      editDialogVisible: false,
      editForm: {
        username: "",
        email: "",
        mobile: ""
      }
    };
  },
  created: function() {
    // let {data: res} = await this.$http.
    this.getUserList();
  },
  methods: {
    async getUserList() {
      let { data: res } = await this.$http.get("users", {
        params: this.userInfo
      });
      if (res.meta.status != 200) {
        //失败就报错，并终止函数
        return this.$message.error("获取用户列表失败！");
      }
      //成功就将请求的数据渲染出来
      this.userlist = res.data.users;
      this.total = res.data.total;
    },
    // 当改变每页的数据量时要重新给后台发送数据
    handleSizeChange(val) {
      this.userInfo.pagesize = val;
      console.log(val);
      this.getUserList();
    },
    // 当改变页码数时也要重新给后台发送请求
    handleCurrentChange(val) {
      this.userInfo.pagenum = val;
      this.getUserList();
    },
    async userStateChanged(obj) {
      let status = obj.mg_state;
      let id = obj.id;
      console.log(status);
      //要让后台知道状态更新了,发送请求
      let { data: res } = await this.$http.put(`users/${id}/state/${status}`);
      if (res.meta.status != 200) {
        //说明更新错误,因为形参是对象，所以只要里面修改了成员，那真的对象也被修改了
        obj.mg_state = !obj.mg_state;
        return this.$message.error("状态修改失败");
      }
      this.$message.success("状态修改成功");
    },
    //对话框关闭时触发
    handleClose() {
      this.dialogVisible = false;
    },
    addDialogClosed() {
      this.$refs.ruleForm.resetFields();
    },
    addUser() {
      //要进行预校验，如果通过了就向后端发送请求
      this.$refs.ruleForm.validate(async valid => {
        console.log(valid);
        if (!valid) return;
        const { data: res } = await this.$http.post("users", this.ruleForm);
        if (res.meta.status != 201) {
          return this.$message.error("添加用户失败");
        }
        this.$message.success("添加用户成功");
        this.dialogVisible = false;
        //重新获取数据
        this.getUserList();
      });
      // const {data: res} = this.$http.post("")
    },
    async showEditDialog(id) {
      this.editDialogVisible = true;
      //然后请求后端，获取最新数据
      let { data: res } = await this.$http.get("users/" + id);
      //只有请求成功再把数据填入输入框里
      if (!res.meta.status == 200) {
        return this.$message.error("查询用户信息失败");
      }
      //这里展示编辑用户信息的时候，就已经把当前用户的id存到editForm里
      this.editForm = res.data;
    },
    editUserInfo() {
      //先进行预验证，通过了再请求后端
      //这是为了获得表单组件，然后调用它的方法，validate是预验证
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return this.$message.error("验证失败");
        //验证成功就请求后端
        let { data: res } = await this.$http.put("users/" + this.editForm.id, {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        });
        console.log(res);
        if (!res.meta.status == 200) {
          return this.$message.error("更新用户信息失败！");
        }
        this.getUserList();
        this.editDialogVisible = false;
        this.$message.success("更新用户信息成功！");
      });
    },
    editDialogClosed() {
      //只要关闭就初始化表单
      this.$refs.editFormRef.resetFields();
    },
    removeUserById(id) {
      //这种删除操作，你得告诉后端id，然后它才能去删
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
          //点击确认就要请求后端
          let {data: res} = await this.$http.delete('users/'+id);
          if(res.meta.status != 200) {
              return this.$message.error("删除用户失败")
          }
          this.getUserList();
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        }).catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>


<style lang="less" scoped>
</style>
