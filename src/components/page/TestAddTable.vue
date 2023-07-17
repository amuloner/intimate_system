<template>
    <div>
        <!-- 面包屑容器 -->
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 问卷新增
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
            <el-form ref="newTestAlist" :model="newTestAlist" label-width="80px">
                <el-row >
                    <el-col :span="8">
                        <el-form-item label="测评类名">
                            <el-input v-model="newTestAlist.testName" style="width: 300px;"></el-input>
                        </el-form-item> 
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="类 别">
                            <el-input v-model="newTestAlist.label" style="width: 100px;"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="介 绍">
                    <el-input type="textarea" v-model="newTestAlist.direction" style="width: 500px;"></el-input>
                </el-form-item>
                <el-form-item 
                    v-for="(ques,index) in newTestAlist.testAList"
                    :label="index + 1 + '. '" 
                    :key="ques.id"
                    :prop="index+''"
                    >
                    <el-input v-model="ques.title" style="width: 400px;"></el-input>
                    <el-button @click.prevent="removeQues(ques)" style="margin-left: 20px;">删除</el-button>
                    <el-button @click.prevent="addAns(index)" style="margin-left: 20px;">增加选项</el-button>
                    <el-form-item 
                        v-for="(ans,i) in ques.ansList"
                        :label="i + 1 + '). '" 
                        :key="ans.id"
                        :prop="i+''"  
                        style="margin-top: 20px;"
                    >
                        <el-input v-model="ans.direction" style="width: 100px;margin-right: 20px;"></el-input> ---- <el-input v-model="ans.score" style="width: 50px; margin-left: 20px;"></el-input>分
                        <el-button @click.prevent="removeAns(ans,index)" style="margin-left: 20px;">删除</el-button>
                    </el-form-item>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitCreate('newTestAlist')">立即创建</el-button>
                    <el-button @click="addQues">新增问题</el-button>     
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";
import { isObjectValueEqual } from "@/utils/myFun";
export default {
    name: 'testQTable',
    data() {
        return {
            //定义表单项
            newTestAlist: {
                testName: '测试问卷',
                label: '家庭',
                direction:'测试',
                testAList:[
                    {
                        title: '问题1',
                        ansList: [
                            {
                                direction: '良好',
                                score: '3'
                            }
                        ]
                    }
                ]
            },
            // newTestAlist: {
            //     testName: '',
            //     label: '',
            //     direction:'',
            //     testAList:[
            //         {
            //             title: '',
            //             ansList: [
            //                 {
            //                     direction: '',
            //                     score: ''
            //                 }
            //             ]
            //         }
            //     ]
            // },

            // 搜索条件
            query: {
                status: '',
                label: '全部'
            },

            // pageTotal: 0,
            form: {},//编辑框item
            oldForm: {},//未修改的编辑框item
            id: -1
        };
    },
    computed: {},
    mounted(){},
    methods: {
        //移除问题项
        removeQues(item) {
            var index = this.newTestAlist.testAList.indexOf(item)
            if (index !== -1) { 
                this.newTestAlist.testAList.splice(index, 1)
            }
        },

        //移除选择项
        removeAns(item,index) {
            var i = this.newTestAlist.testAList[index].ansList.indexOf(item)
            if (i !== -1) { 
                this.newTestAlist.testAList[index].ansList.splice(i, 1)
            }
        },

        //添加新的问题项
        addQues(e) {
            console.log(e);
            this.newTestAlist.testAList.push(
                {
                    title: '',
                    ansList: [
                        {
                            direction: '',
                            score: ''
                        }
                    ]
                }
            );
        },

        //添加新的选项
        addAns(index){
            this.newTestAlist.testAList[index].ansList.push(
                {
                    direction: '',
                    score: ''
                }
            );
        },

        //创建新的问卷
        async submitCreate(formName){
            console.log(this.$refs[formName].model);
            try {
                await this.$store.dispatch("addTest",this.$refs[formName].model);
                this.$message.success('添加成功');
                this.newTestAlist= {
                    testName: '',
                    label: '',
                    testAList:[
                        {
                            title: '',
                            ansList: [
                                {
                                    direction: '',
                                    score: ''
                                }
                            ]
                        }
                    ]
                }
            } catch (error) {
                this.$message.error('添加失败！请稍后再试');
            }
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
