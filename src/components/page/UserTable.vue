<template>
    <div>
        <!-- 面包屑容器 -->
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 用户管理
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
                >批量删除</el-button>
                <el-select v-model="query.authority" placeholder="权限" class="handle-select mr10">
                    <el-option key="1" label="用户" value="2"></el-option>
                    <el-option key="2" label="咨询师" value="1"></el-option>
                </el-select>
                <el-input v-model="query.username" placeholder="用户名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <!-- 表格数据体 -->
            <el-table
                :data="userList.records"
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
                        {{scope.$index+1}}
                    </template>
                </el-table-column>
                <el-table-column fixed="left" prop="username" label="用户名" align="center"></el-table-column>
                <el-table-column prop="nickname" label="昵称" align="center"></el-table-column>
                <el-table-column label="性别" align="center">
                    <template slot-scope="scope">
                        {{scope.row.gender==='1'?'男':'女'}}
                    </template>
                </el-table-column>
                <!-- 头像展示且开启大图预览功能 -->
                <el-table-column label="头像(点击放大)" align="center">
                    <template slot-scope="scope">
                        <el-image
                            class="table-td-thumb"
                            :src="scope.row.thumb"
                            :preview-src-list="[scope.row.thumb]"
                        ></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="email" label="邮箱" width="160"></el-table-column>
                <el-table-column prop="date" label="注册时间" width="95"></el-table-column>
                <el-table-column prop="address" label="地址" show-overflow-tooltip></el-table-column>
                <el-table-column label="实名状态">
                    <template slot-scope="scope">
                        {{!scope.row.idCard?"未实名":"已实名"}}
                    </template>         
                </el-table-column>

                <el-table-column label="权限" align="center" fixed="right">
                    <template slot-scope="scope">
                        {{scope.row.authority === '2'?"用户":"咨询师"}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.row)"
                        >编辑</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.row)"
                        >删除</el-button>
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
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="头像">
                    <label slot="label">头&nbsp;&nbsp;&nbsp;&nbsp;像</label>
                    <el-image class="table-td-thumb2" :src="form.thumb" :preview-src-list="[form.thumb]"></el-image>
                </el-form-item>
                <el-form-item label="用户名">
                    <el-input v-model="form.username"></el-input>
                </el-form-item>
                <el-form-item label="昵称">
                    <label slot="label">昵&nbsp;&nbsp;&nbsp;&nbsp;称</label>
                    <el-input v-model="form.nickname"></el-input>
                </el-form-item>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="性别">
                            <label slot="label">性&nbsp;&nbsp;&nbsp;&nbsp;别</label>
                            <el-select v-model="form.gender" class="handle-select mr10">
                                <el-option key="1" label="女" value="0"></el-option>
                                <el-option key="2" label="男" value="1"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="权限" inline>
                            <label slot="label">权&nbsp;&nbsp;&nbsp;&nbsp;限</label>
                            <el-select v-model="form.authority" class="handle-select mr10">
                                <el-option key="1" label="咨询师" value='1'></el-option>
                                <el-option key="2" label="用户" value='2'></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="邮箱">
                    <label slot="label">邮&nbsp;&nbsp;&nbsp;&nbsp;箱</label>
                    <el-input v-model="form.email"></el-input>
                </el-form-item>
                <el-form-item label="地址">
                    <label slot="label">地&nbsp;&nbsp;&nbsp;&nbsp;址</label>
                    <el-input v-model="form.address"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false; form = {}">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { fetchData } from '@/api/index';
import { mapState } from "vuex";
export default {
    name: 'usertable',
    data() {
        return {
            // 搜索条件
            query: {
                authority: '',
                username: '',
                pageIndex: 1,
                pageSize: 3
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
            userList: (state) => state.user.userList || [],
            pageTotal: (state) => state.user.userList.total || 0
        })
    },
    mounted(){
        this.getData();
    },
    methods: {
        // 获取所有用户的数据
        getData() {
            this.$store.dispatch('getUserList',this.query);
        },
        // 搜索操作
        handleSearch() {
            // 为query对象添加属性pageIndex
            this.$set(this.query, 'pageIndex', 1);
            this.getData();
        },
        // 删除操作
        handleDelete(row) {
            // 二次确认删除
            this.$confirm(`确定要删除用户${row.username}吗？`, '提示', {
                type: 'warning'
            })
            .then(async() => {
                try {
                    let delList = [];
                    //添加进待删除数组数组
                    delList.push(row.id);
                    await this.$store.dispatch("deleteUserByIds",delList);
                    this.$message.success('删除成功');
                    this.getData();
                } catch (error) {
                    this.$message.error('删除失败！请稍后再试');
                }
            })
            .catch(() => {});
        },
        //批量删除
        delAllSelection() {
            const length = this.multipleSelection.length;
            let str = '';
            let delList = [];
            for (let i = 0; i < length; i++) {
                if(i > 0){
                    str += '、';
                }
                str += this.multipleSelection[i].username;
                delList.push(this.multipleSelection[i].id);
            }
            // 二次确认删除
            this.$confirm(`确定要删除用户${str}吗？`, '提示', {
                type: 'warning'
            })
            .then(async() => {
                try {
                    await this.$store.dispatch("deleteUserByIds",delList);
                    this.$message.success('删除成功');
                    this.getData();
                    this.multipleSelection = [];
                } catch (error) {
                    this.$message.error('删除失败！请稍后再试');
                }
            })
            .catch(() => {});
        },
        // 单选、多选、全选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        // 编辑操作
        handleEdit(row) {//传递点击的行角标、行数据
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
                this.$message.success(`修改用户${this.form.username}信息成功`);
            } catch (error) {
                this.$message.error("修改失败！请稍后再试");
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
