import React, { useState } from 'react';
import { Layout, Card, Tabs } from 'antd';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import TabPane from "antd/es/tabs/TabPane";

const { Header, Content } = Layout;

const Login = () => {
    const [activeTab, setActiveTab] = useState('login');

    return (
        <Layout className="layout">
            <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>信息管理系统</div>
            </Header>
            <Content style={{ padding: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Card style={{ width: 400 }}>
                    <Tabs activeKey={activeTab} onChange={setActiveTab} centered>
                        <TabPane tab="登录" key="login">
                            <LoginForm />
                        </TabPane>
                        <TabPane tab="注册" key="register">
                            <RegisterForm />
                        </TabPane>
                    </Tabs>
                </Card>
            </Content>
        </Layout>
    );
};

export default Login;
