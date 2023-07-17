<template>
    <div>
        <!-- 面包屑容器 -->
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 问卷规则管理
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
                <el-input v-model="query.title" placeholder="问卷名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <!-- 表格数据体 -->
            <el-table
                :data="testRuList.records"
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
                <el-table-column fixed="left" prop="title" label="问卷名" align="center" width="300"></el-table-column>
                <el-table-column prop="rule" label="规则" show-overflow-tooltip align="center"></el-table-column>
                <el-table-column prop="ctime" label="创建时间" width="180" align="center"></el-table-column>
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
        <el-dialog title="编辑" :visible.sync="editVisible" width="60%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="问卷名">
                    <label slot="label">问卷名</label>
                    <el-input v-model="form.title" style="width: 250px;margin-right: 30px;"></el-input> 分数为“-1”时代表超出
                </el-form-item>
                <el-form-item label="规则" v-for="(r, index) in form.rule" :key="index">
                    <label slot="label">规&nbsp;&nbsp;&nbsp;&nbsp;则 {{index+1}}</label>
                    <el-input v-model="r.low" style="width: 50px"></el-input>--<el-input v-model="r.up" style="width: 50px;margin-right: 30px;"></el-input>
                    得分：<el-input v-model="r.core" style="width: 50px"></el-input>

                    <label slot="label" style="margin-top: 20px;">评价</label>
                    <el-input type="textarea" autosize v-model="r.result" style="margin-top: 20px;"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false; form = {}">取 消</el-button>
                <el-button type="primary" @click="saveEdit">修 改</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { fetchData } from '@/api/index';
import { mapState } from "vuex";
import { isObjectValueEqual } from "@/utils/myFun";

export default {
    name: 'testATable',
    data() {
        return {
            // 搜索条件
            query: {
                title:'',
                pageIndex: 1,
                pageSize: 6
            },
            multipleSelection: [],
            //编辑框是否显示
            editVisible: false,
            // pageTotal: 0,
            form: {},//编辑框item
            oldForm: {},//未修改的编辑框item
            id: -1
        };
    },
    computed: {
        ...mapState({
            testRuList: (state) => state.test.testRuList || [],
            pageTotal: (state) => state.test.testRuList.total || 0
        })
    },
    mounted(){
        this.getData();
    },
    methods: {
        // 获取所有用户的数据
        getData() {
            this.$store.dispatch('getTestRuList',this.query);
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
                    await this.$store.dispatch("deleteTestRuByIds",delList);
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
                str += this.multipleSelection[i].nickname;
                delList.push(this.multipleSelection[i].id);
            }
            // 二次确认删除
            this.$confirm(`确定要删除吗？`, '提示', {
                type: 'warning'
            })
            .then(async() => {
                try {
                    await this.$store.dispatch("deleteTestRuByIds",delList);
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
            this.form = JSON.parse(JSON.stringify(row));
            this.form.rule = JSON.parse(row.rule);
            this.oldForm = JSON.parse(JSON.stringify(row));
            this.oldForm.rule = JSON.parse(row.rule);
            this.editVisible = true;
        },
        // 保存编辑
        async saveEdit() {
            this.form.rule = JSON.stringify(this.form.rule);
            this.oldForm.rule = JSON.stringify(this.oldForm.rule);
            console.log(isObjectValueEqual(this.form, this.oldForm))
            //判断是否对数据进行了更改
            if(isObjectValueEqual(this.form, this.oldForm)){
                return;
            }

            //发送请求进行更改 
            try {
                await this.$store.dispatch("editTestRuById",this.form);
                this.editVisible = false;
                this.$message.success(`修改成功`);
                this.getData();
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
