<template>
    <div>
        <!-- 面包屑容器 -->
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 文章审核
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
            <!-- 表格功能栏 -->
            <!-- <div class="handle-box">
                <el-button
                    type="primary"
                    icon="el-icon-delete"
                    class="handle-del mr10"
                    @click="delAllSelection"
                >批量删除</el-button>
                <el-input v-model="query.author" placeholder="上传者" style="width: 120px" class="handle-input mr10" ></el-input>
                <el-input v-model="query.title" placeholder="文章名" class="handle-input mr10"></el-input>
                <el-input v-model="query.content" placeholder="文章内容检索" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div> -->
            <!-- 表格数据体 -->
            <el-table
                :data="essayList.records"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                fit
                style="width: 100%"
                @selection-change="handleSelectionChange"
            >
                <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
                <el-table-column label="ID" width="55" align="center">
                    <template slot-scope="scope">
                        {{(query.pageIndex - 1) * query.pageSize + scope.$index+1}}
                    </template>
                </el-table-column>
                <el-table-column label="头像(点击放大)" align="center" width="100">
                    <template slot-scope="scope">
                        <el-image
                            class="table-td-thumb"
                            :src="scope.row.smallImg"
                            :preview-src-list="[scope.row.smallImg]"
                        ></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="title" label="文章标题" width="160" show-overflow-tooltip></el-table-column>
                <el-table-column prop="author" label="作者" align="center" width="100" show-overflow-tooltip></el-table-column>
                <el-table-column prop="source" label="来源" align="center">
                    <template slot-scope="scope">
                        {{scope.row.source? scope.row.source:'无'}}
                    </template>
                </el-table-column>
                <el-table-column prop="uploadTime" label="上传时间" align="center" width="100"></el-table-column>
                <el-table-column label="操作" width="180" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.row)"
                        >查看</el-button>
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
        <el-dialog title="编辑" :visible.sync="editVisible" width="70%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="标题">
                    <label slot="label">标&nbsp;&nbsp;&nbsp;&nbsp;题</label>
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item label="作者">
                    <label slot="label">作&nbsp;&nbsp;&nbsp;&nbsp;者</label>
                    <el-input v-model="form.author"></el-input>
                </el-form-item>
                <el-form-item label="来源">
                    <label slot="label">来&nbsp;&nbsp;&nbsp;&nbsp;源</label>
                    <el-input v-model="form.source"></el-input>
                </el-form-item>
                <el-form-item label="上传时间">
                    <el-input v-model="form.uploadTime"></el-input>
                </el-form-item>
                <el-form-item label="内容">
                    <label slot="label">内&nbsp;&nbsp;&nbsp;&nbsp;容</label>
                    <el-input type="textarea" rows="12" v-model="form.content"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false; form = {}">返回</el-button>
                <el-button type="primary" @click="saveEdit">通过</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapState } from "vuex";
export default {
    name: 'essaytable',
    data() {
        return {
            // 搜索条件
            query: {
                author: '',//作者
                title: '',//文章标题
                content: '',//文章内容
                status: 1,
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
            essayList: (state) => state.essay.cerList || [],
            pageTotal: (state) => state.essay.cerList.total || 0
        })
    },
    mounted(){
        this.getData();
    },
    methods: {
        // 获取数据
        getData() {
            this.$store.dispatch('getEssayList',this.query);
        },
        // 编辑操作
        handleEdit(row) {//传递点击的行角标、行数据
            let form = JSON.parse(JSON.stringify(row));
            this.form = form;
            this.editVisible = true;
        },
        // 打回申请
        handleDelete(row) {
            // 二次确认
            this.$confirm(`确定打回文章《${row.title}》吗？`, '提示', {
                type: 'warning'
            })
            .then(async() => {
                try {
                    let delList = [];
                    //添加进待删除数组数组
                    delList.push(row.id);
                    await this.$store.dispatch("deleteEssayByIds",delList);
                    this.$message.success('打回成功');
                    this.getData();
                    this.editVisible = false;
                } catch (error) {
                    this.$message.error('打回失败！请稍后再试');
                }
            })
            .catch(() => {});
        },
        
        // 单选、多选、全选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        // 通过审核
        async saveEdit() {//传递点击的行角标、行数据
            let form = this.form;
            let newForm = {
                id: form.id,
                status: 1
            }
            //发送请求进行更改 
            try {
                await this.$store.dispatch("editEssayById",newForm);
                this.getData();
                this.$message.success(`审核完成`);
                this.editVisible = false;
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
