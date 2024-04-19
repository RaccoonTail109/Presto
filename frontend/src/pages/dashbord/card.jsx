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
          width: 270,
        }}
        cover={
          <div style={{ backgroundColor: '#666666', height: 200 }}></div>
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
          description={
            <div>
              {slide.updateTime}
              <div>Total {slide.slideContent.length} Page(s)</div>
            </div>
          }
        />
      </Card>
  );
};

export default CustomCard;
