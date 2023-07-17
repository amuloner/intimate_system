<template>
    <div>
        <!-- 面包屑容器 -->
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 咨询师数据
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
            <!-- 表格功能栏 -->
            <div class="handle-box">
                <el-button
                    type="primary"
                    icon="el-icon-delete"
                    class="handle-del mr10"
                    @click="delAllSelection"
                >批量取消</el-button>
                <el-input v-model="query.name" placeholder="用户名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <!-- 表格数据体 -->
            <el-table
                :data="conList.records"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                fit
                style="width: 100%"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column fixed="left" label="ID" width="55" align="center">
                    <template slot-scope="scope">
                        {{(query.pageIndex - 1) * query.pageSize + scope.$index+1}}
                    </template>
                </el-table-column>
                <el-table-column fixed="left" prop="name" label="姓名" align="center"></el-table-column>
                <el-table-column label="性别" align="center">
                    <template slot-scope="scope">
                        {{scope.row.gender==='1'?'男':'女'}}
                    </template>
                </el-table-column>
                <!-- <el-table-column prop="age" label="年龄" align="center"></el-table-column> -->
                <el-table-column prop="conNum" label="咨询次数" align="center"></el-table-column>
                <el-table-column prop="conLikes" label="咨询获赞量" align="center"></el-table-column>
                <el-table-column prop="essayNum" label="发表文章数" align="center">
                    <template slot-scope="scope">
                        {{scope.row.essayNum ? scope.row.essayNum : 0}}
                    </template>
                </el-table-column>
                <!-- <el-table-column prop="essayLikes" label="文章点赞总量" align="center"></el-table-column> -->
                <el-table-column prop="complaintsNum" label="被投诉次数" align="center"></el-table-column>
                <el-table-column prop="atcationDate" label="认证时间" align="center" width="95"></el-table-column>
                <!-- <el-table-column prop="conIntro" label="简介" show-overflow-tooltip></el-table-column> -->
                <!-- <el-table-column label="实名状态">
                    <template slot-scope="scope">
                        {{!scope.row.idCard?"未实名":"已实名"}}
                    </template>         
                </el-table-column> -->
                <el-table-column label="操作" width="180" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleView(scope.row)"
                        >查看</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.row)"
                        >取消资格</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页插件 -->
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.pageIndex"
                    :page-size="query.pageSize"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="查看" :visible.sync="editVisible" width="40%">
            <el-form ref="form" :model="form" label-width="90px" label-position="left">

                <el-row>
                    <el-col :span="8">
                        <el-form-item label="用户名:">
                            {{form.name}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="性别">
                            <label slot="label">性&nbsp;&nbsp;&nbsp;&nbsp;别:</label>
                            {{form.gender == '1'?'男':'女'}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="年龄">
                            <label slot="label">年&nbsp;&nbsp;&nbsp;&nbsp;龄:</label>
                            {{getAge("511721200101211390")}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="咨询次数:">
                            {{form.conNum}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="咨询点赞:">
                            {{form.conLikes}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="文章发表数:">
                            {{form.essayNum}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="文章获赞数:">
                            {{form.essayLikes || 0}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="被投诉次数:">
                            {{form.complaintsNum}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="认证时间:">
                            {{form.atcationDate}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <!-- <el-form-item label="简介">
                    <label slot="label">简&nbsp;&nbsp;&nbsp;&nbsp;介:</label>
                    <el-input class="textarea" disabled type="textarea" rows="10" v-model="form.conIntro"></el-input>
                </el-form-item> -->
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false; form = {}" type="primary">关 闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapState } from "vuex";
export default {
    name: 'docotortable',
    data() {
        return {
            // 搜索条件
            query: {
                name: '',
                pageIndex: 1,
                pageSize: 6
            },
            multipleSelection: [],
            //编辑框是否显示
            editVisible: false,
            // pageTotal: 0,
            form: {},
            id: -1
        };
    },
    computed: {
        ...mapState({
            conList: (state) => state.user.conList || [],
            pageTotal: (state) => state.user.conList.total || 0,
            
        })
    },
    mounted(){
        this.getData();
    },
    methods: {
        // 获取所有用户的数据
        getData() {
            this.$store.dispatch('getConList',this.query);
        },
        // 搜索操作
        handleSearch() {
            // 为query对象添加属性pageIndex
            this.$set(this.query, 'pageIndex', 1);
            this.getData();
        },
        // 取消用户咨询师资格操作
        handleDelete(row) {
            // 二次确认
            this.$confirm(`确定要取消用户${row.name}咨询师资格吗？`, '提示', {
                type: 'warning'
            })
            .then(async() => {
                try {
                    let delList = [];
                    //添加进待删除数组数组
                    delList.push(row.id);
                    await this.$store.dispatch("deleteConByIds",delList);
                    this.$message.success('操作成功');
                    this.getData();
                } catch (error) {
                    this.$message.error('操作失败！请稍后再试');
                }
            })
            .catch(() => {});
        },
        //批量取消
        delAllSelection() {
            const length = this.multipleSelection.length;
            let str = '';
            let delList = [];
            for (let i = 0; i < length; i++) {
                if(i > 0){
                    str += '、';
                }
                str += this.multipleSelection[i].name;
                delList.push(this.multipleSelection[i].id);
            }
            // 二次确认
            this.$confirm(`确定要取消用户${str}的资格吗？`, '提示', {
                type: 'warning'
            })
            .then(async() => {
                try {
                    await this.$store.dispatch("deleteConByIds",delList);
                    this.$message.success('操作成功');
                    this.getData();
                    this.multipleSelection = [];
                } catch (error) {
                    this.$message.error('操作失败！请稍后再试');
                }
            })
            .catch(() => {});
        },
        // 单选、多选、全选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        // 编辑操作
        handleView(row) {//传递点击的行角标、行数据
            let form = JSON.parse(JSON.stringify(row));
            this.form = form;
            this.editVisible = true;
        },
        // 保存编辑
        async saveEdit() {
            //发送请求进行更改 
            try {
                await this.$store.dispatch("editUserById",this.form);
                this.getData();
                this.editVisible = false;
                this.$message.success(`修改用户${this.form.name}信息成功`);
            } catch (error) {
                this.$message.error("修改失败！请稍后再试");
            }
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            this.getData();
        },
        /**
            根据身份证号码判断性别
            15位身份证号码：第7、8位为出生年份(两位数)，第9、10位为出生月份，第11、12位代表出生日
            18位身份证号码：第7、8、9、10位为出生年份(四位数)，第11、第12位为出生月份，
            第13、14位代表出生日期，第17位代表性别，奇数为男，偶数为女。
        */
        //根据身份证号获取年龄
        getAge(idCard) {
            var len = (idCard + "").length;
            var strBirthday = "";
            if (len == 18)//处理18位的身份证号码从号码中得到生日和性别代码
            {
                strBirthday = idCard.substr(6, 4) + "/" + idCard.substr(10, 2) + "/" + idCard.substr(12, 2);
            }
            if (len == 15) {
                var birthdayValue='';
                birthdayValue = idCard.charAt(6)+idCard.charAt(7);
                if(parseInt(birthdayValue)<10){
                    strBirthday = "20" + idCard.substr(6, 2) + "/" + idCard.substr(8, 2) + "/" + idCard.substr(10, 2);
                }else{
                    strBirthday = "19" + idCard.substr(6, 2) + "/" + idCard.substr(8, 2) + "/" + idCard.substr(10, 2);
                }

            }
            //时间字符串里，必须是“/”
            var birthDate = new Date(strBirthday);
            var nowDateTime = new Date();
            var age = nowDateTime.getFullYear() - birthDate.getFullYear();
            //再考虑月、天的因素;.getMonth()获取的是从0开始的，这里进行比较，不需要加1
            if (nowDateTime.getMonth() < birthDate.getMonth() || (nowDateTime.getMonth() == birthDate.getMonth() && nowDateTime.getDate() < birthDate.getDate())) {
                age--;
            }
            return age;
        }
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
