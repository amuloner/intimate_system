<template>
    <div>
        <!-- 面包屑容器 -->
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 评论内容管理
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
                <el-select v-model="query.status" placeholder="状态" class="handle-select mr10">
                    <el-option key="1" label="已通过" value="1"></el-option>
                    <el-option key="2" label="未审核" value="0"></el-option>
                    <el-option key="3" label="所有" value=""></el-option>
                </el-select>
                <el-select v-model="query.isReply" placeholder="评论类型" class="handle-select mr10">
                    <el-option key="1" label="所有" value=""></el-option>
                    <el-option key="2" label="父评论" value="0"></el-option>
                    <el-option key="3" label="子评论" value="1"></el-option>
                </el-select>
                <el-input v-model="query.fromName" placeholder="评论人" style="width: 120px" class="handle-input mr10"></el-input>
                <el-input v-model="query.essayTitle" placeholder="文章名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <!-- 表格数据体 -->
            <el-table
                :data="commentsList.records"
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
                <el-table-column fixed="left" prop="essayTitle" label="文章名" align="center"></el-table-column>
                <el-table-column prop="fromName" label="评论人" align="center"></el-table-column>
                <el-table-column label="评论对象" align="center">
                    <template slot-scope="scope">
                        {{scope.row.toName || '无'}}
                    </template>  
                </el-table-column>
                <el-table-column prop="content" label="评论内容" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="date" label="评论时间" width="95"></el-table-column>
                <el-table-column label="审核状态" align="center" width="70">
                    <template slot-scope="scope">
                        <span style="color: green" v-if="scope.row.status">已通过</span>
                        <span style="color: red" v-else>未审核</span>
                    </template>         
                </el-table-column>
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

        <!-- 查看弹出框 -->
        <el-dialog title="查看" :visible.sync="editVisible" width="40%">
            <el-form ref="form" :model="form" label-width="90px" label-position="left">
                 <el-form-item label="文章名:">
                    {{form.essayTitle}}
                </el-form-item>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="评论人:">
                            {{form.fromName}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="评论对象:">
                            {{form.toName || '无'}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="评论时间:">
                            {{form.date}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="审核状态:">
                            <span style="color: green" v-if="form.status">已通过</span>
                            <span style="color: red" v-else>未审核</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="评论内容:">
                    <el-input class="textarea" disabled type="textarea" rows="5" v-model="form.content"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false; form = {}">关 闭</el-button>
                <el-button :type="form.status?'info':'primary'" @click="saveEdit">通 过</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapState } from "vuex";
export default {
    name: 'commentstable',
    data() {
        return {
            // 搜索条件
            query: {
                status: '',
                isReply: '',
                fromName: '',
                essayTitle: '',
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
            commentsList: (state) => state.comments.commentsList || [],
            pageTotal: (state) => state.comments.commentsList.total || 0
        })
    },
    mounted(){
        this.getData();
    },
    methods: {
        // 获取所有用户的数据
        getData() {
            this.$store.dispatch('getCommentsList',this.query);
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
            this.$confirm(`确定要删除吗？`, '提示', {
                type: 'warning'
            })
            .then(async() => {
                try {
                    let delList = [];
                    //添加进待删除数组数组
                    delList.push(row.id);
                    await this.$store.dispatch("deleteCommentsByIds",delList);
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
            let delList = [];
            for (let i = 0; i < length; i++) {
                delList.push(this.multipleSelection[i].id);
            }
            // 二次确认删除
            this.$confirm(`确定要删除吗？`, '提示', {
                type: 'warning'
            })
            .then(async() => {
                try {
                    await this.$store.dispatch("deleteCommentsByIds",delList);
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
        // 查看操作
        handleView(row) {//传递点击的行角标、行数据
            let form = JSON.parse(JSON.stringify(row));
            this.form = form;
            this.editVisible = true;
        },
        // 评论通过审核
        async saveEdit() {
            //发送请求进行更改 
            try {
                await this.$store.dispatch("editCommentsById",this.form.id);
                this.getData();
                this.editVisible = false;
                this.$message.success(`修改审核状态信息成功`);
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
