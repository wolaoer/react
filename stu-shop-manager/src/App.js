import logo from './logo.svg';
import './App.css';
import React from 'react';
import {Switch,Route,Redirect} from 'react-router-dom';
import { adminRoutes } from './routes'
import Frame from './components/Frame/Index'
import './App.css'

const menuData = [
    {
        key: '1',
        number: '1',
        menuName: '商品',
        level: '1',
        frontName: 'goods',
        icon: 'icon',
        visible: true,
        order: 0,
    },
    {
        key: '7',
        number: '7',
        menuName: '订单',
        level: '1',
        frontName: 'orders',
        icon: 'icon',
        visible: true,
        order: 0,
    },
    {
        key: '12',
        number: '12',
        menuName: '营销',
        level: '1',
        frontName: 'sms',
        icon: 'icon',
        visible: true,
        order: 0,
    },
    {
        key: '21',
        number: '21',
        menuName: '权限',
        level: '1',
        frontName: 'permission',
        icon: 'icon',
        visible: true,
        order: 0,
        subMenu: [
            {
                key: '21-1',
                number: '21-1',
                menuName: '用户管理',
                level: '2',
                frontName: 'user',
                icon: 'icon',
                visible: true,
                order: 0,
            },
            {
                key: '21-2',
                number: '21-2',
                menuName: '菜单管理',
                level: '2',
                frontName: 'menu',
                icon: 'icon',
                visible: true,
                order: 0,
            },
            {
                key: '21-3',
                number: '21-3',
                menuName: '角色管理',
                level: '2',
                frontName: 'role',
                icon: 'icon',
                visible: true,
                order: 0,
            }
        ]
    },
];


const roleData = [
    {
        key: '1',
        number: '1',
        roleName: '商品管理员',
        description: '只能查看及操作商品',
        userCount: 0,
        createdAt: '2020-02-03 16:50:37',
        enabled: true,
        permission:[],
    },
    {
        key: '2',
        number: '2',
        roleName: '订单管理员',
        description: '只能查看及操作订单',
        userCount: 0,
        createdAt: '2018-09-30 15:53:45',
        enabled: true,
        permission: [],
    },
    {
        key: '5',
        number: '5',
        roleName: '超级管理员',
        description: '拥有所有查看和操作功能',
        userCount: 0,
        createdAt: '2020-02-02 15:11:05',
        enabled: true,
        permission: [],
    },
];
const userData = [
    {
        key: '1',
        number: '1',
        account: 'test',
        name: '测试账号',
        email: 'test@qq.com',
        createdAt: '2018-09-29 13:55:30',
        lastLogin: '2018-09-29 13:55:39',
        enabled: true,
        role:{
            key: '1',
            number: '1',
            roleName: '商品管理员',
            description: '只能查看及操作商品',
            userCount: 0,
            createdAt: '2020-02-03 16:50:37',
            enabled: true,
            permission:[
                {
                    key: '1',
                    number: '1',
                    menuName: '商品',
                    level: '1',
                    frontName: 'goods',
                    icon: 'icon',
                    visible: true,
                    order: 0,
                },
                {
                    key: '7',
                    number: '7',
                    menuName: '订单',
                    level: '1',
                    frontName: 'orders',
                    icon: 'icon',
                    visible: true,
                    order: 0,
                },
                {
                    key: '12',
                    number: '12',
                    menuName: '营销',
                    level: '1',
                    frontName: 'sms',
                    icon: 'icon',
                    visible: true,
                    order: 0,
                },
                {
                    key: '21',
                    number: '21',
                    menuName: '权限',
                    level: '1',
                    frontName: 'permission',
                    icon: 'icon',
                    visible: true,
                    order: 0,
                    subMenu: [
                        {
                            key: '21-1',
                            number: '21-1',
                            menuName: '用户管理',
                            level: '2',
                            frontName: 'user',
                            icon: 'icon',
                            visible: true,
                            order: 0,
                        },
                        {
                            key: '21-2',
                            number: '21-2',
                            menuName: '菜单管理',
                            level: '2',
                            frontName: 'menu',
                            icon: 'icon',
                            visible: true,
                            order: 0,
                        },
                        {
                            key: '21-3',
                            number: '21-3',
                            menuName: '角色管理',
                            level: '2',
                            frontName: 'role',
                            icon: 'icon',
                            visible: true,
                            order: 0,
                        }
                    ]
                },
            ],
        },
    },
    {
        key: '3',
        number: '3',
        account: 'admin',
        name: '系统管理员',
        email: 'admin@163.com',
        createdAt: '2018-10-08 13:32:47',
        lastLogin: '2019-04-20 12:45:16',
        enabled: true,
        role:'',
    },
    {
        key: '4',
        number: '4',
        account: 'macro',
        name: 'macro',
        email: 'macro@qq.com',
        createdAt: '2019-10-06 15:53:51',
        lastLogin: '2020-02-03 14:55:55',
        enabled: true,
        role:'',
    },
    {
        key: '6',
        number: '6',
        account: 'productAdmin',
        name: '商品管理员',
        email: 'product@qq.com',
        createdAt: '2020-02-07 16:15:08',
        lastLogin: 'N/A',
        enabled: true,
        role:'',
    },
];
localStorage.setItem('menuData', JSON.stringify(menuData));
localStorage.setItem('roleData', JSON.stringify(roleData));
localStorage.setItem('userData', JSON.stringify(userData));

function App() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const generateRoutes = (routes) => {
        return routes.map(route => {
            if (route.subRoutes) {
                return generateRoutes(route.subRoutes);
            }
            return <Route
                key={route.path}
                path={route.path}
                exact={route.exact}
                render={routeProps => <route.component {...routeProps} />}
            />;
        });
    };
    if (!isLoggedIn) {
        return <Redirect to="/login" />;
    }
    return (
        <Frame>
            <Switch>
                {generateRoutes(adminRoutes)}
                <Redirect to={adminRoutes[0].path} from="/admin" />
                <Redirect to="/404" />
            </Switch>
        </Frame>
    );
}
export default App;

