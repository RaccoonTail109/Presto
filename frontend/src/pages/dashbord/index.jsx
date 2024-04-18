import React, { useState } from 'react';
import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme, Button, message, Modal, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import { nanoid } from 'nanoid';
import styled from 'styled-components';

import http from '../../utils/request';
import { getStore, putStore } from '../../utils/store';
import logo from '../../asset/logo.png';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  flex-direction: column;
`;
const Dashboard = () => {
  // Modal
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [title, setTitleValue] = useState('');
  const showModal = () => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setOpen(true);
      });
    });
  };
  const submit = async () => {
    if (!title) {
      message.error('Slide title is required!');
      return
    }
    const store = await getStore();
    // generate random id
    const sildeId = nanoid();
    store[sildeId] = {
      title,
      createTime: (new Date()).toLocaleString(),
      updateTime: (new Date()).toLocaleString(),
      slideContent: [],
    }
    const result = await putStore(store);
    if (result) {
      message.success('Create success!');
    } else {
      message.error('Create failed!');
    }
    // close modal
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
      setTitleValue('');
    }, 1000);
  };
  const closeModel = () => {
    setOpen(false);
  };
  const onTitleChange = (e) => {
    setTitleValue(e.target.value);
  };

  // layout
  const { Header, Content, Sider } = Layout;
  const items2 = [UserOutlined, LaptopOutlined, NotificationOutlined].map((icon, index) => {
    const key = String(index + 1);
    return {
      key: `sub${key}`,
      icon: React.createElement(icon),
      label: `subnav ${key}`,
      children: new Array(4).fill(null).map((_, j) => {
        const subKey = index * 4 + j + 1;
        return {
          key: subKey,
          label: `option${subKey}`,
        };
      }),
    };
  });

  const navigate = useNavigate();
  const goLogout = () => {
    http.post('/admin/auth/logout')
      .then(() => {
        message.success('Logout success!');
        localStorage.removeItem('token');
        navigate('/login');
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  //* ++++++++++++++++++++++++++++++++
  return (
    <Container>
<Layout style={{ width: '100%' }}>
        <Header
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#16202A',
          }}
        >
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <img src={logo} alt="logo" style={{ width: '120px', height: '50px', marginTop: '10px' }} />
            <div>
                <Button onClick= {showModal} type="primary" style={{ marginRight: '20px' }}>+ Create</Button>
                <Button onClick = {goLogout} style={{ marginRight: '10px', border: '1px solid white', background: 'transparent', color: 'white' }}>Logout</Button>
            </div>
        </div>
        </Header>
        <Layout>
          <Sider
            width={200}
            style={{
              background: colorBgContainer,
            }}
          >
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              style={{
                height: '100%',
                borderRight: 0,
              }}
              items={items2}
            />
          </Sider>
          <Layout
            style={{
              padding: '0 24px 24px',
            }}
          >
            <Breadcrumb
              style={{
                margin: '16px 0',
              }}
            >
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>List</Breadcrumb.Item>
              <Breadcrumb.Item>App</Breadcrumb.Item>
            </Breadcrumb>
            <Content
              style={{
                padding: 24,
                margin: 0,
                minHeight: 280,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              Content
            </Content>
          </Layout>
        </Layout>
      </Layout>
      <Modal
        title="CreateSlide"
        open={open}
        onOk={submit}
        confirmLoading={confirmLoading}
        onCancel={closeModel}
      >
        <Input value={title} onChange = {onTitleChange} placeholder='Create your Slide!'></Input>
      </Modal>
    </Container>
  );
};
export default Dashboard;
