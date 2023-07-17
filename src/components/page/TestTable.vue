<template>
    <div>
        <!-- 面包屑容器 -->
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 问卷信息管理
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
                <!-- <el-input v-model="query.fromName" placeholder="回复人" style="width: 120px" class="handle-input mr10"></el-input> -->
                <el-input v-model="query.title" placeholder="测试题目" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <!-- 表格数据体 -->
            <el-table
                :data="testList.records"
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
                <!-- 头像展示且开启大图预览功能 -->
                <el-table-column label="封面" align="center" width="80">
                    <template slot-scope="scope">
                        <el-image
                            class="table-td-thumb"
                            :src="scope.row.image"
                            :preview-src-list="[scope.row.image]"
                        ></el-image>
                    </template>
                </el-table-column>
                <el-table-column label="测试题目" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.title || '无'}}
                    </template>  
                </el-table-column>
                <el-table-column label="副标题" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.sub_title || '无'}}
                    </template>  
                </el-table-column>
                <el-table-column prop="label" label="标签" show-overflow-tooltip align="center" width="70"></el-table-column>
                <el-table-column prop="editor" label="创建人" show-overflow-tooltip align="center" width="70"></el-table-column>
                <el-table-column label="单价" show-overflow-tooltip align="center" width="60">
                    <template slot-scope="scope">
                        <span :style="scope.row.isFree == 1 ? 'color: green' : ''">{{scope.row.isFree == 1 ? '免费' : scope.row.money}}</span>
                    </template>  
                </el-table-column>
                <el-table-column prop="ctime" label="创建时间" width="100" align="center"></el-table-column>
                <el-table-column label="审核状态" align="center" width="70">
                    <template slot-scope="scope">
                        <span style="color: green" v-if="scope.row.status == '1'">已通过</span>
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
                 <el-form-item label="题名">
                    <label slot="label">题&nbsp;&nbsp;&nbsp;&nbsp;名</label>
                    <el-input v-model="form.title" style="width: 60%"></el-input>
                </el-form-item>
                 <el-form-item label="副标题">
                    <el-input v-model="form.sub_title" style="width: 60%"></el-input>
                </el-form-item>
                 <el-form-item label="创建人">
                    {{form.editor}}
                </el-form-item>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="标签">
                            <label slot="label">标&nbsp;&nbsp;&nbsp;&nbsp;签</label>
                            {{form.label}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="单价">
                            <label slot="label">单&nbsp;&nbsp;&nbsp;&nbsp;价</label>
                            <span :style="form.isFree == 1 ? 'color: green' : ''">{{form.isFree == 1 ? '免费' : form.money}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="创建时间">
                            {{form.ctime}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="状态" inline>
                            <label slot="label">状&nbsp;&nbsp;&nbsp;&nbsp;态</label>
                            <el-select v-model="form.status" class="handle-select mr10">
                                <el-option key="0" label="未审核" value='0'></el-option>
                                <el-option key="1" label="已通过" value='1'></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="测试说明">
                    <el-input class="textarea" type="textarea" rows="5" v-model="form.direction"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false; form = {}">关 闭</el-button>
                <el-button type="primary" @click="saveEdit">修改</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapState } from "vuex";
import { isObjectValueEqual } from "@/utils/myFun";
export default {
    name: 'testTable',
    data() {
        return {
            // 搜索条件
            query: {
                status: '',
                title: '',
                pageIndex: 1,
                pageSize: 8
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
            testList: (state) => state.test.testList || [],
            pageTotal: (state) => state.test.testList.total || 0
        })
    },
    mounted(){
        this.getData();
    },
    methods: {
        // 获取所有用户的数据
        getData() {
            this.$store.dispatch('getTestList',this.query);
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
                    await this.$store.dispatch("deleteTestByIds",delList);
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
                    await this.$store.dispatch("deleteTestByIds",delList);
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
            this.form = JSON.parse(JSON.stringify(row));
            this.oldForm = JSON.parse(JSON.stringify(row));
            this.editVisible = true;
        },
        // 评论通过审核
        async saveEdit() {
            //判断是否对数据进行了更改
            if(isObjectValueEqual(this.form, this.oldForm)){
                return;
            }
            //发送请求进行更改 
            try {
                await this.$store.dispatch("editTestById",this.form);
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
