import React from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { useHistory } from 'react-router-dom';
const LoginForm = () => {
    const history = useHistory(); // 使用 useHistory 钩子
    const onFinish = (values) => {
        const encryptedPassword = CryptoJS.SHA256(values.password).toString();
        // axios.post('/api/login', {
        //     email: values.email,
        //     password: encryptedPassword,
        // })
        //     .then((response) => {
        //         message.success('登录成功');
        //         // 处理登录成功逻辑
        //     })
        //     .catch((error) => {
        //         message.error('登录失败');
        //         // 处理登录失败逻辑
        //     });

        //通过路由跳转

        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify({ email: values.email, password: encryptedPassword }));
        //设置菜单数据 从用户数据读取角色数据
        const userData = JSON.parse(localStorage.getItem('userData'));
        console.log('values',values);
        console.log('userData',userData);
        const currentUser = userData.find(user => user.email === values.email);
        console.log('currentUser.role.permission',currentUser)
        localStorage.setItem('menuData', JSON.stringify(currentUser.role.permission));
        history.push('/admin');
    };

    return (
        <Form
            name="login"
            onFinish={onFinish}
            layout="vertical"
        >
            <Form.Item
                name="email"
                label="邮箱"
                rules={[{ required: true, message: '请输入邮箱' }, { type: 'email', message: '请输入有效的邮箱' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="password"
                label="密码"
                rules={[{ required: true, message: '请输入密码' }]}
            >
                <Input.Password />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" block>
                    登录
                </Button>
            </Form.Item>
        </Form>
    );
};

export default LoginForm;
