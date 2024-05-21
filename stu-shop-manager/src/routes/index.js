import Index from "../pages/admin/dashboard";
import List from "../pages/admin/products/List";
import Edit from "../pages/admin/products/Edit";
import PageNotFound from "../pages/PageNotFound";
import Login from "../pages/Login";
import UserList from "../pages/admin/user/List";
import RoleManagement from "../pages/admin/role/List";

export const mainRoutes = [
    {
        path: '/login',
        component: Login
    },
    {
        path: '/404',
        component: PageNotFound
    }
]

export const adminRoutes = [{
    path: '/admin/dashboard',
    component: Index,
    isShow: true,
    title: '看板'
}, {
    path: '/admin/products',
    component: List,
    exact: true,
    isShow: true,
    title: '商品管理'
}, {
    path: '/admin/products/edit/:id',
    component: Edit,
    isShow: false
},
    {
    path: '/admin/user',
    component: UserList,
    exact: true,
    isShow: false,
    title: '用户管理',
},{
    path: '/admin/role',
    component: RoleManagement,
    exact: true,
    isShow: false,
    title: '角色管理',
},
    {
        path: '/admin/permission',
        title: '权限管理',
        isShow: true,
        subRoutes: [{
            path: '/admin/user',
            component: UserList,
            exact: true,
            isShow: true,
            title: '用户管理',
        },{
            path: '/admin/role',
            component: RoleManagement,
            exact: true,
            isShow: true,
            title: '角色管理',
        }]
    }
];
