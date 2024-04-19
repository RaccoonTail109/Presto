import React, { useEffect, useState } from 'react';
import { Layout, Button, Tooltip } from 'antd';
import { LeftSquareOutlined, PlayCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { getStore, getSlideDetails } from '../../utils/store';

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    flex-direction: column;
`;

const BackTitleContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const SlideTitle = styled.h1`
    color: white;
    font-size: 32px;
    font-family: 'Roboto', sans-serif;
`;

const MainContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    background-color: #F5F5F5;
    overflow: hidden;
`;
const LeftOutline = styled.div`
    width: 250px;
    max-height: 100%;
    overflow-y: auto;
    border-right: 1px solid #C4C4C4;
    align-items: center;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const RightContent = styled.div`
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
`;

const ASlide = styled.div`
    display: flex;
    background-color: #fff;
    width: 70%;
    height: 80%;    
`;

const SlideContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
`;
const CardSlideContainer = styled.div`
    position: relative;
    background-color: 'white';
    border-radius: 10px;
    width: 90%;
    height: 100px;
    border: ${props => props.active ? '2px solid #a0d911' : '1px solid #C4C4C4'};
`;
const CardButtons = styled.div`
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  display: ${props => props.active ? 'flex' : 'none'};
  justify-content: space-between;
  width: 80px;
`;
const CardButton = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #a0d911;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;
const IndexLabel = styled.label`
position: absolute;
color: ${props => props.active ? '#a0d911' : 'black'};
font-size: 15px;
top:0;
left:-15px;
`;
const CardContainer = (props) => {
  const { active, index = 0, children, onClick } = props;
  return (
      <CardSlideContainer active={active} onClick={onClick}>
        <IndexLabel active={active}>{index + 1}</IndexLabel>
        {children}
        <CardButtons active={active}>
          <CardButton>
          <PlayCircleOutlined style={{ fontSize: '20px', color: 'white' }} />
            </CardButton>
          <CardButton>
          <PlusCircleOutlined style={{ fontSize: '20px', color: 'white' }} />
            </CardButton>
        </CardButtons>
      </CardSlideContainer>
  );
};

const DafaultSlideContent = {
  templateId: 1,
  title: {
    text: 'Add a heading',
    style: {
      margin: 0,
      marginBottom: 30,
      width: '40vw',
      height: '150px',
      lineHeight: '150px',
      fontSize: 40,
      fontWeight: 'bold',
      textAlign: 'center',
      border: '1px dashed #C4C4C4',
    }
  },
  subtitle: {
    text: 'Add a subheading',
    style: {
      margin: 0,
      width: '30vw',
      height: '70px',
      lineHeight: '70px',
      fontSize: 20,
      textAlign: 'center',
      border: '1px dashed #C4C4C4',
    }
  }
}

const DafaultSlideCard = ({ thubmnail, ...slideContent }) => {
  const [title, setTitle] = useState(slideContent.title || DafaultSlideContent.title);
  const [subtitle, setSubTitle] = useState(slideContent.subtitle || DafaultSlideContent.subtitle);
  console.log(setTitle, setSubTitle)
  return (
    <SlideContentContainer style = {{ transform: thubmnail ? 'scale(0.2)' : 'scale(1)' }}>
      <h1 style={title.style}>{title.text}</h1>
      <h2 style={subtitle.style}>{subtitle.text}</h2>
    </SlideContentContainer>
  );
}
const templateCardMap = {
  1: DafaultSlideCard,
}
function generateSlideContent (props) {
  const { templateId, ...slideContent } = props;
  const Content = templateCardMap[templateId];
  return <Content {...slideContent} thubmnail={true} />;
}

function generateActiveSlideContent (props) {
  if (!props || !props.templateId) {
    return <div>Please select a slide</div>;
  }
  const { templateId, ...slideContent } = props;
  const Content = templateCardMap[templateId];
  return <Content {...slideContent} />;
}

const EditPage = () => {
  const { Header } = Layout;
  const [slide, setSlideId] = useState();
  const [currentSlide, setCurrentSlide] = useState(0);
  const handleClick = (index) => {
    setCurrentSlide(index);
  };
  const params = useParams();
  const navigate = useNavigate();
  const goDashboard = () => {
    navigate('/dashboard');
  }

  async function getSlide (id) {
    const _slide = await getSlideDetails(id);
    // console.log('_slide:', _slide);
    setSlideId(_slide.slideContent?.length > 0
      ? _slide
      : {
          ..._slide,
          slideContent: [DafaultSlideContent]
        });
  }
  const saveSlide = async () => {
    const store = await getStore();
    store[params.id] = slide;
  }
  useEffect(() => {
    if (!params.id) return;
    getSlide(params.id);
  }, [params.id]);
  useEffect(() => {
    document.title = 'Presto';
  }, [])
  //   console.log('slide.slideContent:', slide?.slideContent);
  return (
    <Container>
        <Layout style={{ width: '100%' }}>
            <Header style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#16202A',
              padding: '0 20px',
            }}>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <BackTitleContainer>
                        <Tooltip title="Back">
                            <Button onClick = {goDashboard}icon={<LeftSquareOutlined style={{ color: 'white', fontSize: '150%' }} />} type="dashed" style={{ marginRight: '20px', backgroundColor: 'transparent', border: 'transparent', padding: 0, marginLeft: '10px', marginTop: '7px' }}/>
                        </Tooltip>
                        <SlideTitle>{slide?.title || '--'}</SlideTitle>
                    </BackTitleContainer>
                    <div>
                        <Tooltip title="Save">
                        <Button type="dashed" onClick={saveSlide} style={{ marginRight: '20px', background: 'transparent', color: 'white' }}>Save</Button>
                        </Tooltip>
                        <Tooltip title="Delete">
                        <Button type="primary" style={{ marginRight: '20px' }}>Delete</Button>
                        </Tooltip>
                    </div>
                </div>
            </Header>
            <MainContainer>
                <LeftOutline>
                {slide?.slideContent?.map((slideContent, index) => {
                  return (
                    <CardContainer
                    key={index}
                    active={index === currentSlide}
                    index={index}
                    onClick={() => handleClick(index)}
                  >
                    {generateSlideContent({
                      templateId: slideContent.templateId,
                      ...slideContent,
                      key: index,
                    })}
                  </CardContainer>
                  );
                })}

                </LeftOutline>
                <RightContent>
                    <ASlide>
                        {slide && slide.slideContent[currentSlide] && generateActiveSlideContent({ ...slide.slideContent[currentSlide], key: currentSlide })}
                    </ASlide>
                </RightContent>
            </MainContainer>
      </Layout>
    </Container>
  );
};

export default EditPage;
