import React from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';
import CryptoJS from 'crypto-js';

const passwordValidator = (_, value) => {
    if (!value) {
        return Promise.reject(new Error('请输入密码'));
    }
    if (value.length < 8 || value.length > 16) {
        return Promise.reject(new Error('密码长度需为8-16位'));
    }
    if (!/[A-Z]/.test(value)) {
        return Promise.reject(new Error('密码需包含大写字母'));
    }
    if (!/[a-z]/.test(value)) {
        return Promise.reject(new Error('密码需包含小写字母'));
    }
    if (!/[0-9]/.test(value)) {
        return Promise.reject(new Error('密码需包含数字'));
    }
    return Promise.resolve();
};

const RegisterForm = () => {
    const onFinish = (values) => {
        const encryptedPassword = CryptoJS.SHA256(values.password).toString();
        axios.post('/api/register', {
            email: values.email,
            password: encryptedPassword,
        })
            .then((response) => {
                message.success('注册成功');
                // 处理注册成功逻辑
            })
            .catch((error) => {
                message.error('注册失败');
                // 处理注册失败逻辑
            });
    };

    return (
        <Form
            name="register"
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
                rules={[{ required: true, message: '请输入密码' }, { validator: passwordValidator }]}
            >
                <Input.Password />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" block>
                    注册
                </Button>
            </Form.Item>
        </Form>
    );
};

export default RegisterForm;
