import React, { useEffect, useState } from 'react';
import { SettingOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { Layout, Menu, theme, Dropdown, Button, Space } from 'antd';
import { withRouter } from 'react-router-dom';
import SubMenu from 'antd/es/menu/SubMenu';

const { Header, Content, Sider } = Layout;

function Index(props) {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const [menuData, setMenuData] = useState([]);
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('currentUser'))); // 示例用户数据

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

    const handleLogout = () => {
        // 处理退出逻辑
        console.log('用户已退出');
        // 重定向到登录页
        props.history.push('/login');
        localStorage.removeItem('isLoggedIn');
    };

    const generateMenuItems = (data) => {
        return data.map((item) => {
            if (!item.visible) return null;
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

    const userMenu = (
        <Menu>
            <Menu.Item key="profile" icon={<UserOutlined />}>
                个人资料
            </Menu.Item>
            <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
                退出
            </Menu.Item>
        </Menu>
    );

    return (
        <Layout>
            <Header
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <div className="demo-logo" style={{ color: "white", fontSize: '24px', fontWeight: 'bold' }}>
                    信息管理系统
                </div>
                <Dropdown overlay={userMenu}>
                    <Button type="link" style={{ color: 'white' }}>
                        <Space>
                            {currentUser.email}
                            <UserOutlined />
                        </Space>
                    </Button>
                </Dropdown>
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
