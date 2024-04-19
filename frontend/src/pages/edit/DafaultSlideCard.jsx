import React, { useEffect, useState } from 'react';
import { SlideContentContainer } from './StyledComponents';

export const DafaultSlideContent = {
  templateId: 1,
  backgroundColor: '#ffffff',
  title: {
    inEdit: false,
    text: 'Add a heading',
    style: {
      backgroundColor: 'transparent',
      fontFamily: 'Arial',
      margin: 0,
      marginBottom: 30,
      width: '40vw',
      height: '150px',
      lineHeight: '150px',
      fontSize: 40,
      fontWeight: 'bold',
      textAlign: 'center',
      border: '1px dashed #C4C4C4',
    },
  },
  subtitle: {
    inEdit: false,
    text: 'Add a subheading',
    style: {
      fontFamily: 'Arial',
      margin: 0,
      width: '40vw',
      height: '70px',
      lineHeight: '70px',
      fontSize: 20,
      textAlign: 'center',
      border: '1px dashed #C4C4C4',
      backgroundColor: 'transparent',
    },
  },
};

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
      <SlideContentContainer style = {{ transform: preview ? 'scale(0.21)' : 'scale(1)', backgroundColor: slideContent.backgroundColor }}>
        {!preview && title.inEdit
          ? <input value = {title.text} style={title.style } placeholder='Input Title' onChange = {ChangeTitle} onBlur = {ExitTitleEdit} type="text" />
          : <h1 style={title.style} onClick={TitlegotoEdit}>{title.text}</h1>}
        {!preview && subtitle.inEdit
          ? <input value = {subtitle.text} style={subtitle.style} placeholder='Input Subtitle' onChange = {ChangeSubtitle} onBlur = {ExitSubtitleEdit} type="text" />
          : <h2 style={subtitle.style} onClick={SubTitlegotoEdit}> {subtitle.text}</h2>}
      </SlideContentContainer>
  );
};

export default DafaultSlideCard;
