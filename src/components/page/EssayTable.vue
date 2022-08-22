<template>
    <div>
        <!-- 面包屑容器 -->
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 科普文章管理
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
                <el-input v-model="query.author" placeholder="上传者" style="width: 120px" class="handle-input mr10" ></el-input>
                <el-input v-model="query.title" placeholder="文章名" class="handle-input mr10"></el-input>
                <el-input v-model="query.content" placeholder="文章内容检索" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
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
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column label="ID" width="55" align="center">
                    <template slot-scope="scope">
                        {{scope.$index+1}}
                    </template>
                </el-table-column>
                <el-table-column prop="title" label="文章标题" align="center"></el-table-column>
                <el-table-column prop="author" label="上传者" align="center"></el-table-column>
                <el-table-column prop="briefly" label="简介" width="200"  show-overflow-tooltip></el-table-column>
                <el-table-column prop="uploadTime" label="上传时间" align="center"></el-table-column>
                <el-table-column prop="content" label="内容" align="center" show-overflow-tooltip width="300"></el-table-column>
                <el-table-column prop="starNum" label="点赞数量" align="center"></el-table-column>
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
                <el-form-item label="标题">
                    <label slot="label">标&nbsp;&nbsp;&nbsp;&nbsp;题</label>
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item label="简介">
                    <label slot="label">简&nbsp;&nbsp;&nbsp;&nbsp;介</label>
                    <el-input v-model="form.briefly"></el-input>
                </el-form-item>
                <el-form-item label="上传人">
                    <el-input v-model="form.author"></el-input>
                </el-form-item>
                <el-form-item label="上传时间">
                    <el-input v-model="form.uploadTime"></el-input>
                </el-form-item>
                <el-form-item label="点赞量">
                    <el-input v-model="form.starNum"></el-input>
                </el-form-item>
                <el-form-item label="内容">
                    <label slot="label">内&nbsp;&nbsp;&nbsp;&nbsp;容</label>
                    <el-input type="textarea" rows="5" v-model="form.content"></el-input>
                </el-form-item>
                <!-- <el-row>
                    <el-col :span="12">
                        
                    </el-col>
                    <el-col :span="12">

                    </el-col>
                </el-row> -->
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false; form = {}">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
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
            essayList: (state) => state.essay.essayList || [],
            pageTotal: (state) => state.essay.essayList.total || 0
        })
    },
    mounted(){
        this.getData();
    },
    methods: {
        // 获取所有用户的数据
        getData() {
            this.$store.dispatch('getEssayList',this.query);
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
            this.$confirm(`确定要删除文章${row.title}吗？`, '提示', {
                type: 'warning'
            })
            .then(async() => {
                try {
                    let delList = [];
                    //添加进待删除数组数组
                    delList.push(row.id);
                    await this.$store.dispatch("deleteEssayByIds",delList);
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
                str += this.multipleSelection[i].title;
                delList.push(this.multipleSelection[i].id);
            }
            // 二次确认删除
            this.$confirm(`确定要删除文章${str}吗？`, '提示', {
                type: 'warning'
            })
            .then(async() => {
                try {
                    await this.$store.dispatch("deleteEssayByIds",delList);
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
                await this.$store.dispatch("editEssayById",this.form);
                this.getData();
                this.editVisible = false;
                this.$message.success(`修改文章${this.form.title}信息成功`);
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
