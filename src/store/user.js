import { reqConList, reqDeleteUserByIds, reqEditUserById, reqUserList,reqDeleteConByIds,reqEditConById,
    reqEditAdmin } from "@/api";

// 数据仓库
const state = {
    userList: [],
    conList: [],
    cerList: [],
};
// 数据操作层
const mutations = {
    GETUSERLIST(state,userList){
        state.userList = userList;
    },
    GETCONLIST(state,conList){
        state.conList = conList;
    },
    GETCERLIST(state,cerList){
        state.cerList = cerList;
    },
};
// 业务逻辑层
const actions = {
    async getUserList({commit},query){
        let result = await reqUserList(query);
        console.log("用户数据",result.data);
        commit("GETUSERLIST",result.data);
    },   
    async editUserById({commit},form){
        let result = await reqEditUserById(form);
        if (result.code == 200) {
            return "ok";
        } else {
            return Promise.reject(new Error("faile"));
        }
    },   
    async deleteUserByIds({commit},idList){
        let result = await reqDeleteUserByIds(idList);
        if (result.code == 200) {
            return "ok";
        } else {
            return Promise.reject(new Error("faile"));
        }
    },
    async getConList({commit},query){
        let result = await reqConList(query);
        console.log("咨询师数据",result);
        if (query.status == 0) {
            commit("GETCERLIST",result.data);
        }else{
            commit("GETCONLIST",result.data);
        }
    },
    async deleteConByIds({commit},idList){
        console.log("取消咨询师",idList);
        let result = await reqDeleteConByIds(idList);
        console.log("删除咨询师结果",result);
        return "ok";
        // if (result.lenght > 0) {
        //     return "ok";
        // } else {
        //     return Promise.reject(new Error("faile"));
        // }
    },
    async editConById({commit},form){
        console.log("认证咨询师",form);
        let result = await reqEditConById(form);
        console.log(result);
        if (result.code == 200) {
            return "ok";
        } else {
            return Promise.reject(new Error("faile"));
        }
    },   
    async editAdminById({commit},form){
        console.log("修改管理员密码",form);
        let result = await reqEditAdmin(form);
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



