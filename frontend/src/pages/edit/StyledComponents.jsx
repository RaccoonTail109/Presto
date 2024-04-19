import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  flex-direction: column;
`;

export const BackTitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const SlideTitle = styled.h1`
  color: white;
  font-size: 32px;
  font-family: 'Roboto', sans-serif;
`;

export const MainContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  background-color: #f5f5f5;
  overflow: hidden;
`;

export const LeftOutline = styled.div`
  width: 250px;
  max-height: 100%;
  overflow-y: auto;
  border-right: 1px solid #c4c4c4;
  align-items: center;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const RightContent = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  gap: 20px;
  ${(props) =>
    props.isFullScreen &&
    `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;
    background-color: #F5F5F5;
  `}
`;

export const ASlide = styled.div`
  display: flex;
  background-color: #fff;
  width: 70%;
  height: 85%;
`;

export const SlideContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  border: none;
`;

export const CardSlideContainer = styled.div`
  position: relative;
  background-color: 'white';
  border-radius: 10px;
  width: 100%;
  height: 120px;
  border: ${(props) => (props.active ? '2px solid #a0d911' : '1px solid #C4C4C4')};
  cursor: pointer;
`;

export const CardButtons = styled.div`
  position: absolute;
  bottom: -20px;
  left: 40%;
  display: ${(props) => (props.active ? 'flex' : 'none')};
  width: 80px;
`;

export const CardButton = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #a0d911;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

export const IndexLabel = styled.label`
  position: absolute;
  color: ${(props) => (props.active ? '#a0d911' : 'black')};
  font-size: 15px;
  top: 0;
  left: -18px;
`;

export const FullScreenHeader = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10000;
`;
