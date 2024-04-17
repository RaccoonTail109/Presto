import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ConfigProvider } from 'antd';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './global.css';
import LoginWrapper from './pages/login';
import RegisterWrapper from './pages/register';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />
    },
    {
      path: 'dashboard',
      element: <div>Dashboard</div>
    },
    {
      path: 'login',
      element: <LoginWrapper />
    },
    {
      path: 'register',
      element: <RegisterWrapper />
    },
    {
      path: 'create',
      element: <div>Create</div>
    },
    {
      path: 'edit/:id',
      element: <div>Edit</div>
    },
  ]
);

ReactDOM.render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          // Seed Token，影响范围大
          colorPrimary: '#a0d911',
        },
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
