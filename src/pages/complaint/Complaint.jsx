import React, { useContext, useEffect, useState } from 'react';
import { Table, Pagination, Spin,  Avatar, Rate, Space, Button, Modal, Form, Input, Select,  } from 'antd';
import axios from 'axios';
import { TokenContext } from '../../components/TokenProvider';
import './complaint.scss';
import { format } from 'date-fns';

const Complaint = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const { token } = useContext(TokenContext);
  
  

  //
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);
  const [form] = Form.useForm();

  // Function to open the modal and load the current row data into the form
  const showModal = (record) => {
    setCurrentRow(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  // Function to handle the modal submission
  const handleOk = async () => {
    try {
      const values = form.getFieldsValue();
   
      setLoading(true);

      // Make the PUT request to update the data on the server
      await axios.put(`${import.meta.env.VITE_SERVER_URL}/user/complaint/${currentRow.id}`, values, {
        headers:{
          'Content-Type': 'application/json',            
          'Authorization' : `Bearer ${token}`
        }
      });
    
      // Update the data in the table
      setData((prevData) =>
        prevData.map((item) => {       
          return (item.id === currentRow.id ? { ...item, ...values } : item)
    })
      );

      setIsModalVisible(false);
      setLoading(false);     
    } catch (error) {
      console.error("Failed to update data", error);
      setLoading(false);
   
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  //
  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const fetchData = async (page) => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/user/complaint?page=${page}&limit=10`, {
        headers:{
          'Content-Type': 'applicaion/json',            
          'Authorization' : `Bearer ${token}`
        }
      });
      console.log(response.data)
      setData(response.data.items);
      setTotalItems(response.data.total);

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'imgUrl',
      key: 'imgUrl',
      render: (text) => <img src={text} alt="complaint" style={{ width: 50 }} />,
    },
    {
      title: 'Name',
      dataIndex: 'fullName',
      width: '10%',
      key: 'fullName',
    },
     {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Complaint',
      dataIndex: 'complaint',    
      key: 'complaint',
      filters: [
        {
          text: 'water',
          value: 'water',
        },
        {
          text: 'electricity',
          value: 'electricity',
        },
        {
            text: 'gas',
            value: 'gas',
          },
        {
            text: 'road',
            value: 'road',
          },
          {
            text: 'sewerage',
            value: 'sewerage',
          },
          {
            text: 'others',
            value: 'others',
          },


      ],
      onFilter: (value, record) =>record.complaint.startsWith(value),
      filterSearch: true,
      width: '5%',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      width: '10%',
      key: 'description',
    },
    {
      title: 'Status',
      dataIndex: 'complaintStatus',
      key: 'status',
      filters: [
   
        {
            text: 'pending',
            value: 'pending',
          },
        {
            text: 'progress',
            value: 'progress',
          },
          {
            text: 'resolved',
            value: 'resolved',
          },
       
      ],
      onFilter: (value, record) => record.complaintStatus.startsWith(value),
      filterSearch: true,
   
    },
    {
      title: 'Report Time',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (created_at) => format(new Date(created_at), 'yyyy-MM-dd HH:mm:ss'),
      width: '20%',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button type="link" onClick={() => showModal(record)}>
          Edit
        </Button>
      ),
    },
   
  
  ];

  return (
    
       
        <Space size={30} direction="vertical">
      
      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={data}
          pagination={{
            current: currentPage,
            total: totalItems,
            pageSize: 10,
            showSizeChanger: false,
          }}
          onChange={handleTableChange}
        //   scroll={{
        //     y: 500,
        //   }}
          rowKey="id"
        />
      </Spin>


        <Modal title="Edit Row" open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Form form={form} layout="vertical">
          <Form.Item name="complaintStatus" label="Status" rules={[{message: 'Please Enter Updated Status' }]}>
          <Select placeholder="Select Status">
                        <Option value="pending">Pending</Option>
                        <Option value="progress">Progress</Option>
                        <Option value="resolved">Resolved</Option>                
                    </Select>
          </Form.Item>
      
        </Form>
      </Modal>  
      </Space>
    
  );
};

export default Complaint;
