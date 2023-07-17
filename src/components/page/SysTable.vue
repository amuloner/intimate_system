<template>
    <div class="">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-copy"></i> 公告管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-tabs v-model="message">
                <el-tab-pane :label="`公告`" name="first">
                    <el-table :data="noticeList" :show-header="false" style="width: 100%">
                        <el-table-column>
                            <template slot-scope="scope">
                                <span class="message-title">{{scope.row.content}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="ctime" width="180"></el-table-column>
                        <el-table-column width="120">
                            <template slot-scope="scope">
                                <el-button size="small" @click="handleRead(scope.row)">移除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="handle-row">
                        <el-button type="primary" @click="handleView">新增公告</el-button>
                    </div>
                </el-tab-pane>
                <el-tab-pane :label="`历史公告`" name="second">
                    <template v-if="message === 'second'">
                        <el-table :data="noticeList" :show-header="false" style="width: 100%">
                            <el-table-column>
                                <template slot-scope="scope">
                                    <span class="message-title">{{scope.row.content}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="ctime" width="150"></el-table-column>
                            <el-table-column width="120">
                                <template slot-scope="scope">
                                    <el-button type="danger" @click="handleDel(scope.row)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <!-- <div class="handle-row">
                            <el-button type="danger">删除全部</el-button>
                        </div> -->
                    </template>
                </el-tab-pane>
            </el-tabs>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="40%">
            <el-form ref="form" v-model="newNotice"  label-width="90px" label-position="left">

                <el-form-item label="公告标题">
                    <el-input v-model="newNotice.title"></el-input>
                </el-form-item>
                <el-form-item label="公告内容">
                    <el-input v-model="newNotice.content" type="textarea" rows="10"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false; newNotice = {}" type="info">关 闭</el-button>
                <el-button @click="sendNotice" type="primary">发 布</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapState } from "vuex";
    export default {
        name: 'sysTable',
        data() {
            return {
                //编辑框是否显示
                editVisible: false,

                message: 'first',
                showHeader: false,

                newNotice: {
                    title: '',
                    content: ''
                }
            }
        },
        computed: {
            ...mapState({
                noticeList: (state) => state.sys.noticeList || [],
                unreadNum: (state) => state.sys.noticeList.length
            }),
        },      
        mounted(){
            this.getData(1);

        },
        watch: {
            'message': function(val){
                console.log(val);
                if(val == 'first'){
                    this.getData(1);
                }else if(val == 'second'){
                    this.getData(0);
                }
            }
        },
        methods: {
            getData(status){
                this.$store.dispatch('getNoticeList',status);
            },

            //发布公告
            async sendNotice() {
                if(this.newNotice.title == '' || this.newNotice.content == ''){
                    this.$message.error('请正确填入数据');
                    return;
                }
                try {
                    await this.$store.dispatch('addNotice',this.newNotice);
                    this.$message.success('添加成功');
                    this.editVisible = false;
                    this.getData(1);
                } catch (error) {
                    this.$message.error('添加失败！请稍后再试');
                }
                
            },

            //将发布的公告改为历史
            async handleRead(form) {
                try {
                    await this.$store.dispatch('editNoticeById',form);
                    this.$message.success('移除成功');
                    this.getData(1);
                } catch (error) {
                    this.$message.error('移除失败！请稍后再试');
                }
                
            },
            //删除历史公告
            handleDel(form) {
                // 二次确认删除
                this.$confirm(`确定要删除吗？`, '提示', {
                    type: 'warning'
                })
                .then(async() => {
                    try {
                        await this.$store.dispatch("deleteNoticeById",form);
                        this.$message.success('删除成功');
                        this.getData(0);
                    } catch (error) {
                        this.$message.error('删除失败！请稍后再试');
                    }
                })
                .catch(() => {});
            },
            // 编辑操作
            handleView(row) {//传递点击的行角标、行数据
                this.editVisible = true;
            },
        },
    }

</script>

<style>
.message-title{
    cursor: pointer;
}
.handle-row{
    margin-top: 30px;
}
</style>

