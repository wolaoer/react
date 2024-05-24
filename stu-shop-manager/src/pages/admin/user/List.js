import React, { useState } from 'react';
import { Card, Table, Button, Popconfirm, Switch, Input, Form } from 'antd';

const initialData = JSON.parse(localStorage.getItem('userData'));

const columns = [
    {
        title: '编号',
        dataIndex: 'number',
        key: 'number',
    },
    {
        title: '账号',
        dataIndex: 'account',
        key: 'account',
    },
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
            <Switch checked={record.enabled} />
        ),
    },
    {
        title: '操作',
        key: 'action',
        render: (text, record) => (
            <span>
        <Button type="link">分配角色</Button>
        <Button type="link">编辑</Button>
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

function handleDelete(key) {
    console.log(`删除用户 ${key}`);
}

function UserList() {
    const [data, setData] = useState(initialData);
    const [searchText, setSearchText] = useState('');

    const handleSearch = () => {
        const filteredData = initialData.filter((item) => {
            return (
                item.account.includes(searchText) ||
                item.name.includes(searchText)
            );
        });
        setData(filteredData);
    };

    const handleReset = () => {
        setSearchText('');
        setData(initialData);
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
                <Button type="primary" style={{ marginRight: 8 }}>
                    添加
                </Button>
            </div>
            <Table columns={columns} dataSource={data} />
        </Card>
    );
}

export default UserList;
