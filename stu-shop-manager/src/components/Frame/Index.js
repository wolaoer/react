// import React from 'react';
// import { LaptopOutlined, NotificationOutlined, UserOutlined, SettingOutlined } from '@ant-design/icons';
//
// import { Breadcrumb, Layout, Menu, theme } from 'antd';
// import {adminRoutes} from "../../routes";
// import {withRouter} from "react-router-dom";
// import SubMenu from "antd/es/menu/SubMenu";
//
// const { Header, Content, Sider } = Layout;
// const items1 = ['1', '2', '3'].map((key) => ({
//     key,
//     label: `nav ${key}`,
// }));
// const routes = adminRoutes.filter((route) => route.isShow === true);
// function Index(props) {
//     const {
//         token: { colorBgContainer, borderRadiusLG },
//     } = theme.useToken();
//     return (
//         <Layout>
//             <Header
//                 style={{
//                     display: 'flex',
//                     alignItems: 'center',
//                 }}
//             >
//                 <div className="demo-logo" style={{
//                     color:"white",
//                 }}>
//                     信息管理系统
//                 </div>
//
//             </Header>
//             <Layout>
//                 <Sider
//                     width={200}
//                     style={{
//                         background: colorBgContainer,
//                     }}
//                 >
//                     <Menu
//                         mode="inline"
//                         defaultSelectedKeys={['1']}
//                         defaultOpenKeys={['sub1']}
//                         style={{
//                             height: '100%',
//                             borderRight: 0,
//                         }}>
//                         {routes.map((route) => {
//                             if (route.subRoutes) {
//                                 return (
//                                     <SubMenu key={route.path} icon={<SettingOutlined />} title={route.title}>
//                                         {route.subRoutes.map(subRoute => (
//                                             <Menu.Item key={subRoute.path} onClick={p => {
//                                                 console.log(p.key);
//                                                 props.history.push(p.key);
//
//                                             }}>
//                                                 {subRoute.title}
//                                             </Menu.Item>
//                                         ))}
//                                     </SubMenu>
//                                 );
//                             }
//                             return (
//                                 <Menu.Item key={route.path} onClick={p=>props.history.push(p.key)}>
//                                     {route.title}
//                                 </Menu.Item>
//                             );
//                         })}
//                     </Menu>
//                 </Sider>
//                 <Layout
//                     style={{
//                         padding: '16px',
//                     }}
//                 >
//                     <Content
//                         style={{
//                             padding: 24,
//                             margin: 0,
//                             minHeight: 280,
//                             background: colorBgContainer,
//                             borderRadius: borderRadiusLG,
//                         }}
//                     >
//                         {props.children}
//                     </Content>
//                 </Layout>
//             </Layout>
//         </Layout>
//     );
// }
// export default withRouter(Index);

import React, { useEffect, useState } from 'react';
import { SettingOutlined } from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import { withRouter } from 'react-router-dom';
import SubMenu from 'antd/es/menu/SubMenu';

const { Header, Content, Sider } = Layout;

function Index(props) {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const [menuData, setMenuData] = useState([]);

    useEffect(() => {
        const fetchMenuData = () => {
            const storedMenuData = localStorage.getItem('menuData');
            if (storedMenuData) {
                setMenuData(JSON.parse(storedMenuData));
            }
        };

        fetchMenuData();

        const interval = setInterval(() => {
            fetchMenuData();
        }, 1000); // 每秒检查一次

        return () => clearInterval(interval);
    }, []);

    const generateMenuItems = (data) => {
        return data.map((item) => {
            if(!item.visible) return null;
            if (item.subMenu && item.subMenu.length > 0) {
                return (
                    <SubMenu key={item.key} icon={<SettingOutlined />} title={item.menuName}>
                        {generateMenuItems(item.subMenu)}
                    </SubMenu>
                );
            }
            return (
                <Menu.Item key={item.key} onClick={() => props.history.push(`/admin/${item.frontName}`)}>
                    {item.menuName}
                </Menu.Item>
            );
        });
    };

    return (
        <Layout>
            <Header
                style={{
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <div className="demo-logo" style={{ color: "white" }}>
                    信息管理系统
                </div>
            </Header>
            <Layout>
                <Sider
                    width={200}
                    style={{ background: colorBgContainer }}
                >
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={['1']}
                        style={{ height: '100%', borderRight: 0 }}
                    >
                        {generateMenuItems(menuData)}
                    </Menu>
                </Sider>
                <Layout style={{ padding: '16px' }}>
                    <Content
                        style={{
                            padding: 24,
                            margin: 0,
                            minHeight: 280,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        {props.children}
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
}

export default withRouter(Index);

