import React, { useState, useEffect } from 'react';
import { Button, Table, Space, Modal, Popconfirm,InputNumber, Form, Input, message, Select } from 'antd';
import { Header } from '../components';
import request from '../utils/request'
const { TextArea } = Input;
const { Option } = Select;

const Article = () => {
    const [data, setData] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [current, setCurrent] = useState({
        _id: '',
        title: '',
        content: '',
        praise: 0,
        topic: '',
        thumb: '',
    })

    const handleChange = (v, name) => {
        setCurrent(prev => ({ ...prev, [name]: v }))
    }

    const confirmDelete = (id) => {
        request('article.delete',{
            data: JSON.stringify({ id })
        }).then(res => {
            if(res.success) {
                const newList = data.filter(item => item._id != id);
                setData(newList)
                message.success('delete successfully')
            }
        })
    }


    const handleEdit = (row) => {
        setCurrent({ ...row })
        setModalShow(true)
    }

    const confirmEdit = () => {
        request('Article.update', {
            data: JSON.stringify({ ...current })
        }).then(res => {
            if (res.success) {
                message.success('edit successfully')
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

    const columns = [
        {
            title: 'article theme',
            dataIndex: 'thumb',
            key: 'thumb',
            width: 150,
            fixed: 'left',
            render: (record) => (
                record ? <img src={record} width="100" height="100" crossOrigin='Anonymous' alt="" /> : <span>未设置</span>
            )

        },
        {
            title: 'title',
            width: 100,
            dataIndex: 'title',
            key: 'name',
            fixed: 'left',
        },
        {
            title: 'praise',
            dataIndex: 'praise',
            key: '1',
            width: 100
        },
        {
            title: 'topic',
            dataIndex: 'topic',
            key: '3',
            width: 150
        },
        {
            title: 'content',
            dataIndex: 'content',
            key: '4',
            width: 400,
            render: (row) => {
                return (
                    <div className="max-h-[200px] overflow-hidden" dangerouslySetInnerHTML={{ __html: row }}></div>
                )
            },
        },
        {
            title: 'operation',
            key: 'operation',
            fixed: 'right',
            width: 200,
            render: (row) => {
                return (
                    <Space>
                        <Popconfirm
                            title="delete this article or not"
                            onConfirm={() => confirmDelete(row._id)}
                            okText="confirm"
                            cancelText="cancle"
                        >
                            <Button type="danger">delete</Button>
                        </Popconfirm>
                        <Button type="primary" disabled onClick={() => handleEdit(row)}>edit</Button>
                    </Space>
                )
            },
        },
    ];

    const initArticle = () => {
        request('article.init').then(res => {
            if (res.success) {
                setData(res.data)
                console.log('article', res)
            }
        })
    }

    useEffect(() => {
        initArticle()
    }, [])

    return (
        <div className="relative m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
            <Header category="Page" title="article list" />
            <Table
                columns={columns}
                dataSource={data}
                scroll={{
                    x: 600,
                }}
            />
            {/* <Modal
                title="商品查看"
                centered
                open={modalShow}
                onOk={confirmEdit}
                onCancel={() => setModalShow(false)}
            >
                <div className="flex mb-[10px]">
                    <div className="min-w-[120px]">
                        <span className="text-red-500">*</span>
                        <span>商品名称</span>
                    </div>
                    <Input max={20} onChange={e => handleChange(e.target.value,'name')} value={current.name}/>
                </div>
                <div className="flex mb-[10px]">
                    <div className="min-w-[120px]">
                        <span className="text-red-500">*</span>
                        <span>零售价</span>
                    </div>
                    <InputNumber onChange={v => handleChange(v,'price')} style={{margin: 0}} value={current.price}/>
                </div>
                <div className="flex mb-[10px]">
                    <div className="min-w-[120px]">
                        <span className="text-red-500">*</span>
                        <span>库存</span>
                    </div>
                    <InputNumber onChange={v => handleChange(v,'number')} style={{margin: 0}} value={current.number}/>
                </div>
                <div className="flex  mb-[10px]">
                    <div className="min-w-[120px]">
                        <span className="text-red-500">*</span>
                        <span>类型</span>
                    </div>
                    <Select
                        style={{
                            width: 120,
                        }}
                        value={current.tag}
                        onChange={e => handleChange(e,'tag')}
                    >
                        <Option value="心理书籍">心理书籍</Option>
                        <Option value="心理玩具">心理玩具</Option>
                        <Option value="心理视频">心理视频</Option>
                    </Select>
                </div>
                <div className="flex  mb-[10px]">
                    <div className="min-w-[120px]">
                        <span className="text-red-500">*</span>
                        <span>描述</span>
                    </div>
                    <TextArea onChange={e => handleChange(e.target.value,'description')} value={current.description}/>
                </div>
            </Modal> */}
        </div>
    );
};
export default Article;
