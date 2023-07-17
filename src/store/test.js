import { reqTestList, reqDeleteTestByIds, reqEditTestById, reqTestRList, reqDeleteTestRByIds, 
    reqEditTestRById,reqTestLabel, reqTestAList, reqAddTest, reqEditTestQAndAById,reqDeleteTestQAndAByIds,
    reqTestRuList, reqDeleteTestRuByIds, reqAddTestRu, reqEditTestRuById} from "@/api";
// 数据仓库
const state = {
    testList: {},//问卷信息
    testRList: {},//问卷结果
    testQList: {},//问卷内容

    testAList: [],//问卷选项
    testLabel:{}, //问卷类别

    testRuList: {}//问卷规则
};
// 数据操作层
const mutations = {
    GETTESTLIST(state,testList){
        state.testList = testList;
    },
    GETTESTRLIST(state,testRList){
        testRList.records.forEach(element => {
            let resultJson = JSON.parse(element.resultJson);
            element.score = resultJson.score;
            element.message = resultJson.message;
        });
        state.testRList = testRList;
    },
    GETTESTQLIST(state,testQList){
        state.testQList = testQList;
    },
    GETTESTALIST(state,testAList){
        state.testAList = testAList;
    },
    GETTESTLABEL(state,testLabel){
        state.testLabel = testLabel;
    },
    GETTESTRULIST(state,testRuList){
        state.testRuList = testRuList;
    },
};
// 业务逻辑层
const actions = {

    async getTestList({commit},query){
        let result = await reqTestList(query);
        console.log("测试列表数据",result.data);
        commit("GETTESTLIST",result.data);
    },   
    async editTestById({commit},form){
        let result = await reqEditTestById(form);
        if (result.code == 200) {
            return "ok";
        } else {
            return Promise.reject(new Error("faile"));
        }
    },   
    async deleteTestByIds({commit},idList){
        let result = await reqDeleteTestByIds(idList);
        if (result.code == 200) {
            return "ok";
        } else {
            return Promise.reject(new Error("faile"));
        }
    },

    //测评结果
    async getTestRList({commit},query){
        let result = await reqTestRList(query);
        console.log("测评结果数据",result.data);
        commit("GETTESTRLIST",result.data);
    },   
    async editTestRById({commit},form){
        let result = await reqEditTestRById(form);
        if (result.code == 200) {
            return "ok";
        } else {
            return Promise.reject(new Error("faile"));
        }
    },   
    async deleteTestRByIds({commit},idList){
        let result = await reqDeleteTestRByIds(idList);
        if (result.code == 200) {
            return "ok";
        } else {
            return Promise.reject(new Error("faile"));
        }
    },

    async getTestLabel({commit}){
        let result = await reqTestLabel();
        console.log("测试标签数据",result.data);
        commit("GETTESTLABEL",result.data);
    },   

    async getTestQList({commit},query){
        let result = await reqTestList(query);
        console.log("测试列表数据",result.data);
        commit("GETTESTQLIST",result.data);
    },   

    async getTestAList({commit},query){
        let result = await reqTestAList(query);
        console.log("测试选项数据",result.data);
        commit("GETTESTALIST",result.data);
    }, 
    
    //添加问卷
    async addTest({commit},query){
        let result = await reqAddTest(query);
        console.log("添加问卷",result);
        if (result.code == 200) {
            return "ok";
        } else {
            return Promise.reject(new Error("faile"));
        }
    }, 

    //修改测评问题项
    async editTestQAndAById({commit},form){
        let result = await reqEditTestQAndAById(form);
        if (result.code == 200) {
            return "ok";
        } else {
            return Promise.reject(new Error("faile"));
        }
    },   
    async deleteTestQAndAByIds({commit},idList){
        let result = await reqDeleteTestQAndAByIds(idList);
        if (result.code == 200) {
            return "ok";
        } else {
            return Promise.reject(new Error("faile"));
        }
    },

    //问卷规则
    async getTestRuList({commit},query){
        let result = await reqTestRuList(query);
        console.log("测评规则数据",result.data);
        commit("GETTESTRULIST",result.data);
    },   
    async editTestRuById({commit},form){
        let result = await reqEditTestRuById(form);
        if (result.code == 200) {
            return "ok";
        } else {
            return Promise.reject(new Error("faile"));
        }
    },   
    async addTestRu({commit},param){
        let result = await reqAddTestRu(param);
        if (result.code == 200) {
            return "ok";
        } else {
            return Promise.reject(new Error("faile"));
        }
    },   
    async deleteTestRuByIds({commit},idList){
        let result = await reqDeleteTestRuByIds(idList);
        if (result.code == 200) {
            return "ok";
        } else {
            return Promise.reject(new Error("faile"));
        }
    },
};
// 计算属性（数据简化）
const getters = {};

export default{
    state,
    mutations,
    actions,
    getters
};