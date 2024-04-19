import React, { useEffect, useState } from 'react';
import { Layout, Button, message, Modal, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import { nanoid } from 'nanoid';
import styled from 'styled-components';

import http from '../../utils/request';
import { getStore, putStore } from '../../utils/store';
import logo from '../../asset/logo.png';
import CardsList from './cardList';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  flex-direction: column;
`;

const Dashboard = () => {
  useEffect(() => {
    document.title = 'Presto';
  }, [])

  // Modal
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [title, setTitleValue] = useState('');

  // Slide cards
  const [slides, setSlides] = useState([]);

  // Model
  const showModal = () => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setOpen(true);
      });
    });
  };
  // create a new slide, and refresh the slide list
  const submit = async () => {
    if (!title) {
      message.error('Slide title is required!');
      return
    }
    const store = await getStore();
    // generate random id
    const slideId = nanoid();
    const newSlide = {
      title,
      createTime: (new Date()).toLocaleString(),
      updateTime: (new Date()).toLocaleString(),
      slideContent: [],
    }
    store[slideId] = newSlide;
    const result = await putStore(store);
    if (result) {
      message.success('Create success!');
      setSlides(prevSlides => [...prevSlides, { ...newSlide, id: slideId }].sort((a, b) => new Date(b.createTime) - new Date(a.createTime)));
    } else {
      message.error('Create failed!');
    }
    // close modal
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
      setTitleValue('');
    }, 500);
  };
  const closeModel = () => {
    setOpen(false);
  };
  const onTitleChange = (e) => {
    setTitleValue(e.target.value);
  };

  // delete slide and refresh the slide list
  const deleteSlideCard = (slideId) => {
    setSlides(prevSlides => prevSlides.filter(slide => slide.id !== slideId));
  };

  // Get slide
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      const store = await getStore();
      const _slides = Object.keys(store).map(id => ({
        id,
        ...store[id]
      }));
      if (isMounted) {
        setSlides(_slides.sort((a, b) => new Date(b.createTime) - new Date(a.createTime)));
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  console.log('get sildes:', slides);

  // layout
  const { Header } = Layout;

  // logout and navigate
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
  //* ++++++++++++++++++++++++++++++++
  return (
    <Container>
        <Layout style={{ width: '100%' }}>
            <Header style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#16202A',
              padding: '0 50px',
            }}>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <img src={logo} alt="logo" style={{ width: '120px', height: '50px', marginTop: '10px' }} />
                    <div>
                        <Button onClick= {showModal} type="primary" style={{ marginRight: '20px' }}>+ Create</Button>
                        <Button onClick = {goLogout} style={{ marginRight: '10px', border: '1px solid white', background: 'transparent', color: 'white' }}>Logout</Button>
                    </div>
                </div>
            </Header>
            <CardsList slides={slides} deleteSlideCard={deleteSlideCard} />
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
