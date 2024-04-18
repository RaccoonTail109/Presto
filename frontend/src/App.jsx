import React, { useEffect } from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

function App () {
  const navigate = useNavigate();
  const goLogin = () => {
    navigate('/login');
  };
  useEffect(() => {
    document.title = 'Presto';
  }, [])
  return (
    <>
    <Button onClick={goLogin}>Go Login</Button>
    </>
  );
}

export default App;
