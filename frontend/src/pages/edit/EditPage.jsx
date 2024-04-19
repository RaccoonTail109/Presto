import React, { useEffect, useState } from 'react';
import { Layout, Button, Tooltip, message, Modal, Input, Drawer, InputNumber, ColorPicker, Select } from 'antd';
import { LeftSquareOutlined, RollbackOutlined, VerticalRightOutlined, VerticalLeftOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { getStore, getSlideDetails, putStore } from '../../utils/store';
import { Container, BackTitleContainer, SlideTitle, MainContainer, LeftOutline, RightContent, ASlide, FullScreenHeader } from './StyledComponents';
import CardContainer from './CardContainer';
import DafaultSlideCard, { DafaultSlideContent } from './DafaultSlideCard';

const templateCardMap = {
  1: DafaultSlideCard,
};

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
  return <Content {...slideContent} ChangeCard={ChangeCard} backgroundColor={slideContent.backgroundColor} />;
}

const EditPage = () => {
  // Solve the header component from layout
  const { Header } = Layout;

  // Define various state variables using useState
  const [slide, setSlideId] = useState({ slideContent: [] });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [titleFontSize, setTitleFontSize] = useState(
    slide.slideContent[currentSlide]?.title?.style?.fontSize || DafaultSlideContent.title.style.fontSize
  );
  const [subtitleFontSize, setSubtitleFontSize] = useState(
    slide.slideContent[currentSlide]?.subtitle?.style?.fontSize || DafaultSlideContent.subtitle.style.fontSize
  );
  const [hasTitleAndSubtitle, setHasTitleAndSubtitle] = useState(false);
  const [selectedColor, setSelectedColor] = useState(slide.slideContent[currentSlide]?.backgroundColor || '#ffffff');
  const [titleFontFamily, setTitleFontFamily] = useState(
    slide.slideContent[currentSlide]?.title?.style?.fontFamily || DafaultSlideContent.title.style.fontFamily
  );
  const [subtitleFontFamily, setSubtitleFontFamily] = useState(
    slide.slideContent[currentSlide]?.subtitle?.style?.fontFamily || DafaultSlideContent.subtitle.style.fontFamily
  );
  const [isMounted, setIsMounted] = useState(false);

  // Use USEPARAMS to get routing parameters
  const params = useParams();
  // Use USENAVIGATE to get the navigation object
  const navigate = useNavigate();

  // Use useEffect to perform side effects in function components
  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    document.title = 'Presto';
  }, []);

  useEffect(() => {
    const currentTemplate = slide.slideContent[currentSlide]?.templateId;
    setHasTitleAndSubtitle(currentTemplate === 1);
  }, [slide.slideContent, currentSlide]);

  useEffect(() => {
    if (!params.id) return;
    getSlide(params.id).then((slide) => {
      if (isMounted) {
        setSlideId(slide);
      }
    });
  }, [params.id, isMounted]);

  useEffect(() => {
    setTitleFontSize(
      slide.slideContent[currentSlide]?.title?.style?.fontSize || DafaultSlideContent.title.style.fontSize
    );
    setSubtitleFontSize(
      slide.slideContent[currentSlide]?.subtitle?.style?.fontSize || DafaultSlideContent.subtitle.style.fontSize
    );
  }, [slide.slideContent, currentSlide]);

  //* +++++++++
  const handleClick = (index) => {
    setCurrentSlide(index);
  };

  const goDashboard = () => {
    navigate('/dashboard');
  };

  async function getSlide (id) {
    const _slide = await getSlideDetails(id);
    return _slide.slideContent?.length > 0
      ? _slide
      : {
          ..._slide,
          slideContent: [DafaultSlideContent],
        };
  }

  const ChangeCard = (slideContent) => {
    setSlideId((prevSlide) => ({
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
        if (isMounted) {
          message.success('Saved Successfully');
        }
      })
      .catch(() => {
        if (isMounted) {
          message.error('Failed to save slide');
        }
      });
  };

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
      if (isMounted) {
        message.success('Delete Successfully');
        setSlideId(newSlide);
        setCurrentSlide(Math.max(currentSlide - 1, 0));
      }
    } catch (error) {
      if (isMounted) {
        message.error('Delete Failed');
      }
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
    setEditedTitle(slide?.title || '');
  };

  const handleOk = async () => {
    setSlideId((prevSlide) => ({
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
      if (isMounted) {
        message.success('Title Updated Successfully');
      }
    } catch (error) {
      if (isMounted) {
        message.error('Failed to Update Title');
      }
    }
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const toPrevious = () => {
    setCurrentSlide(currentSlide - 1);
  };

  const toNext = () => {
    setCurrentSlide(currentSlide + 1);
  };

  const previewFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const handleTitleFontSizeChange = (value) => {
    setTitleFontSize(value);
  };

  const handleSubtitleFontSizeChange = (value) => {
    setSubtitleFontSize(value);
  };

  const handleSave = () => {
    const newTitle = {
      ...slide.slideContent[currentSlide].title,
      style: {
        ...slide.slideContent[currentSlide].title.style,
        fontSize: titleFontSize,
        fontFamily: titleFontFamily,
      },
    };
    const newSubtitle = {
      ...slide.slideContent[currentSlide].subtitle,
      style: {
        ...slide.slideContent[currentSlide].subtitle.style,
        fontSize: subtitleFontSize,
        fontFamily: subtitleFontFamily,
      },
    };
    ChangeCard({
      title: newTitle,
      subtitle: newSubtitle,
      backgroundColor: selectedColor || slide.slideContent[currentSlide].backgroundColor,
    });
    setIsDrawerOpen(false);
  };

  const addSlide = (index) => {
    const newSlide = {
      ...DafaultSlideContent,
    }
    slide.slideContent.splice(index + 1, 0, newSlide);
    setSlideId(
      {
        ...slide,
        slideContent: [
          ...slide.slideContent,
        ],
      }
    );
    setTimeout(() => { setCurrentSlide(index + 1) }, 50);
    message.success('Slide Added Successfully, Please Click Save Buttom to keep the changes');
  };

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
                          <Tooltip title="Preview the Slide in Fullscreen">
                          <Button onClick={previewFullScreen} type="dashed" style={{ marginRight: '20px', background: 'transparent', color: 'white' }}>Preview</Button>
                          </Tooltip>
                          <Tooltip title="Design Font and Theme">
                          <Button onClick={() => setIsDrawerOpen(true)} style={{ marginRight: '20px', background: 'transparent', color: 'white' }}>Design</Button>
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
                          backgroundColor={slideContent.backgroundColor}
                          addSlide={addSlide}
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
                          onClick={previewFullScreen}
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
                      <ASlide style={{ backgroundColor: slide.slideContent[currentSlide]?.backgroundColor }}>
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
          <Drawer
          title="Design"
          placement="top"
          closable={true}
          onClose={() => setIsDrawerOpen(false)}
          open={isDrawerOpen}
          height={200}
          extra={
              <Button type="primary" onClick={handleSave}>
              Save
              </Button>
          }
          >
          <h3>Background</h3>
          <ColorPicker
              defaultValue={slide.slideContent[currentSlide]?.backgroundColor || '#ffffff'}
              showText
              onChangeComplete={(color) => {
                setSelectedColor(color.toHexString());
              }}
              />
          {hasTitleAndSubtitle && (
              <>
              <h3>Font Size</h3>
              <div>
                  <label>Title: </label>
                  <InputNumber
                  min={1}
                  max={100}
                  value={titleFontSize}
                  onChange={handleTitleFontSizeChange}
                  />
                  <Select
                      showSearch
                      placeholder="Select a font"
                      optionFilterProp="children"
                      style={{ marginLeft: '10px' }}
                      value={titleFontFamily}
                      onChange={(value) => setTitleFontFamily(value)}
                      options={[
                        { value: 'Arial', label: 'Arial' },
                        { value: 'Helvetica', label: 'Helvetica' },
                        { value: 'Times New Roman', label: 'Times New Roman' },
                        { value: 'Courier New', label: 'Courier New' },
                        { value: 'Verdana', label: 'Verdana' },
                      ]}
          />
          </div>
              <div style={{ marginTop: '10px' }}>
                  <label>Subtitle: </label>
                  <InputNumber
                  min={1}
                  max={100}
                  value={subtitleFontSize}
                  onChange={handleSubtitleFontSizeChange}
                  />
                  <Select
                      showSearch
                      placeholder="Select a font"
                      optionFilterProp="children"
                      style={{ marginLeft: '10px' }}
                      value={subtitleFontFamily}
                      onChange={(value) => setSubtitleFontFamily(value)}
                      options={[
                        { value: 'Arial', label: 'Arial' },
                        { value: 'Helvetica', label: 'Helvetica' },
                        { value: 'Times New Roman', label: 'Times New Roman' },
                        { value: 'Courier New', label: 'Courier New' },
                        { value: 'Verdana', label: 'Verdana' },
                      ]}
          />
              </div>
              </>
          )}
          </Drawer>
      </Container>
  );
};

export default EditPage;
