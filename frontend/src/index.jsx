import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ConfigProvider } from 'antd';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './global.css';
import LoginWrapper from './pages/login';
import RegisterWrapper from './pages/register';
import Dashboard from './pages/dashbord';
import EditPageApp from './pages/edit/index';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />
    },
    {
      path: 'dashboard',
      Component: Dashboard
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
      path: 'edit/:id',
      Component: EditPageApp
    },
  ]
);

ReactDOM.render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#a0d911',
        },
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
