// src/pages/Login.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useTranslation } from '../js/i18n';
import '../styles/Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLoginSuccess = (credentialResponse) => {
    const { credential } = credentialResponse;
    const base64Url = credential.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const decodedPayload = JSON.parse(window.atob(base64));
    localStorage.setItem('user', JSON.stringify(decodedPayload));
    navigate('/');
  };

  const handleLoginError = () => {
    console.log('Login failed');
  };

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">{t('login')}</h1>
        <p className="login-subtitle">
          {t('loginSubtitle', '欢迎使用 AI 工具箱，请登录以获得完整体验')}
        </p>
        <div className="login-options">
          <div className="google-login-wrapper">
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={handleLoginError}
              theme="outline"
              size="large"
              width="100%"
              text="signin_with"
              shape="rectangular"
              locale="zh_CN"
              useOneTap
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;