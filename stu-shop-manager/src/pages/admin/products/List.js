import React from 'react'
import { Card,Table,Button,Popconfirm} from "antd";
const dataSource = [
    {
        id: 1,
        name: '商品1',
        price: 100,
        stock: 10,
    },
    {
        id: 2,
        name: '商品2',
        price: 200,
        stock: 20,
    },
    {
        id: 3,
        name: '商品3',
        price: 300,
        stock: 30,
    },
    {
        id: 4,
        name: '商品4',
        price: 400,
        stock: 40,
    },
    {
        id: 5,
        name: '商品5',
        price: 500,
        stock: 50,
    },
    {
        id: 6,
        name: '商品6',
        price: 600,
        stock: 60,
    },
    {
        id: 7,
        name: '商品7',
        price: 700,
        stock: 70,
    },
    {
        id: 8,
        name: '商品8',
        price: 800,
        stock: 80,
    },
    {
        id: 9,
        name: '商品9',
        price: 900,
        stock: 90,
    },
    {
        id: 10,
        name: '商品10',
        price: 1000,
        stock: 100,
    },
];
function List() {
    const columns = [{
        title: '序号',
        key: 'id',
        width: 80,
        align: 'center',
        render: (text, record, index) => `${index + 1}`,
      },
        {
            title: '名字',
            dataIndex: 'name',
            key: 'name',
            align: 'center',
        },
        {
            title: '价格',
            dataIndex: 'price',
            key: 'price',
            align: 'center',
        },
        {
            title: '库存',
            dataIndex: 'stock',
            key: 'stock',
            align: 'center',
        },
        {
            title: '操作',
            key: 'action',
            align: 'center',
            render: (text, record) => (
            <span>
                <Button type="primary" size="small">修改</Button>
                <Popconfirm title={`确定删除${record.name}吗？`} onConfirm={() => {
                    console.log('删除');
                    // 此处应该调用删除接口
                }}>
                    <Button style={{margin:"0 1rem"}} danger size="small">删除</Button>
                </Popconfirm>

            </span>
            ),
        },
    ];

    return(
        <Card title="商品列表" extra={<Button type="primary" size="small">新增</Button>}>
            <Table columns={columns} bordered dataSource={dataSource}/>
        </Card>
    );
}
export default List