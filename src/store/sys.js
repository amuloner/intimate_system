import { reqNoticeList, reqEditNoticeById,reqaddNotice,reqDeleteNoticeById  } from "@/api";

// 数据仓库
const state = {
    noticeList: [],
    oldNoticeList: [],
};
// 数据操作层
const mutations = {
    GETNOTICELIST(state,noticeList){
        state.noticeList = noticeList;
    }
};
// 业务逻辑层
const actions = {
    async getNoticeList({commit},status){
        let result = await reqNoticeList(status);
        console.log("公告数据",result.data);
        commit("GETNOTICELIST",result.data);
    },   
    async addNotice({commit},form){
        let result = await reqaddNotice(form);
        if (result.code == 200) {
            return "ok";
        } else {
            return Promise.reject(new Error("faile"));
        }
    },   
    async editNoticeById({commit},form){
        let result = await reqEditNoticeById(form);
        if (result.code == 200) {
            return "ok";
        } else {
            return Promise.reject(new Error("faile"));
        }
    },   
    async deleteNoticeById({commit},id){
        let result = await reqDeleteNoticeById(id);
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