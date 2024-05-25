import React, {useEffect, useState} from 'react';
import {Button, Card, Form, Input, message, Modal, Popconfirm, Switch, Table, Tree} from 'antd';

const initialData = JSON.parse(localStorage.getItem('roleData'));
const columns = (handleDelete, handleSwitchChange, handleAssign, handleEdit)=>[
    {
        title: '编号',
        dataIndex: 'number',
        key: 'number',
    },
    {
        title: '角色名称',
        dataIndex: 'roleName',
        key: 'roleName',
    },
    {
        title: '描述',
        dataIndex: 'description',
        key: 'description',
    },
    {
        title: '用户数',
        dataIndex: 'userCount',
        key: 'userCount',
    },
    {
        title: '添加时间',
        dataIndex: 'createdAt',
        key: 'createdAt',
    },
    {
        title: '是否启用',
        dataIndex: 'enabled',
        key: 'enabled',
        render: (text, record) => (
            <Switch checked={record.enabled} onChange={(checked) => handleSwitchChange(record.key, checked)} />
        ),
    },
    {
        title: '操作',
        key: 'action',
        render: (text, record) => (
            <span>
        <Button type="link" onClick={() => handleAssign(record.key)}>分配菜单</Button>
        <Button type="link" onClick={() => handleEdit(record.key)}>编辑</Button>
        <Popconfirm
            title="确定要删除这个角色吗?"
            onConfirm={() => handleDelete(record.key)}
        >
          <Button type="link">删除</Button>
        </Popconfirm>
      </span>
        ),
    },
];



function RoleManagement() {
    const [data, setData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [isAssignModalVisible, setIsAssignModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [currentRole, setCurrentRole] = useState(null);
    const [menuData, setMenuData] = useState([]);

    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem('roleData')) || [];
        setMenuData(transformMenuData(JSON.parse(localStorage.getItem('menuData')) || []));
        setData(storedData);
    }, []);
    const handleDelete = (key) => {
        const newData = JSON.parse(localStorage.getItem('roleData')).filter((item) => item.key !== key);
        setData(newData);
        localStorage.setItem('roleData', JSON.stringify(newData));
    };
    const handleSearch = () => {
        const filteredData = data.filter((item) => item.roleName.includes(searchText));
        setData(filteredData);
    };

    const handleReset = () => {
        setSearchText('');
        setData(JSON.parse(localStorage.getItem('roleData')));
    };

    const handleSwitchChange = (key, checked) => {
        const newData = data.map((item) => {
            if (item.key === key) {
                return { ...item, enabled: checked };
            }
            return item;
        });
        setData(newData);
        localStorage.setItem('roleData', JSON.stringify(newData));
    };
    const transformMenuData = (data) => {
        return data.map(item => {
            return {
                title: item.menuName,
                key: item.key,
                children: item.subMenu ? transformMenuData(item.subMenu) : undefined
            };
        });
    };


    const handleAssign = (key) => {
        setCurrentRole(key);

        const current = data.find(item => item.key === key);
        if(current.permission.length > 0) {
            setSelectedKeys(getAllKeys(current.permission));
        }

        setIsAssignModalVisible(true);
    };

// 递归获取所有的key，包括子菜单的key
    const getAllKeys = (menuItems) => {
        let keys = [];
        for (let item of menuItems) {
            if(!item.subMenu){
                keys.push(item.key);
            }
            if (item.subMenu) {
                keys = [...keys, ...getAllKeys(item.subMenu)];
            }
        }
        return keys;
    };

    const handleEdit = (key) => {
        setCurrentRole(key);
        setIsEditModalVisible(true);
    };
    const handleAdd = () => {
        setIsAddModalVisible(true);
    };
    const handleAssignOk = () => {
        //获取菜单数据
        const menuData = JSON.parse(localStorage.getItem('menuData'));
        //获取当前角色
        const current = data.find(item => item.key === currentRole);
        //获取selectedKeys
        current.permission = menuData.reduce((acc, item) => {
            if (selectedKeys.includes(item.key)) {
                // console.log('item', item);
                acc.push(item);
            } else if (item.subMenu) {
                const subItems = item.subMenu.reduce((subAcc, subItem) => {
                    if (selectedKeys.includes(subItem.key)) {
                        // console.log('subItem', subItem);
                        subAcc.push(subItem);
                    }
                    return subAcc;
                }, []);
                if (subItems.length > 0) {
                    acc.push({...item, subMenu: subItems});
                }
            }
            return acc;
        }, []);
        // console.log('current', current);
        const newData = data.map(item => {
            if (item.key === currentRole) {
                return current;
            }
            return item;
        });
        setData(newData);
        localStorage.setItem('roleData', JSON.stringify(newData));
        setIsAssignModalVisible(false);
        message.success('分配菜单成功');
    }

    const handleAssignCancel = () => {
        setIsAssignModalVisible(false);
    };

    const handleEditOk = () => {
        // 保存编辑
        setIsEditModalVisible(false);
        //将数据写入到localStorage

    };

    const handleEditCancel = () => {
        setIsEditModalVisible(false);
        //清空输入框
    };

    const handleAddOk = () => {
        // 保存新建
        setIsAddModalVisible(false);

    };

    const handleAddCancel = () => {
        setIsAddModalVisible(false);
        //清空输入框
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
                <Button type="primary" style={{ marginRight: 8 }} onClick={handleAdd}>
                    添加
                </Button>
            </div>
            <Table columns={columns(handleDelete, handleSwitchChange, handleAssign, handleEdit)} dataSource={data} />
            {/* 分配菜单的Modal */}
            <Modal
                title="分配菜单"
                visible={isAssignModalVisible}
                onOk={handleAssignOk}
                onCancel={handleAssignCancel}
            >
                <Tree
                    checkable
                    defaultExpandAll
                    treeData={menuData}
                    onCheck={(checkedKeys) => setSelectedKeys(checkedKeys)}
                    checkedKeys={selectedKeys}
                />
            </Modal>

            {/* 编辑角色的Modal */}
            <Modal
                title="编辑角色"
                visible={isEditModalVisible}
                onOk={handleEditOk}
                onCancel={handleEditCancel}
            >
                <Form layout="vertical">
                    <Form.Item label="角色名称">
                        <Input />
                    </Form.Item>
                    <Form.Item label="描述">
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>

            {/* 添加角色的Modal */}
            <Modal
                title="添加角色"
                visible={isAddModalVisible}
                onOk={handleAddOk}
                onCancel={handleAddCancel}
            >
                <Form layout="vertical">
                    <Form.Item label="编号">
                        <Input />
                    </Form.Item>
                    <Form.Item label="角色名称">
                        <Input />
                    </Form.Item>
                    <Form.Item label="描述">
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
}

export default RoleManagement;
