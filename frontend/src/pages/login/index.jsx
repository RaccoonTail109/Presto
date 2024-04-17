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

function LoginWrapper (props) {
  const navigate = useNavigate();

  return <Login {...props} navigate={navigate} />;
}

class Login extends React.Component {
  constructor (props) {
    super(props);
    this.onFinish = this.onFinish.bind(this);
    this.onFinishFailed = this.onFinishFailed.bind(this);
  }

  onFinish (values) {
    const { email, password } = values;
    http.post('/admin/auth/login', {
      email,
      password,
    }).then((res) => {
      console.log(res);
      message.success('Login success!');
      localStorage.setItem('token', res.token);
      this.props.navigate('/');
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
              <h1>Welcome Back</h1>
              <Form
                  name="loginForm"
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
                  label="Email"
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your email!',
                    },
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
                  <span>Do not have account?</span>
                  <span><Link to="/register"> Register</Link></span>
              </Form.Item>
              </div>
          </Form>
          </Container>
    );
  }
}

export default LoginWrapper;
