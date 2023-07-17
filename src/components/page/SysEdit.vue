<template>
    <div>
        <!-- 面包屑容器 -->
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 密码修改
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="当前密码" prop="oldPass">
                    <el-input type="password" v-model="form.oldPass" show-password style="width: 200px"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPass">
                    <el-input type="password" v-model="form.newPass" show-password style="width: 200px"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="newPass2">
                    <el-input type="password" v-model="form.newPass2" show-password style="width: 200px"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">更改</el-button>
                    <el-button>取消</el-button>
                </el-form-item>
                </el-form>
        </div>

    </div>
</template>

<script>
import { mapState } from "vuex";
export default {
    name: 'sysEdit',
    data() {
        var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.form.newPass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
        return {
            // 条件
            form: {
                oldPass: '',
                newPass:'',
                newPass2:''
            },
            rules:{ 
                oldPass: [
                    { required: true, message: '请输入原密码', trigger: 'blur' }
                ],
                newPass:[
                    { validator: validatePass, required: true,trigger: 'blur' }
                ],
                newPass2:[
                    {  validator: validatePass2, required: true,trigger: 'blur' }
                ]
            }
        };

    },
    computed: {
        adminId(){
            return JSON.parse(localStorage.getItem('userInfo')).id;
        }
    },
    mounted(){
    },
    methods: {
        
        // 保存编辑
        async onSubmit() {
            //发送请求进行更改 
            try {
                let id = {id: this.adminId};
                await this.$store.dispatch("editAdminById",{...this.form, ...id});
                this.$message.success(`修改成功`);
                localStorage.removeItem('userInfo');
                this.$router.push('/login');
            } catch (error) {
                this.$message.error("修改失败！请稍后再试");
            }
        },
    }
};
</script>

<style scoped>
.textarea >>> .el-textarea__inner{
 /* font-size:20px !important; */
 color:black !important;
}
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
.table-td-thumb2 {
    display: block;
    margin-left: 20px;
    width: 40px;
    height: 40px;
}
</style>
