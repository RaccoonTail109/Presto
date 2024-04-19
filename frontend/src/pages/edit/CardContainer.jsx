import React from 'react';
import { PlusCircleOutlined } from '@ant-design/icons';
import { CardSlideContainer, CardButtons, CardButton, IndexLabel } from './StyledComponents';

const CardContainer = (props) => {
  const { active, index = 0, children, onClick, backgroundColor, addSlide } = props;
  return (
    <CardSlideContainer active={active} onClick={onClick} style={{ backgroundColor }}>
      <IndexLabel active={active}>{index + 1}</IndexLabel>
      {children}
      <CardButtons active={active}>
        <CardButton>
          <PlusCircleOutlined onClick={() => addSlide(index)} style={{ fontSize: '20px', color: 'white' }} />
        </CardButton>
      </CardButtons>
    </CardSlideContainer>
  );
};

export default CardContainer;
