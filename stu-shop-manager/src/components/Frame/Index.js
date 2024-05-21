import React from 'react';
import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import {adminRoutes} from "../../routes";
import {withRouter} from "react-router-dom";

const { Header, Content, Sider } = Layout;
const items1 = ['1', '2', '3'].map((key) => ({
    key,
    label: `nav ${key}`,
}));
const routes = adminRoutes.filter((route) => route.isShow === true);
function Index(props) {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    return (
        <Layout>
            <Header
                style={{
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <div className="demo-logo" style={{
                    color:"white",
                }}>
                    信息管理系统
                </div>

            </Header>
            <Layout>
                <Sider
                    width={200}
                    style={{
                        background: colorBgContainer,
                    }}
                >
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={['1']}
                        defaultOpenKeys={['sub1']}
                        style={{
                            height: '100%',
                            borderRight: 0,
                        }}>
                        {routes.map((route) => {
                            return (
                                <Menu.Item key={route.path} onClick={p=>props.history.push(p.key)}>
                                    {route.title}
                                </Menu.Item>
                            );
                        })}
                    </Menu>
                </Sider>
                <Layout
                    style={{
                        padding: '16px',
                    }}
                >
                    {/*<Breadcrumb*/}
                    {/*    style={{*/}
                    {/*        margin: '16px 0',*/}
                    {/*    }}*/}
                    {/*>*/}
                    {/*    <Breadcrumb.Item>Home</Breadcrumb.Item>*/}
                    {/*    <Breadcrumb.Item>List</Breadcrumb.Item>*/}
                    {/*    <Breadcrumb.Item>App</Breadcrumb.Item>*/}
                    {/*</Breadcrumb>*/}
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