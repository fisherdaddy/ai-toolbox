// src/pages/Login.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = (credentialResponse) => {
    const { credential } = credentialResponse;

    // 手动解码 JWT
    const base64Url = credential.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const decodedPayload = JSON.parse(window.atob(base64));

    // 将用户信息保存到 localStorage 或上下文
    localStorage.setItem('user', JSON.stringify(decodedPayload));
    navigate('/'); // 登录成功后重定向到首页
  };

  const handleLoginError = () => {
    console.log('登录失败');
  };

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      navigate('/'); // 如果已登录，直接跳转到首页
    }
  }, [navigate]);

  return (
    <div className="login-container">
      <h1>登录</h1>
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={handleLoginError}
      />
    </div>
  );
};

export default Login;
