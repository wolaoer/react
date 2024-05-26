import React, {useEffect, useState} from 'react';
import {Card, Table, Button, Popconfirm, Switch, Input, Form, Modal, message, Select} from 'antd';

const initialData = JSON.parse(localStorage.getItem('userData')) || [
    {
        key: '1',
        number: '001',
        account: 'user1',
        name: 'User One',
        email: 'user1@example.com',
        createdAt: '2023-01-01',
        lastLogin: '2023-05-01',
        enabled: true,
    },
    // 你可以添加更多的初始数据
];

const columns = (handleEdit, handleDelete, handleToggleEnable,handleAssignRole) => [
    {
        title: '编号',
        dataIndex: 'number',
        key: 'number',
    },
    // {
    //     title: '账号',
    //     dataIndex: 'account',
    //     key: 'account',
    // },
    {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: '添加时间',
        dataIndex: 'createdAt',
        key: 'createdAt',
    },
    {
        title: '最后登录',
        dataIndex: 'lastLogin',
        key: 'lastLogin',
    },
    {
        title: '是否启用',
        dataIndex: 'enabled',
        key: 'enabled',
        render: (text, record) => (
            <Switch checked={record.enabled} onChange={() => handleToggleEnable(record.key)} />
        ),
    },
    {
        title: '操作',
        key: 'action',
        render: (text, record) => (
            <span>
                <Button type="link" onClick={() => handleAssignRole(record)}>分配角色</Button>
                <Button type="link" onClick={() => handleEdit(record)}>编辑</Button>
                <Popconfirm
                    title="确定要删除这个用户吗?"
                    onConfirm={() => handleDelete(record.key)}
                >
                    <Button type="link">删除</Button>
                </Popconfirm>
            </span>
        ),
    },
];

const UserList = () => {
    const [data, setData] = useState(initialData);
    const [searchText, setSearchText] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const [assigningRoleUser, setAssigningRoleUser] = useState(null);
    const [roleData, setRoleData] = useState([]);
    const [isAddUserModalVisible, setIsAddUserModalVisible] = useState(false);

    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem('userData')) || [];
        setData(storedData);
    }, []);


    const handleSearch = () => {
        const filteredData = data.filter((item) => {
            return (
                item.account.includes(searchText) ||
                item.name.includes(searchText)
            );
        });
        setData(filteredData);
    };

    const handleReset = () => {
        setSearchText('');
        setData(JSON.parse(localStorage.getItem('userData')));
    };

    const handleDelete = (key) => {
        const newData = data.filter((item) => item.key !== key);
        setData(newData);
        localStorage.setItem('userData', JSON.stringify(newData));
        message.success('用户已删除');
    };

    const handleToggleEnable = (key) => {
        const newData = data.map((item) => {
            if (item.key === key) {
                return { ...item, enabled: !item.enabled };
            }
            return item;
        });
        setData(newData);
        localStorage.setItem('userData', JSON.stringify(newData));
        message.success('用户状态已更新');
    };

    const handleEdit = (record) => {
        setEditingUser(record);
    };
    const handleFormChange = (changedValues) => {
        setEditingUser({ ...editingUser, ...changedValues });
    };

    const handleSave = (values) => {
        const newData = data.map((item) => {
            if (item.key === editingUser.key) {
                return { ...item, ...values };
            }
            return item;
        });
        setData(newData);
        localStorage.setItem('userData', JSON.stringify(newData));
        setEditingUser(null);
        message.success('用户信息已更新');
    };

    const handleAssignRole = (record) => {
        setAssigningRoleUser(record);
        setRoleData(JSON.parse(localStorage.getItem('roleData')) || []);
    };

    const handleRoleChange = (value) => {
        //从roleData中通过roleName找到对应的role
        const allRoles = JSON.parse(localStorage.getItem('roleData') || []);
        const role = allRoles.find((item) => item.roleName === value);
        setAssigningRoleUser({ ...assigningRoleUser, role: role });
    };

    const handleSaveRole = () => {
        // console.log('assigningRoleUser: ', assigningRoleUser);
        const newData = data.map((item) => {
            if (item.key === assigningRoleUser.key) {
                return { ...item, role: assigningRoleUser.role };
            }
            return item;
        });
        console.log('newData: ', newData);
        setData(newData);
        localStorage.setItem('userData', JSON.stringify(newData));
        setAssigningRoleUser(null);
        message.success('角色已分配');
    };

    const handleAddUser = () => {
        setIsAddUserModalVisible(true);
    };

    const handleAddUserCancel = () => {
        setIsAddUserModalVisible(false);
    };
    const handleAddUserSave = (values) => {
        const newUser = {
            key: (data.length + 1).toString(),
            ...values,
            createdAt: new Date().toISOString().split('T')[0], // 使用当前日期作为添加时间
            lastLogin: '', // 初始情况下没有最后登录时间
            enabled: true, // 新用户默认启用
            role: '', // 新用户默认没有角色
        };
        const newData = [...data, newUser];
        setData(newData);
        localStorage.setItem('userData', JSON.stringify(newData));
        setIsAddUserModalVisible(false);
        message.success('用户已添加');
    };

    return (
        <Card>
            <Form layout="inline" style={{ marginBottom: 16 }}>
                <Form.Item>
                    <Input
                        placeholder="输入搜索关键词"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" onClick={handleSearch}>
                        查询搜索
                    </Button>
                </Form.Item>
                <Form.Item>
                    <Button onClick={handleReset}>重置</Button>
                </Form.Item>
            </Form>
            <div style={{ marginBottom: 16 }}>
                <Button type="primary" style={{ marginRight: 8 }} onClick={handleAddUser}>
                    添加
                </Button>
            </div>
            <Table columns={columns(handleEdit, handleDelete, handleToggleEnable,handleAssignRole)} dataSource={data} />
            <Modal
                title="添加用户"
                visible={isAddUserModalVisible}
                onCancel={handleAddUserCancel}
                footer={null}
            >
                <Form onFinish={handleAddUserSave}>
                    <Form.Item name="number" label="编号" rules={[{ required: true, message: '请输入编号' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="account" label="账号" rules={[{ required: true, message: '请输入账号' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="name" label="姓名" rules={[{ required: true, message: '请输入姓名' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="email" label="邮箱" rules={[{ required: true, message: '请输入邮箱' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            保存
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            {editingUser && (
                <Modal
                    title="编辑用户"
                    visible={!!editingUser}
                    onCancel={() => setEditingUser(null)}
                    onOk={() => handleSave(editingUser)}
                >
                    <Form
                        initialValues={editingUser}
                        onValuesChange={handleFormChange}
                        onFinish={handleSave}
                    >
                        <Form.Item name="number" label="编号">
                            <Input />
                        </Form.Item>
                        <Form.Item name="account" label="账号">
                            <Input />
                        </Form.Item>
                        <Form.Item name="name" label="姓名">
                            <Input />
                        </Form.Item>
                        <Form.Item name="email" label="邮箱">
                            <Input />
                        </Form.Item>
                        <Form.Item name="createdAt" label="添加时间">
                            <Input />
                        </Form.Item>
                        <Form.Item name="lastLogin" label="最后登录">
                            <Input />
                        </Form.Item>
                    </Form>
                </Modal>
            )}
            {assigningRoleUser && (
                <Modal
                    title="分配角色"
                    visible={!!assigningRoleUser}
                    onCancel={() => setAssigningRoleUser(null)}
                    onOk={handleSaveRole}
                >
                    <Form>
                        <Form.Item label="角色">
                            <Select value={assigningRoleUser.role.roleName} onChange={handleRoleChange}>
                                {roleData.map((role) => (
                                    <Select.Option key={role.key} value={role.roleName}>
                                        {role.roleName}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Form>
                </Modal>
            )}
        </Card>
    );
};

export default UserList;
