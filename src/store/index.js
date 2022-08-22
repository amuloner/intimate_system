
import Vuex from "vuex"
import Vue from "vue";

Vue.use(Vuex);
import user from './user'
import essay from './essay'
import comments from './comments'

export default new Vuex.Store({
    modules: {
        user,
        essay,
        comments
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