import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Avatar, Tooltip, message, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

import { deleteSlide } from '../../utils/store';

const CustomCard = ({ slide, deleteSlideCard }) => {
  const { Meta } = Card;
  const navigate = useNavigate();

  const handleEditClick = () => {
    navigate(`/edit/${slide.id}`);
  }

  const handleDeleteClick = async () => {
    try {
      const result = await deleteSlide(slide.id);
      if (Object.keys(result).length === 0) {
        message.success('Delete success!');
        deleteSlideCard(slide.id);
      } else {
        message.error('Delete failed!');
      }
    } catch (error) {
      message.error('Delete failed!');
    }
  }
  return (
      <Card
        style={{
          width: 300,
        }}
        cover={
          <img
            alt="example"
            src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
          />
        }
        actions={[
          <Tooltip key="edit" title="Edit"> <EditOutlined onClick={handleEditClick}/></Tooltip>,
          <Popconfirm
          key="delete"
          title="DELETE"
          description="Sure to delete this slide?"
          onConfirm={handleDeleteClick}
          okText="Yes"
          cancelText="No"
        >
          <Tooltip title="Delete">
            <DeleteOutlined />
          </Tooltip>
        </Popconfirm>,
        ]}
      >
        <Meta
          avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />}
          title={slide.title}
          description={slide.updateTime}
        />
      </Card>
  );
};

export default CustomCard;
