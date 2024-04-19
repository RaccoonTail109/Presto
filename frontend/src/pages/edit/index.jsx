import React, { useEffect, useState } from 'react';
import { Layout, Button, Tooltip, message, Modal, Input } from 'antd';
import { LeftSquareOutlined, PlusCircleOutlined, VerticalRightOutlined, VerticalLeftOutlined, RollbackOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { getStore, getSlideDetails, putStore } from '../../utils/store';

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
  flex-direction: row;
  gap: 20px;
  ${props => props.isFullScreen && `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;
    background-color: #F5F5F5;
  `}
`;

const ASlide = styled.div`
    display: flex;
    background-color: #fff;
    width: 70%;
    height: 85%;    
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
    cursor: pointer;
`;
const CardButtons = styled.div`
  position: absolute;
  bottom: -20px;
  left: 40%;
  display: ${props => props.active ? 'flex' : 'none'};
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

const FullScreenHeader = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10000;
`;

const CardContainer = (props) => {
  const { active, index = 0, children, onClick } = props;
  return (
      <CardSlideContainer active={active} onClick={onClick}>
        <IndexLabel active={active}>{index + 1}</IndexLabel>
        {children}
        <CardButtons active={active}>
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
    inEdit: false,
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
    inEdit: false,
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

const DafaultSlideCard = ({ ChangeCard, preview, ...slideContent }) => {
  const [title, setTitle] = useState(slideContent.title || DafaultSlideContent.title);
  const [subtitle, setSubTitle] = useState(slideContent.subtitle || DafaultSlideContent.subtitle);

  useEffect(() => {
    setTitle(slideContent.title);
    setSubTitle(slideContent.subtitle);
  }, [slideContent.title, slideContent.subtitle])
  const TitlegotoEdit = () => {
    setTitle({ ...title, inEdit: true });
  }
  const SubTitlegotoEdit = () => {
    setSubTitle({ ...subtitle, inEdit: true });
  }
  const ExitTitleEdit = () => {
    setTitle({ ...title, inEdit: false });
  }
  const ExitSubtitleEdit = () => {
    setSubTitle({ ...subtitle, inEdit: false });
  }
  const ChangeTitle = (e) => {
    const newTitle = { ...title, text: e.target.value };
    setTitle({ ...title, text: e.target.value });
    ChangeCard({ title: newTitle });
  }
  const ChangeSubtitle = (e) => {
    const newSubtitle = { ...subtitle, text: e.target.value };
    setSubTitle({ ...subtitle, text: e.target.value });
    ChangeCard({ subtitle: newSubtitle });
  }
  return (
    <SlideContentContainer style = {{ transform: preview ? 'scale(0.21)' : 'scale(1)' }}>
      {!preview && title.inEdit
        ? <input value = {title.text} style={title.style} placeholder='Input Title' onChange = {ChangeTitle} onBlur = {ExitTitleEdit} type="text" />
        : <h1 style={title.style} onClick={TitlegotoEdit}>{title.text}</h1>}
      {!preview && subtitle.inEdit
        ? <input value = {subtitle.text} style={subtitle.style} placeholder='Input Subtitle' onChange = {ChangeSubtitle} onBlur = {ExitSubtitleEdit} type="text" />
        : <h2 style={subtitle.style} onClick={SubTitlegotoEdit}> {subtitle.text}</h2>}
    </SlideContentContainer>
  );
}
const templateCardMap = {
  1: DafaultSlideCard,
}
function generateSlideContent (props) {
  const { templateId, currentSlide, ...slideContent } = props;
  const Content = templateCardMap[templateId];
  return <Content {...slideContent.slideContent[currentSlide]} preview={true} />;
}

function generateActiveSlideContent (props) {
  if (!props || !props.templateId) {
    return <div>Please select a slide</div>;
  }
  const { templateId, ChangeCard, ...slideContent } = props;
  const Content = templateCardMap[templateId];
  return <Content {...slideContent} ChangeCard={ChangeCard}/>;
}

const EditPage = () => {
  const { Header } = Layout;
  const [slide, setSlideId] = useState({ slideContent: [] });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [isFullScreen, setIsFullScreen] = useState(false);
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
  const ChangeCard = (slideContent) => {
    setSlideId(prevSlide => ({
      ...prevSlide,
      slideContent: prevSlide.slideContent.map((content, index) => {
        if (index === currentSlide) {
          return {
            ...content,
            ...slideContent,
          };
        }
        return content;
      }),
    }));
  };
  const saveSlide = async () => {
    const curSlide = slide;
    const store = await getStore();
    store[params.id] = curSlide;
    putStore(store)
      .then((result) => {
        message.success('Saved Successfully');
      })
      .catch(() => {
        message.error('Failed to save slide');
      });
  }

  const deleteSlide = async () => {
    if (slide.slideContent.length === 1) {
      message.warning('Cannot delete the last slide');
      return;
    }

    const newSlideContent = slide.slideContent.filter((_, index) => index !== currentSlide);
    const newSlide = {
      ...slide,
      slideContent: newSlideContent,
    };

    try {
      const store = await getStore();
      store[params.id] = newSlide;
      await putStore(store);
      message.success('Delete Successfully');
      setSlideId(newSlide);
      setCurrentSlide(Math.max(currentSlide - 1, 0));
    } catch (error) {
      message.error('Delete Failed');
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
    setEditedTitle(slide?.title || '');
  };

  const handleOk = async () => {
    setSlideId(prevSlide => ({
      ...prevSlide,
      title: editedTitle,
    }));
    try {
      const store = await getStore();
      store[params.id] = {
        ...store[params.id],
        title: editedTitle,
      };
      await putStore(store);
      message.success('Title Updated Successfully');
    } catch (error) {
      message.error('Failed to Update Title');
    }
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const toPrevious = () => {
    setCurrentSlide(currentSlide - 1);
  }
  const toNext = () => {
    setCurrentSlide(currentSlide + 1);
  }

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

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
                            <Button onClick = {goDashboard} icon={<LeftSquareOutlined style={{ color: 'white', fontSize: '150%' }} />} type="dashed" style={{ marginRight: '20px', backgroundColor: 'transparent', border: 'transparent', padding: 0, marginLeft: '10px', marginTop: '7px' }}/>
                        </Tooltip>
                        <SlideTitle>{slide?.title || '--'}</SlideTitle>
                        <Tooltip title = "Edit the Title">
                            <Button type="dashed" onClick={showModal} style={{ background: 'transparent', color: 'white', marginLeft: '10px' }}>Edit</Button>
                        </Tooltip>
                    </BackTitleContainer>
                    <div>
                        <Tooltip title="Preview the Slide">
                        <Button onClick={toggleFullScreen} type="dashed" style={{ marginRight: '20px', background: 'transparent', color: 'white' }}>Preview</Button>
                        </Tooltip>
                        <Tooltip title="Save Current Slide">
                        <Button onClick={saveSlide} style={{ marginRight: '20px', background: 'transparent', color: 'white' }}> Save </Button>
                        </Tooltip>
                        <Tooltip title="Delete Current Slide">
                        <Button type="primary" onClick = {deleteSlide} style={{ marginRight: '20px' }}>Delete</Button>
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
                      ...slide,
                      currentSlide: index,
                      key: index,
                    })}
                    </CardContainer>
                  );
                })}
                </LeftOutline>
                <RightContent isFullScreen={isFullScreen}>
                {isFullScreen && (
                    <FullScreenHeader>
                    <Tooltip title="Exit Preview">
                        <Button
                        icon={<RollbackOutlined />}
                        onClick={toggleFullScreen}
                        />
                    </Tooltip>
                    </FullScreenHeader>
                )}
                {currentSlide !== 0 && (
                    <Button
                    icon={<VerticalRightOutlined onClick={toPrevious} style={{ fontSize: '200%' }} />}
                    type="text"
                    style={{ backgroundColor: 'transparent', border: 'transparent', padding: 0 }}
                    />
                )}
                    <ASlide>
                        {slide && slide.slideContent[currentSlide] && generateActiveSlideContent({ ...slide.slideContent[currentSlide], key: currentSlide, ChangeCard })}
                    </ASlide>
                {currentSlide !== slide.slideContent.length - 1 && (
                    <Button
                    icon={<VerticalLeftOutlined onClick={toNext} style={{ fontSize: '200%' }} />}
                    type="text"
                    style={{ backgroundColor: 'transparent', border: 'transparent', padding: 0 }}
                    />
                )}
                </RightContent>
            </MainContainer>
      </Layout>
            <Modal
                title="Edit Title"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                >
                <Input
                    value={editedTitle}
                    onChange={e => setEditedTitle(e.target.value)}
                    placeholder="Enter slide title"
                />
        </Modal>
    </Container>
  );
};

export default EditPage;
