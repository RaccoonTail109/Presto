import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Form, Input, message } from 'antd';
import styled from 'styled-components';
import http from '../../utils/request';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  flex-direction: column;
`;

function RegisterWrapper (props) {
  const navigate = useNavigate();

  return <Register {...props} navigate={navigate} />;
}

class Register extends React.Component {
  constructor (props) {
    super(props);
    this.onFinish = this.onFinish.bind(this);
    this.onFinishFailed = this.onFinishFailed.bind(this);
  }

  componentDidMount () {
    document.title = 'Presto';
  }

  componentDidUpdate () {
    document.title = 'Presto';
  }

  onFinish (values) {
    const { email, name, password, checkedpassword } = values;
    if (password !== checkedpassword) {
      message.error('Password and Confirm Password must be the same!');
    }
    http.post('/admin/auth/register', {
      email,
      name,
      password,
    }).then((res) => {
      console.log(res);
      message.success('Register success!');
      localStorage.setItem('token', res.token);
      this.props.navigate('/dashbord');
    }).catch((error) => {
      message.error(error.message);
    });
  }

  onFinishFailed (errorInfo) {
    console.log('Failed:', errorInfo);
  }

  render () {
    return (
                    <Container>
                            <h1>Register Presto</h1>
                            <Form
                                    name="registerForm"
                                    labelCol={{
                                      span: 8,
                                    }}
                                    wrapperCol={{
                                      span: 16,
                                    }}
                                    style={{
                                      width: 650,
                                    }}
                                    initialValues={{
                                      remember: true,
                                    }}
                                    onFinish={this.onFinish}
                                    onFinishFailed={this.onFinishFailed}
                                    autoComplete="off"
                            >
                            <Form.Item
                                    label="Name"
                                    name="name"
                                    rules={[
                                      {
                                        required: true,
                                        message: 'Please input your name!',
                                      },
                                    ]}
                            >
                            <Input placeholder='Please input you name here'/>
                            </Form.Item>

                            <Form.Item
                                    label="Email"
                                    name="email"
                                    rules={[
                                      {
                                        required: true,
                                        message: 'Please input your email!',
                                      },
                                      {
                                        type: 'email',
                                        message: 'Please input a valid email!',
                                      }
                                    ]}
                            >
                            <Input placeholder='Please input your email here'/>
                            </Form.Item>

                            <Form.Item
                                    label="Password"
                                    name="password"
                                    rules={[
                                      {
                                        required: true,
                                        message: 'Please input your password!',
                                      },
                                    ]}
                            >
                            <Input.Password placeholder='Please input your password here' />
                            </Form.Item>

                            <Form.Item
                                    label="Confirm Password"
                                    name="checkedpassword"
                                    rules={[
                                      {
                                        required: true,
                                        message: 'Please confirm your password!',
                                      },
                                    ]}
                            >
                            <Input.Password placeholder='Please input your password here' />
                            </Form.Item>

                            <Form.Item
                                    wrapperCol={{
                                      offset: 8,
                                      span: 16,
                                    }}
                            >
                            <Button style={{ width: 433 }} type="primary" htmlType="submit">
                                    Submit
                            </Button>
                            </Form.Item>
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginLeft: 150 }}>
                            <Form.Item style={{ display: 'flex', justifyContent: 'start', whiteSpace: 'nowrap' }}>
                                    <span><Link to="/">Back Home</Link></span>
                            </Form.Item>
                            <Form.Item style={{ display: 'flex', justifyContent: 'end', whiteSpace: 'nowrap' }}>
                                    <span>Already have account?</span>
                                    <span><Link to="/login"> Login</Link></span>
                            </Form.Item>
                            </div>
                    </Form>
                    </Container>
    );
  }
}

export default RegisterWrapper;
