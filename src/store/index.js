
import Vuex from "vuex"
import Vue from "vue";

Vue.use(Vuex);
import user from './user'
import essay from './essay'
import comments from './comments'
import question from './question'
import answer from './answer'
import test from './test'
import sys from './sys'

// 数据仓库
const state = {
    url: "http://192.168.1.191:8082"
};

export default new Vuex.Store({
    state,
    modules: {
        user,
        essay,
        comments,
        question,
        answer,
        test,
        sys
    },
});


// // 数据仓库
// const state = {};
// // 数据操作层
// const mutations = {};
// // 业务逻辑层
// const actions = {};
// // 计算属性（数据简化）
// const getters = {};

// export default{
//     state,
//     mutations,
//     actions,
//     getters
// };