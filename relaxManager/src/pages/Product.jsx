import React, { useState, useEffect } from 'react';
import { Button, Table, Space,Popconfirm, Modal,Comment, InputNumber, Avatar,Tag,Form, Input, message, Select } from 'antd';
import { Header } from '../components';
import request from '../utils/request'
const { TextArea } = Input;
const { Option } = Select;

const Product = () => {
    const [data, setData] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [comments, setComments] = useState([]);
    const [current, setCurrent] = useState({
        _id: '',
        name: '',
        description: '',
        price: 0,
        number: 0,
        tag: '',
        thumb: '',
    })

    const handleChange = (v, name) => {
        setCurrent(prev => ({ ...prev, [name]: v }))
    }

    const handleEdit = (row) => {
        setCurrent({ ...row })
        initProductComment(row._id);
        setModalShow(true)
    }

    const confirmEdit = () => {
        request('product.update', {
            data: JSON.stringify({ ...current })
        }).then(res => {
            if (res.success) {
                message.success('successfully edit')
                setData(data.map(item => {
                    if (item._id == current._id) {
                        item = { ...current }
                    }
                    return item;
                }))
                setModalShow(false)
            }
        }).catch(e => {

        })
    }

    const initProductComment = (id) => {
        request('productComment.init', {
            data: JSON.stringify({ productId: id })
        }).then(res => {
            if (res.success) {
                setComments(res.data);
            }
            console.log('product comment', res)
        })
    }

    const confirmDelete = (id) => {
        request('productComment.delete',{
            data: JSON.stringify({ id })
        }).then(res => {
            if(res.success) {
                const newList = comments.filter(item => item._id != id);
                setComments(newList)
                message.success('successfully delete')
            }
        })
    }

    const columns = [
        {
            title: 'product picture',
            dataIndex: 'thumb',
            key: 'thumb',
            width: 150,
            fixed: 'left',
            render: (record) =>
                <img src={record} width="100" height="100" crossOrigin='Anonymous' alt="" />
        },
        {
            title: 'product name',
            width: 100,
            dataIndex: 'name',
            key: 'name',
            fixed: 'left',
        },
        {
            title: 'number',
            dataIndex: 'number',
            key: '1',
            width: 100
        },
        {
            title: 'price',
            dataIndex: 'price',
            key: '2',
            width: 100
        },
        {
            title: 'type',
            dataIndex: 'tag',
            key: '3',
            width: 150
        },
        {
            title: 'description',
            dataIndex: 'description',
            key: '4',
            width: 300,
        },
        {
            title: 'operation',
            key: 'operation',
            fixed: 'right',
            width: 200,
            render: (row) => {
                return (
                    <Space>
                        <Button type="danger">delete</Button>
                        <Button type="primary" onClick={() => handleEdit(row)}>edit</Button>
                    </Space>
                )
            },
        },
    ];

    const initProduct = () => {
        request('product.init').then(res => {
            if (res.success) {
                setData(res.data)
            }
        })
    }

    useEffect(() => {
        initProduct()
    }, [])

    return (
        <div className="relative m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
            <Header category="Page" title="product list" />
            <div className="absolute overflow-hidden right-[50px] top-[60px]">
                <Button type="primary" >add product</Button>
            </div>
            <Table
                columns={columns}
                dataSource={data}
                scroll={{
                    x: 600,
                }}
            />
            <Modal
                title="edit product"
                centered
                open={modalShow}
                onOk={confirmEdit}
                onCancel={() => setModalShow(false)}
            >
                <div className="flex mb-[10px]">
                    <div className="min-w-[120px]">
                        <span className="text-red-500">*</span>
                        <span>product name</span>
                    </div>
                    <Input max={20} onChange={e => handleChange(e.target.value, 'name')} value={current.name} />
                </div>
                <div className="flex mb-[10px]">
                    <div className="min-w-[120px]">
                        <span className="text-red-500">*</span>
                        <span>retail price</span>
                    </div>
                    <InputNumber onChange={v => handleChange(v, 'price')} style={{ margin: 0 }} value={current.price} />
                </div>
                <div className="flex mb-[10px]">
                    <div className="min-w-[120px]">
                        <span className="text-red-500">*</span>
                        <span>number</span>
                    </div>
                    <InputNumber onChange={v => handleChange(v, 'number')} style={{ margin: 0 }} value={current.number} />
                </div>
                <div className="flex mb-[10px]">
                    <div className="min-w-[120px]">
                        <span className="text-red-500">*</span>
                        <span>type</span>
                    </div>
                    <Select
                        style={{
                            width: 120,
                        }}
                        value={current.tag}
                        onChange={e => handleChange(e, 'tag')}
                    >
                        <Option value="psychological books">psychological books</Option>
                        <Option value="psychological toys">psychological toys</Option>
                        <Option value="psychological videos">psychological videos</Option>
                        <Option value="product donate">product donate</Option>
                    </Select>
                </div>
                <div className="flex mb-[10px]">
                    <div className="min-w-[120px]">
                        <span className="text-red-500">*</span>
                        <span>description</span>
                    </div>
                    <TextArea onChange={e => handleChange(e.target.value, 'description')} value={current.description} />
                </div>
                <div className="rounded-[10px] p-[10px] bg-gray-100 max-h-[350px] overflow-auto">
                    <div className="font-bold">product comment</div>
                    {comments.length > 0 ?
                        comments.map((item, index) => (
                            <div key={index}>
                                <Comment
                                    author={<span className="text-gray-500 font-bold">{item.authorName}</span>}
                                    avatar={<Avatar shape="square" src={item.authorAvatar} />}
                                    content={
                                        <div className="flex justify-between">
                                            <span className="font-bold mr-[20px]">{item.content}</span>
                                            <Popconfirm
                                                title="whether to delete thecomment"
                                                onConfirm={() => confirmDelete(item._id)}
                                                okText="confirm"
                                                cancelText="cancel"
                                            >
                                                <Button size='small' type="danger">delete</Button>
                                            </Popconfirm>
                                        </div>
                                    }
                                    datetime={
                                        <span>{item.createdAt}</span>
                                    }
                                >
                                </Comment>
                            </div>
                        ))
                        : <span className="text-gray-500 font-xs">no comment</span>}
                </div>
            </Modal>
        </div>
    );
};
export default Product;
