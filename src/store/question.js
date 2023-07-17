import { reqQuestionList, reqDeleteQuestionByIds, reqEditQuestionById } from "@/api";
// 数据仓库
const state = {
    questionList: [],
};
// 数据操作层
const mutations = {
    GETQUESTIONLIST(state,questionList){
        state.questionList = questionList;
    }
};
// 业务逻辑层
const actions = {
    async getQuestionList({commit},query){
        let result = await reqQuestionList(query);
        console.log("问题数据",result.data);
        commit("GETQUESTIONLIST",result.data);
    },   
    async editQuestionById({commit},form){
        let result = await reqEditQuestionById(form);
        if (result.code == 200) {
            return "ok";
        } else {
            return Promise.reject(new Error("faile"));
        }
    },   
    async deleteQuestionByIds({commit},idList){
        let result = await reqDeleteQuestionByIds(idList);
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