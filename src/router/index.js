import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

let router = new Router({
    routes: [
        //复用路由/实现初始页面指定为dashboard
        {
            path: '/',
            // redirect: '/dashboard'
            redirect: '/userTable'
        },
        {
            path: '/',
            component: () => import(/* webpackChunkName: "home" */ '@/components/common/Home.vue'),
            meta: { title: '自述文件' },
            children: [
                {
                    path: '/dashboard',
                    component: () => import(/* webpackChunkName: "dashboard" */ '@/components/page/Dashboard.vue'),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/userTable',
                    component: () => import(/* webpackChunkName: "userTable" */ '@/components/page/UserTable.vue'),
                    meta: { title: '用户管理' }
                },
                {
                    path: '/doctorTable',
                    component: () => import(/* webpackChunkName: "doctorTable" */ '@/components/page/DoctorTable.vue'),
                    meta: { title: '咨询师管理' }
                },
                {
                    path: '/certifiedTable',
                    component: () => import(/* webpackChunkName: "certifiedTable" */ '@/components/page/CertifiedTable.vue'),
                    meta: { title: '认证申请' }
                },
                {
                    path: '/essayTable',
                    component: () => import(/* webpackChunkName: "essayTable" */ '@/components/page/EssayTable.vue'),
                    meta: { title: '文章管理' }
                },
                {
                    path: '/certifiedEssay',
                    component: () => import(/* webpackChunkName: "certifiedEssay" */ '@/components/page/CertifiedEssay.vue'),
                    meta: { title: '文章审核' }
                },
                {
                    path: '/commentTable',
                    component: () => import(/* webpackChunkName: "commentTable" */ '@/components/page/CommentTable.vue'),
                    meta: { title: '评论管理' }
                },
                {
                    path: '/questionTable',
                    component: () => import(/* webpackChunkName: "questionTable" */ '@/components/page/QuestionTable.vue'),
                    meta: { title: '提问管理' }
                },
                {
                    path: '/answerTable',
                    component: () => import(/* webpackChunkName: "answerTable" */ '@/components/page/AnswerTable.vue'),
                    meta: { title: '回复管理' }
                },
                {
                    path: '/testTable',
                    component: () => import(/* webpackChunkName: "testTable" */ '@/components/page/TestTable.vue'),
                    meta: { title: '问卷信息管理' }
                },
                {
                    path: '/testQTable',
                    component: () => import(/* webpackChunkName: "testQTable" */ '@/components/page/TestQTable.vue'),
                    meta: { title: '问卷内容管理' }
                },
                {
                    path: '/testCTable',
                    component: () => import(/* webpackChunkName: "testCTable" */ '@/components/page/TestCTable.vue'),
                    meta: { title: '问卷查看' }
                },
                {
                    path: '/testAddTable',
                    component: () => import(/* webpackChunkName: "testAddTable" */ '@/components/page/TestAddTable.vue'),
                    meta: { title: '问卷新增' }
                },
                {
                    path: '/testATable',
                    component: () => import(/* webpackChunkName: "testATable" */ '@/components/page/TestATable.vue'),
                    meta: { title: '问卷规则管理' }
                },
                {
                    path: '/testRTable',
                    component: () => import(/* webpackChunkName: "testRTable" */ '@/components/page/TestRTable.vue'),
                    meta: { title: '问卷结果管理' }
                },
                {
                    path: '/sysTable',
                    component: () => import(/* webpackChunkName: "sysTable" */ '@/components/page/SysTable.vue'),
                    meta: { title: '系统公告管理' }
                },
                {
                    path: '/sysEdit',
                    component: () => import(/* webpackChunkName: "sysEdit" */ '@/components/page/SysEdit.vue'),
                    meta: { title: '密码修改' }
                },


                {
                    path: '/tabs',
                    component: () => import(/* webpackChunkName: "tabs" */ '@/components/page/Tabs.vue'),
                    meta: { title: 'tab选项卡' }
                },
                {
                    // 国际化组件
                    path: '/i18n',
                    component: () => import(/* webpackChunkName: "i18n" */ '@/components/page/I18n.vue'),
                    meta: { title: '国际化' }
                },
                {
                    // 权限页面
                    path: '/permission',
                    component: () => import(/* webpackChunkName: "permission" */ '@/components/page/Permission.vue'),
                    meta: { title: '权限测试', permission: true }
                },
                {
                    path: '/404',
                    component: () => import(/* webpackChunkName: "404" */ '@/components/page/404.vue'),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: () => import(/* webpackChunkName: "403" */ '@/components/page/403.vue'),
                    meta: { title: '403' }
                },
                {
                    path: '/donate',
                    component: () => import(/* webpackChunkName: "donate" */ '@/components/page/Donate.vue'),
                    meta: { title: '支持作者' }
                }
            ]
        },
        {
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '@/components/page/Login.vue'),
            meta: { title: '登录' }
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title} | INTIMATE_SYSTEM`;
    //添加登录信息到本地缓存
    const role = localStorage.getItem('userInfo');
    console.log("当前的role：",role);
    console.log("去往地址",to);
    //如果本地缓存无用户信息且去往页面不是登录页面则跳转登录页
    if (!role && to.path != '/login') {
        next('/login');
    // 如果存在用户信息且是管理员权限则可进入（未完善）
    } else if (to.meta.permission) {
        const authority = JSON.parse(role).authority;
        authority == 0 ? next() : next('/403');
        
    } else {
        // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
        if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
            Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
                confirmButtonText: '确定'
            });
        } else {
            //本地缓存无用户信息，但去往登录页，放行
            next();
        }
    }
  });

export default router
