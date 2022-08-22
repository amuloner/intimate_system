import { reqConList, reqDeleteUserByIds, reqEditUserById, reqUserList,reqDeleteConByIds } from "@/api";

// 数据仓库
const state = {
    userList: [],
    conList: [],
};
// 数据操作层
const mutations = {
    GETUSERLIST(state,userList){
        state.userList = userList;
    },
    GETCONLIST(state,conList){
        state.conList = conList;
    },
};
// 业务逻辑层
const actions = {
    async getUserList({commit},query){
        let result = await reqUserList(query);
        console.log("逻辑层接收到的结果",result.data);
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
        console.log("逻辑层接收到的结果",result.data);
        commit("GETCONLIST",result.data);
    },
    async deleteConByIds({commit},idList){
        console.log("取消资格",idList);
        let result = await reqDeleteConByIds(idList);
        console.log("逻辑层接收到的结果",result.data);
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



