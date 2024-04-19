import React from 'react';
import { Empty, Flex } from 'antd';
import CustomCard from './card';

const CardsList = ({ slides, deleteSlideCard }) => {
  return (
      <Flex wrap='wrap' gap='large' justifyContent='flex-start' style={{ padding: '40px', width: '100%', maxHeight: '100%', overflowY: 'auto' }}>
        {slides && slides.length > 0
          ? slides.map(slide => (
            <CustomCard key={slide.id} slide={slide} deleteSlideCard={deleteSlideCard}/>
          ))
          : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        }
      </Flex>
  );
};

export default CardsList;
