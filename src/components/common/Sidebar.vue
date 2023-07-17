<template>
    <div class="sidebar">
        <el-menu
            class="sidebar-el-menu"
            :default-active="onRoutes"
            :collapse="collapse"
            background-color="#324157"
            text-color="#bfcbd9"
            active-text-color="#20a0ff"
            unique-opened
            router
        >
            <template v-for="item in items">
                <!-- 存在二级菜单的渲染方式，这里的index指定了路由 -->
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <!-- 使用具名插槽传递菜单名 -->
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <!-- 存在三级菜单的渲染方式 -->
                            <el-submenu
                                v-if="subItem.subs"
                                :index="subItem.index"
                                :key="subItem.index"
                            >
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item
                                    v-for="(threeItem,i) in subItem.subs"
                                    :key="i"
                                    :index="threeItem.index"
                                >{{ threeItem.title }}</el-menu-item>
                            </el-submenu>
                            <!-- 不存在三级菜单 -->
                            <el-menu-item
                                v-else
                                :index="subItem.index"
                                :key="subItem.id"
                            >{{ subItem.title }}</el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <!-- 没有二级菜单的渲染方式 -->
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i>
                        <span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
import bus from '@/components/common/bus';
export default {
    data() {
        return {
            collapse: false,
            items: [
                // {
                //     id:'001',
                //     icon: 'el-icon-s-home',
                //     index: 'dashboard',
                //     title: '系统首页'
                // },
                {
                    id:'002',
                    icon: 'el-icon-document',
                    index: '2',
                    title: '用户管理',
                    subs: [
                        {
                            index: 'userTable',
                            title: '用户管理'
                        },
                        {
                            index: 'doctorTable',
                            title: '咨询师管理'
                        },
                        {
                            index: 'certifiedTable',
                            title: '认证申请'
                        }
                    ]
                },
                {
                    id:'003',
                    index: '3',
                    icon: 'el-icon-document',
                    title: '科普文章管理',
                    subs: [
                        {
                            index: 'essayTable',
                            title: '文章管理'
                        },
                        {
                            index: 'commentTable',
                            title: '评论管理'
                        },
                        {
                            index: 'certifiedEssay',
                            title: '文章审核'
                        }
                    ]
                },
                {
                    id:'004',
                    index: '4',
                    icon: 'el-icon-document',
                    title: '问答管理',
                    subs: [
                        {
                            index: 'questionTable',
                            title: '提问管理'
                        },
                        {
                            index: 'answerTable',
                            title: '回复管理'
                        }
                    ]
                },
                {
                    id:'005',
                    index: '5',
                    icon: 'el-icon-s-comment',
                    title: '评测管理',
                    subs: [
                        {
                            index: 'testTable',
                            title: '问卷信息管理'
                        },
                        {
                            index: 'testQTable',
                            title: '问卷内容管理',
                            subs: [
                                {
                                    index: 'testCTable',
                                    title: '问卷查看'
                                },
                                {
                                    index: 'testAddTable',
                                    title: '问卷新增'
                                }
                            ]
                        },
                        {
                            index: 'testATable',
                            title: '问卷规则管理'
                        },
                        {
                            index: 'testRTable',
                            title: '问卷结果管理'
                        }
                    ]
                },
                {
                    id:'006',
                    index: '6',
                    icon: 'el-icon-s-comment',
                    title: '系统管理',
                    subs: [
                        {
                            index: 'sysTable',
                            title: '系统公告'
                        },
                        {
                            index: 'sysEdit',
                            title: '密码修改'
                        },
                        // {
                        //     index: 'userTable',
                        //     title: '日志查看'
                        // }
                    ]
                }
                // {
                //     id:'008',
                //     icon: 'el-icon-menu',
                //     index: 'tabs',
                //     title: 'tab选项卡'
                // },
                // {
                //     icon: 'el-icon-lx-global',
                //     index: 'i18n',
                //     title: '国际化功能'
                // },
                // {
                //     icon: 'el-icon-first-aid-kit',
                //     index: '7',
                //     title: '错误处理',
                //     subs: [
                //         {
                //             index: 'permission',
                //             title: '权限测试'
                //         },
                //         {
                //             index: '404',
                //             title: '404页面'
                //         }
                //     ]
                // },
                // {
                //     icon: 'el-icon-user',
                //     index: '/donate',
                //     title: '支持作者'
                // }
            ]
        };
    },
    computed: {
        onRoutes() {
            return this.$route.path.replace('/', '');
        }
    },
    created() {
        // 接受来自header组件的信息，改变侧边栏样式
        bus.$on('collapse', msg => {
            this.collapse = msg;
            bus.$emit('collapse-content', msg);
        });
    }
};
</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
}
.sidebar > ul {
    height: 100%;
}
</style>
