
import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Image, Form, Input, Typography, Button, message, Checkbox, Select , Upload} from 'antd'
import axios from 'axios'
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { TokenContext } from '../../components/TokenProvider';




const { TextArea } = Input;
const { Option } = Select;

const TestResidence = () => {

    const { token } = useContext(TokenContext);
    console.log(token)
    const [info, setInfo] = useState(null)
    
    const navigate = useNavigate()

    const [file, setFile] = useState(null);


    const handleFileChange = ({ file }) => {
        
      if (file.status === 'uploading') message.loading('File is Loading....');      
           
      //its not working
      if (file.status === 'done') {
          console.log(file, 'file in handler')
          setFile(()=>file.originFileObj);
        }
    };


    const normFile = (e) => {
        if (Array.isArray(e)) {
          return e;
        }
        return e?.fileList;
      };
      
      const beforeUpload = (file) => {
     
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/gif';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
            return Upload.LIST_IGNORE;
     
          
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
            return Upload.LIST_IGNORE;
            
        }
        return isJpgOrPng && isLt2M;
      };
    

    const submitValidation = (values) => {
       
        console.log(values)
        const formData = new FormData();

        formData.append('myFile', values.myFile ? values.myFile[0].originFileObj : null);
        formData.append('description', values.description);
        formData.append('complaint', values.complaint)

        const formDataArray = Array.from(formData.entries());
        console.log("FormData with Appended Data:", formDataArray);
      

        axios.post(import.meta.env.VITE_SERVER_URL + '/user/complaint', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',            
               'Authorization' : `Bearer ${token}`     
            },}) 
            .then(res => {
                console.log(res.data)
                message.success(res.data)
                navigate('/')

            }).catch(error => { message.error(error.response.data.message) })


    }

    return (        <>


            <Form onFinish={submitValidation}>

                <Typography.Title>Residence Complaints Form</Typography.Title>
                <Form.Item
                    name="complaint"
                    label="Complaint"
                    rules={[{ required: true, message: 'Please Select Category!' }]}
                >
                    <Select placeholder="Select a category">
                        <Option value="water">Water</Option>
                        <Option value="electricity">Electricity</Option>
                        <Option value="gas">Gas</Option>
                        <Option value="road">Road</Option>
                        <Option value="sewerage">Sewerage</Option>
                        <Option value="others">Others</Option>
                    </Select>
                </Form.Item>

                <Form.Item rules={[{
                    message: 'Enter Description Here'

                }]} label="Description" name={"description"}>

                    <TextArea rows={4} placeholder="Describe Your Complaint Here" maxLength={500} />
                </Form.Item>

        <Form.Item label="Image Upload" name='myFile' valuePropName="fileList" getValueFromEvent={normFile}>
          <Upload beforeUpload={beforeUpload} listType="picture-card" onChange={handleFileChange} maxCount={1} >
            <button
              style={{
                border: 0,
                background: 'none',
              }}
              type="button"
            >
              <PlusOutlined />
              <div
                style={{
                  marginTop: 8,
                }}
              >
                Upload
              </div>
            </button>
          </Upload>
        </Form.Item>

                <Button type="primary" htmlType="submit" block>Submit</Button>

            </Form>
        </>

    )


}

export default TestResidence;

