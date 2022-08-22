import { reqDeleteEssayByIds, reqEditEssayById, reqEssayList } from "@/api";

// 数据仓库
const state = {
    essayList: {},
};
// 数据操作层
const mutations = {
    GETESSAYLIST(state,essayList){
        state.essayList = essayList;
    }
};
// 业务逻辑层
const actions = {
    async getEssayList({commit},query){
        let result = await reqEssayList(query);
        console.log("essayList接收到的结果",result.data);
        commit("GETESSAYLIST",result.data);
    },   
    async editEssayById({commit},form){
        let result = await reqEditEssayById(form);
        if (result.code == 200) {
            return "ok";
        } else {
            return Promise.reject(new Error("faile"));
        }
    },   
    async deleteEssayByIds({commit},idList){
        let result = await reqDeleteEssayByIds(idList);
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