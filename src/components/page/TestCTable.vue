<template>
    <div>
        <!-- 面包屑容器 -->
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 问卷查看
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
            <el-form label-width="80px">
                <el-row >
                    <el-col :span="8">
                        <el-form-item label="测评类名">
                            <el-select v-model="testId" @change="updateAList(testId)" placeholder="测评类名" style="width: 280px">
                                    <el-option
                                        v-for="test in testList.records"
                                        :key="test.id"
                                        :label="test.title"
                                        :value="test.id">
                                    </el-option>
                            </el-select>
                            
                        </el-form-item> 
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="类 别">
                            <el-select v-model="query.label" @change="updateQList(query.label)" placeholder="请选择测评类别" style="width: 150px">
                                <el-option label="全部" value="全部"></el-option>
                                <el-option
                                    v-for="label in testLabels"
                                    :key="label"
                                    :label="label"
                                    :value="label">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
           <!-- 表格数据体 -->
           <el-table
                :data="testAList.records"
                border
                class="table"
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
                <el-table-column prop="qnum" label="题序" align="center" width="100"></el-table-column>
                <el-table-column prop="title" label="问题" align="center" ></el-table-column>
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
            <!-- 查看弹出框 -->
            <el-dialog title="编辑" :visible.sync="editVisible" width="40%">
                <el-form ref="form" :model="form" label-width="90px" label-position="left">
                    <el-form-item label="问题">
                        <label slot="label">问&nbsp;&nbsp;&nbsp;&nbsp;题</label>
                        <el-input v-model="form.title" style="width: 60%"></el-input>
                    </el-form-item>
                    <el-form-item label="选项" v-for="(ans,index) in form.ansList" :key="ans.id">
                        <label slot="label">选项{{ index+1}}</label>
                        <el-input v-model="ans.direction" style="width: 100px"></el-input> --- 
                        <el-input v-model="ans.score" style="width: 100px"></el-input>分
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editVisible = false; form = {}">关 闭</el-button>
                    <el-button type="primary" @click="saveEdit">修改</el-button>
                </span>
            </el-dialog>
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
    </div>
</template>

<script>
/**
 * 进入页面先查询所有类别
 * 再查询问卷题目数据
 * 选择题目数据后查询问卷小题及其选项数据
 */
import { mapState } from "vuex";
import { isObjectValueEqual } from "@/utils/myFun";
export default {
    name: 'testCTable',
    data() {
        return {
            // 搜索条件
            query: {
                status: '',
                label: '全部'
            },
            queryAns: {
                pageIndex: 1,
                pageSize: 10
            },
            testId: '',
            multipleSelection: [],
            //编辑框是否显示
            editVisible: false,

            form: {},//编辑框item
            oldForm: {},//未修改的编辑框item
            id: -1
        };
    },
    computed: {
        ...mapState({
            testLabels: (state) => state.test.testLabel || [],
            testList: (state) => state.test.testQList || [],
            testAList: (state) => state.test.testAList || {},//包含测评问题列、问题选项列、分数
            pageTotal: (state) => state.test.testAList.total || 0
        }),
    },
    mounted(){
        //获取问卷数据
        this.getData();
    },
    methods: {
        
        // 获取所有问卷题目的数据
        getData() {
            //获取问卷标签
            this.$store.dispatch('getTestLabel');
            //获取问卷题目
            this.$store.dispatch('getTestQList',this.query);
        },
 
        //更新问卷题目
        updateQList(e){
            //获取问卷题目
            this.$store.dispatch('getTestQList',this.query);
        },

        //更新题目的选项
        updateAList(testId){
            console.log(testId);
            //获取选项
            this.$store.dispatch('getTestAList',{...this.queryAns,testId});

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
                    await this.$store.dispatch("deleteTestQAndAByIds",delList);
                    this.$message.success('删除成功');
                    this.updateAList(this.testId);
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
                    await this.$store.dispatch("deleteTestQAndAByIds",delList);
                    this.$message.success('删除成功');
                    this.getData();
                    this.multipleSelection = [];
                } catch (error) {
                    this.$message.error('删除失败！请稍后再试');
                }
            })
            .catch(() => {});
        },
        // 编辑操作
        handleEdit(row) {//传递点击的行角标、行数据
            this.form = JSON.parse(JSON.stringify(row));
            this.oldForm = JSON.parse(JSON.stringify(row));
            this.editVisible = true;
        },
        // 保存编辑
        async saveEdit() {

            //发送请求进行更改 
            try {
                await this.$store.dispatch("editTestQAndAById",this.form);
                this.updateAList(this.testId);
                this.editVisible = false;
                this.$message.success(`修改成功`);
            } catch (error) {
                this.$message.error("修改失败！请稍后再试");
            }
        },
        // 单选、多选、全选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },

        // 分页导航
        handlePageChange(val) {
            this.$set(this.queryAns, 'pageIndex', val);
            this.updateAList(this.testId);
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
