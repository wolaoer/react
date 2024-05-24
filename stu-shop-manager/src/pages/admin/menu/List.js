import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Popconfirm, Switch, Input, Form, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const columns = (handleDelete, handleSwitchChange, handleViewSubmenu, handleEdit) => [
    {
        title: '编号',
        dataIndex: 'number',
        key: 'number',
    },
    {
        title: '菜单名称',
        dataIndex: 'menuName',
        key: 'menuName',
    },
    {
        title: '菜单级别',
        dataIndex: 'level',
        key: 'level',
    },
    {
        title: '前端名称',
        dataIndex: 'frontName',
        key: 'frontName',
    },
    {
        title: '是否显示',
        dataIndex: 'visible',
        key: 'visible',
        render: (text, record) => (
            <Switch checked={record.visible} onChange={(checked) => handleSwitchChange(record.key, checked)} />
        ),
    },
    {
        title: '排序',
        dataIndex: 'order',
        key: 'order',
    },
    {
        title: '设置',
        key: 'setting',
        render: (text, record) => (
            <Button type="link" onClick={() => {
                localStorage.setItem("lastKey",record.key);
                handleViewSubmenu(record.key);
            }}>查看下级</Button>
        ),
    },
    {
        title: '操作',
        key: 'action',
        render: (text, record) => (
            <span>
                <Button type="link" onClick={() => handleEdit(record.key)}>编辑</Button>
                <Popconfirm
                    title="确定要删除这个菜单吗?"
                    onConfirm={() => handleDelete(record.key)}
                >
                    <Button type="link">删除</Button>
                </Popconfirm>
            </span>
        ),
    },
];

function MenuManagement() {
    const [data, setData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [newMenu, setNewMenu] = useState({
        number: '',
        menuName: '',
        level: '',
        frontName: '',
        visible: true,
        order: 0,
    });
    const [navigationPath, setNavigationPath] = useState([]);  // 添加导航路径状态
    const [editingMenu, setEditingMenu] = useState(null);

    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem('menuData')) || [];
        setData(storedData);
        setNavigationPath([storedData]);  // 初始路径为根菜单
    }, []);

    const handleDelete = (key) => {
        //TODO 商品添加菜单 删除后重现
        const storedData = JSON.parse(localStorage.getItem('menuData')) || [];

        const deleteMenuItem = (data, key) => {
            return data.reduce((result, item) => {
                if (item.key === key) {
                    return result;
                }
                if (item.subMenu) {
                    item.subMenu = deleteMenuItem(item.subMenu, key);
                }
                result.push(item);
                return result;
            }, []);
        };

        const updatedData = deleteMenuItem(storedData, key);
        localStorage.setItem('menuData', JSON.stringify(updatedData));

        const currentData = navigationPath[navigationPath.length - 1];
        console.log("currentData", currentData);
        const updatedCurrentData = deleteMenuItem(currentData, key);
        console.log("updatedCurrentData", updatedCurrentData);
        setData(updatedCurrentData);
        setNavigationPath(prevPath => [...prevPath.slice(0, -1), updatedCurrentData]);
    };

    const handleSearch = () => {
        const storedData = navigationPath[navigationPath.length - 1];
        const filteredData = storedData.filter((item) => {
            return item.menuName.includes(searchText);
        });
        setData(filteredData);
    };

    const handleReset = () => {
        setSearchText('');
        const storedData = navigationPath[navigationPath.length - 1];
        setData(storedData);
    };

    const showAddModal = () => {
        setIsModalVisible(true);
    };

    const handleAdd = () => {
        if (!/^\d+$/.test(newMenu.number)) {
            message.error('编号只能是整数');
            return;
        }
        const storedData = JSON.parse(localStorage.getItem('menuData')) || [];
        const newMenuWithKey = { ...newMenu, key: Date.now().toString(), level: navigationPath.length }; // Assign a unique key and set level
        console.log("navigationPath[navigationPath.length - 1]", navigationPath[navigationPath.length - 1]);
        const currentData = [...navigationPath[navigationPath.length - 1], newMenuWithKey];
        console.log("currentData", currentData);
        //遍历storedData，更新数据
        const update = (data, key) => {
            return data.map(item => {
                if (item.subMenu && item.subMenu[0].key === key) {
                    item.subMenu = currentData;
                }
                return item; // Ensure the updated item is returned
            });
        };
        if (navigationPath.length === 1) {
            // If it's the root menu, update the stored data directly
            localStorage.setItem('menuData', JSON.stringify(currentData));
        }else {
            if(currentData.length!==1){
                //已经有其他菜单
                update(storedData, currentData[0].key);
                localStorage.setItem('menuData', JSON.stringify(storedData));
                setNavigationPath(prevPath => [...prevPath.slice(0, -1), currentData]);
            }else {
                //新增下级菜单
                const lastData = navigationPath[navigationPath.length - 2];
                //通过lastKey寻找对应项
                const addNew = (data, key) => {
                    return data.map(item => {
                        if (item.key === key) {
                            item.subMenu = currentData;
                        }
                        if (item.subMenu){
                            addNew(item.subMenu,key);
                        }
                        return item; // Ensure the updated item is returned
                    });
                };
                addNew(lastData,localStorage.getItem("lastKey"));
                if(navigationPath.length===2){
                    localStorage.setItem('menuData', JSON.stringify(lastData));
                    setData(currentData);
                    setNavigationPath([lastData, currentData]);
                }else {
                    //TODO

                    addNew(storedData,localStorage.getItem("lastKey"));
                    localStorage.setItem('menuData', JSON.stringify(storedData));
                    setNavigationPath(prevPath => [...prevPath.slice(0, -1), currentData]);
                    setData(currentData);
                }

            }

        }
        setData(currentData);
        setIsModalVisible(false);
        setNewMenu({
            number: '',
            menuName: '',
            level: '',
            frontName: '',
            visible: true,
            order: 0,
        });
    };

    const handleSwitchChange = (key, checked) => {
        const storedData = JSON.parse(localStorage.getItem('menuData')) || [];

        const updateVisibility = (data, key, checked) => {
            return data.map(item => {
                if (item.key === key) {
                    return { ...item, visible: checked };
                }
                if (item.subMenu) {
                    item.subMenu = updateVisibility(item.subMenu, key, checked);
                }
                return item;
            });
        };

        const updatedData = updateVisibility(storedData, key, checked);
        localStorage.setItem('menuData', JSON.stringify(updatedData));
        //寻找当前数据
        const currentData = navigationPath[navigationPath.length - 1];
        const updatedCurrentData = updateVisibility(currentData, key, checked);
        setData(updatedCurrentData);
        setNavigationPath(prevPath => [...prevPath.slice(0, -1), updatedCurrentData]);
    };
    // useEffect(() => {
    //     setData(navigationPath[navigationPath.length - 1]);
    // }, [navigationPath]);

    const handleViewSubmenu = (key) => {
        const currentData = navigationPath[navigationPath.length - 1];
        const selectedMenu = currentData.find((item) => item.key === key);

        if (selectedMenu && selectedMenu.subMenu) {
            setData(selectedMenu.subMenu);
            setNavigationPath([...navigationPath, selectedMenu.subMenu]);  // 推入新的路径
            message.info(`查看下级菜单：${key}`);
        } else {
            message.info('没有下级菜单');
            //转入下一级
            setNavigationPath(prevPath => [...prevPath, []]);
            setData([]);  // 清空数据
        }
    };
    // const handleBack = () => {
    //     if (navigationPath.length > 1) {
    //         const newPath = navigationPath.slice(0, -1);
    //         setNavigationPath(newPath);
    //         setData(newPath[newPath.length - 1]);
    //     } else {
    //         message.info('已经是最上级菜单');
    //     }
    // };
    const handleBack = () => {
        setSearchText('');
        if (navigationPath.length > 1) {
            const newPath = navigationPath.slice(0, -1);
            const currentItem = navigationPath[navigationPath.length - 1];
            console.log("currentItem",currentItem);
            let parentItem = newPath[newPath.length - 1];
            if (currentItem.length === 0){
                //TODO 这里需要更新newPath
                const lastKey = localStorage.getItem("lastKey");
                const update = (data, key) => {
                    return data.map(item => {
                        if (item.key===key) {
                            item.subMenu = currentItem;
                        }
                        return item; // Ensure the updated item is returned
                    });
                };
                update(newPath[newPath.length-1],lastKey);
                setNavigationPath(newPath);
                setData(newPath[newPath.length-1]);
                return;
            }
            for (let item of newPath[newPath.length - 1]) {
                // console.log("item",item);
                if (item.subMenu) {
                    for (let subItem of item.subMenu) {
                        if (subItem.key === currentItem[0].key) {
                            console.log("进入");
                            parentItem = item;
                            break;
                        }
                    }
                }
            }

            // 替换 parentItem 的 subMenu 属性为当前的路径项
            parentItem.subMenu = currentItem;

            setNavigationPath(newPath);
            setData(newPath[newPath.length - 1]);
        } else {
            message.info('已经是最上级菜单');
        }
    };


    const handleEdit = (key) => {
        const storedData = JSON.parse(localStorage.getItem('menuData')) || [];

        const findMenuItem = (data, key) => {
            for (let item of data) {
                if (item.key === key) {
                    return item;
                }
                if (item.subMenu) {
                    const result = findMenuItem(item.subMenu, key);
                    if (result) {
                        return result;
                    }
                }
            }
            return null;
        };

        const menuToEdit = findMenuItem(storedData, key);
        setEditingMenu(menuToEdit);
        setIsEditModalVisible(true);
    };


    const handleEditSave = () => {
        if (!/^\d+$/.test(editingMenu.number) || !/^\d+$/.test(editingMenu.level)) {
            message.error('编号和级别只能是整数');
            return;
        }
        const storedData = JSON.parse(localStorage.getItem('menuData')) || [];

        const updateMenuItem = (data, updatedItem) => {
            return data.map(item => {
                if (item.key === updatedItem.key) {
                    return updatedItem;
                }
                if (item.subMenu) {
                    item.subMenu = updateMenuItem(item.subMenu, updatedItem);
                }
                return item;
            });
        };

        const updatedData = updateMenuItem(storedData, editingMenu);
        localStorage.setItem('menuData', JSON.stringify(updatedData));


        const currentData = navigationPath[navigationPath.length - 1];
        const updatedCurrentData = updateMenuItem(currentData, editingMenu);
        setNavigationPath(prevPath => [...prevPath.slice(0, -1), updatedCurrentData]);
        setData(updatedCurrentData);

        setIsEditModalVisible(false);
        setEditingMenu(null);
    };


    const handleEditCancel = () => {
        setIsEditModalVisible(false);
        setEditingMenu(null);
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
                <Button type="primary" style={{ marginRight: 8 }} icon={<PlusOutlined />} onClick={showAddModal}>
                    添加
                </Button>
                {navigationPath.length > 1 && (
                    <Button onClick={handleBack}>返回上一级</Button>
                )}
            </div>
            <Table columns={columns(handleDelete, handleSwitchChange, handleViewSubmenu, handleEdit)} dataSource={data} />
            <Modal
                title="添加菜单"
                visible={isModalVisible}
                onOk={handleAdd}
                onCancel={() => setIsModalVisible(false)}
            >
                <Form layout="vertical">
                    <Form.Item label="编号">
                        <Input
                            value={newMenu.number}
                            onChange={(e) => setNewMenu({ ...newMenu, number: e.target.value })}
                        />
                    </Form.Item>
                    <Form.Item label="菜单名称">
                        <Input
                            value={newMenu.menuName}
                            onChange={(e) => setNewMenu({ ...newMenu, menuName: e.target.value })}
                        />
                    </Form.Item>
                    <Form.Item label="前端名称">
                        <Input
                            value={newMenu.frontName}
                            onChange={(e) => setNewMenu({ ...newMenu, frontName: e.target.value })}
                        />
                    </Form.Item>
                    <Form.Item label="排序">
                        <Input
                            value={newMenu.order}
                            onChange={(e) => setNewMenu({ ...newMenu, order: e.target.value })}
                        />
                    </Form.Item>
                    <Form.Item label="是否显示">
                        <Switch
                            checked={newMenu.visible}
                            onChange={(checked) => setNewMenu({ ...newMenu, visible: checked })}
                        />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="编辑菜单"
                visible={isEditModalVisible}
                onOk={handleEditSave}
                onCancel={handleEditCancel}
            >
                <Form layout="vertical">
                    <Form.Item label="编号">
                        <Input
                            value={editingMenu?.number}
                            onChange={(e) => setEditingMenu({ ...editingMenu, number: e.target.value })}
                        />
                    </Form.Item>
                    <Form.Item label="菜单名称">
                        <Input
                            value={editingMenu?.menuName}
                            onChange={(e) => setEditingMenu({ ...editingMenu, menuName: e.target.value })}
                        />
                    </Form.Item>
                    <Form.Item label="菜单级别">
                        <Input
                            value={navigationPath.length}
                            disabled
                        />
                    </Form.Item>
                    <Form.Item label="前端名称">
                        <Input
                            value={editingMenu?.frontName}
                            onChange={(e) => setEditingMenu({ ...editingMenu, frontName: e.target.value })}
                        />
                    </Form.Item>
                    <Form.Item label="排序">
                        <Input
                            value={editingMenu?.order}
                            onChange={(e) => setEditingMenu({ ...editingMenu, order: e.target.value })}
                        />
                    </Form.Item>
                    <Form.Item label="是否显示">
                        <Switch
                            checked={editingMenu?.visible}
                            onChange={(checked) => setEditingMenu({ ...editingMenu, visible: checked })}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );

}

export default MenuManagement;
