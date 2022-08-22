import { reqCommentsList, reqDeleteCommentsByIds, reqEditCommentsById } from "@/api";

// 数据仓库
const state = {
    commentsList: {}
};
// 数据操作层
const mutations = {
    GETCOMMENTSLIST(state,commentsList){
        state.commentsList = commentsList;
    },
};
// 业务逻辑层
const actions = {
    async getCommentsList({commit},query){
        let result = await reqCommentsList(query);
        console.log("逻辑层接收到的结果",result.data);
        commit("GETCOMMENTSLIST",result.data);
    },   
    async editCommentsById({commit},commentsId){
        console.log("修改",commentsId);
        let result = await reqEditCommentsById(commentsId);
        if (result.code == 200) {
            return "ok";
        } else {
            return Promise.reject(new Error("faile"));
        }
    },   
    async deleteCommentsByIds({commit},idList){
        let result = await reqDeleteCommentsByIds(idList);
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