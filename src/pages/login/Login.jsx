import React, { createContext, useContext, useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Image, Form, Input, Typography, Button, message, Checkbox } from 'antd'
import axios from 'axios'
import { TokenContext } from '../../components/TokenProvider';
import "./login.scss";



const Login = () => {

    const { setToken } = useContext(TokenContext);
    const [info, setInfo] = useState(null)

    const navigate = useNavigate()


    const submitValidation = (values) => {

        axios.post(import.meta.env.VITE_SERVER_URL + '/auth/login', values) //link where we POST detail
            .then(res => {
                console.log(res.data)
                message.success("Login Successfully")
                setToken(res.data)
                navigate('/')

            }).catch(error => { message.error(error.response.data.message) })


    }

    return (

        <>

<div className="navbar">
      <div className="logo">
        <img src="logo.svg" alt=""/>
        <span>Nazimabad Portal</span>
      </div>     
    </div>

            <div className='LoginBody'>
                <Form onFinish={submitValidation} className='Form'>

                    <Typography.Title className='Typo'>Login</Typography.Title >
                    <Form.Item rules={[{
                        required: true,
                        type: 'email',
                        message: 'Enter a Valid Email Address'

                    }]} label="Email" name={"email"}>
                        <Input />
                    </Form.Item>

                    <Form.Item rules={[{
                        required: true,
                        message: 'Enter Your Password'

                    }]} label="Password" name={"password"}>
                        <Input.Password />
                    </Form.Item>



                    <div className="remember">
                        <Form.Item
                            name="remember"
                            valuePropName="checked"
                            className="custom-checkbox"

                        >
                        <Checkbox>Remember me</Checkbox>
                        </Form.Item>

                        <Link to="/forgotPwd" >
                            {" "}
                            Forgot Your Password?{" "}
                        </Link>
                    </div>


                    <Button type="default" htmlType="submit" block className="custom-button">Login</Button>

                </Form>
            </div>
        </>

    )


}

export default Login;
