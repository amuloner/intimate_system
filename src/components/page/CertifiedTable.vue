<template>
    <div>
        <!-- 面包屑容器 -->
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 咨询师认证
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
            <!-- 表格功能栏 -->
            <div class="handle-box">
                <!-- <el-button
                    type="primary"
                    icon="el-icon-delete"
                    class="handle-del mr10"
                    @click="delAllSelection"
                >批量取消</el-button> -->
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
                <el-table-column fixed="left" prop="name" label="姓名" align="center" width="100"></el-table-column>
                <el-table-column label="性别" align="center" width="100">
                    <template slot-scope="scope">
                        {{scope.row.gender==='1'?'男':'女'}}
                    </template>
                </el-table-column>
                <el-table-column prop="age" label="年龄" align="center" width="100"></el-table-column>
                <el-table-column prop="idCard" label="身份证号" align="center" width="250"></el-table-column>
                <el-table-column prop="certifiedUrl" label="认证资料" align="center">
                    <template slot-scope="scope">
                        <el-link type="primary" :href="url+scope.row.certifiedUrl">{{scope.row.certifiedUrl}}</el-link>
                    </template>
                </el-table-column>
                <!-- <el-table-column prop="conLikes" label="咨询获赞量" align="center"></el-table-column> -->
                <!-- <el-table-column prop="essayNum" label="发表文章数" align="center">
                    <template slot-scope="scope">
                        {{scope.row.essayNum ? scope.row.essayNum : 0}}
                    </template>
                </el-table-column> -->
                <!-- <el-table-column prop="essayLikes" label="文章点赞总量" align="center"></el-table-column> -->
                <!-- <el-table-column prop="complaintsNum" label="被投诉次数" align="center"></el-table-column> -->
                <!-- <el-table-column prop="atcationDate" label="认证时间" align="center" width="95"></el-table-column> -->
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
                        >通过</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.row)"
                        >打回</el-button>
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
        <!-- <el-dialog title="查看" :visible.sync="editVisible" width="40%">
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
                <el-form-item label="简介">
                    <label slot="label">简&nbsp;&nbsp;&nbsp;&nbsp;介:</label>
                    <el-input class="textarea" disabled type="textarea" rows="10" v-model="form.conIntro"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false; form = {}" type="primary">关 闭</el-button>
            </span>
        </el-dialog> -->
    </div>
</template>

<script>
import { mapState } from "vuex";
import { formatDate } from "@/utils/myFun";
export default {
    name: 'certifiedTable',
    data() {
        return {
            // 搜索条件
            query: {
                name: '',
                status: 0,
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
            conList: (state) => state.user.cerList || [],
            pageTotal: (state) => state.user.cerList.total || 0,
            url: (state) => state.url
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
        // 打回申请
        handleDelete(row) {
            // 二次确认
            this.$confirm(`确定打回用户 ${row.name} 认证申请吗？`, '提示', {
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
        // 通过审核
        async handleView(row) {//传递点击的行角标、行数据
            let form = JSON.parse(JSON.stringify(row));
            let newCon = {
                id: form.id,
                status: 1,
                name: form.name,
                atcationDate: formatDate(new Date(new Date().getTime()), "YYYY-MM-DD")
            }
            //发送请求进行更改 
            try {
                await this.$store.dispatch("editConById",newCon);
                this.getData();
                this.$message.success(`用户 ${form.name} 认证成功`);
            } catch (error) {
                this.$message.error("操作失败！请稍后再试");
            }
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            this.getData();
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
