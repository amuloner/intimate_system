<template>
    <div>
        <!-- 面包屑容器 -->
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 问卷内容管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
            <el-form ref="newTestAlist" :model="newTestAlist" label-width="80px">
                <el-row >
                    <el-col :span="8">
                        <el-form-item label="测评类名">
                            <!-- <el-select v-model="testId" @change="updateAList(testId)" placeholder="测评类名" style="width: 280px">
                                    <el-option
                                        v-for="test in testList.records"
                                        :key="test.id"
                                        :label="test.title"
                                        :value="test.id">
                                    </el-option>
                            </el-select> -->
                            
                        </el-form-item> 
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="类 别">
                            <!-- <el-select v-model="query.label" @change="updateQList(form.label)" placeholder="请选择测评类别" style="width: 150px">
                                <el-option label="全部" value="全部"></el-option>
                                <el-option
                                    v-for="label in testLabels"
                                    :key="label"
                                    :label="label"
                                    :value="label">
                                </el-option>
                            </el-select> -->
                        </el-form-item>
                    </el-col>
                </el-row>
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
                    <el-button @click="addQues">新增</el-button>     
                    <el-button>取消</el-button>               
                </el-form-item>
            </el-form>
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
    name: 'testQTable',
    data() {
        return {
            //定义表单项
            newTestAlist: {
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
            },

            // 搜索条件
            query: {
                status: '',
                label: '全部'
            },
            testId: '',
            multipleSelection: [],

            // pageTotal: 0,
            form: {},//编辑框item
            oldForm: {},//未修改的编辑框item
            id: -1
        };
    },
    computed: {
        ...mapState({
            testLabels: (state) => state.test.testLabel || [],
            testList: (state) => state.test.testQList || [],
            // testAList: (state) => state.test.testAList || [],
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
            this.$store.dispatch('getTestAList',testId);

        },

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
        submitCreate(formName){
            console.log(this.$refs[formName]);
            // this.$refs[formName];
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
