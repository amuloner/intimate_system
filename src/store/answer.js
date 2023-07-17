import { reqAnswerList, reqDeleteAnswerByIds, reqEditAnswerById } from "@/api";
// 数据仓库
const state = {
    answerList: [],
};
// 数据操作层
const mutations = {
    GETANSWERLIST(state,answerList){
        state.answerList = answerList;
    }
};
// 业务逻辑层
const actions = {
    async getAnswerList({commit},query){
        let result = await reqAnswerList(query);
        console.log("问题数据",result.data);
        commit("GETANSWERLIST",result.data);
    },   
    async editAnswerById({commit},id){
        let result = await reqEditAnswerById(id);
        if (result.code == 200) {
            return "ok";
        } else {
            return Promise.reject(new Error("faile"));
        }
    },   
    async deleteAnswerByIds({commit},idList){
        let result = await reqDeleteAnswerByIds(idList);
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