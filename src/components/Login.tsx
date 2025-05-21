import React, { FC, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './Login.scss';

type LoginProps = {
  setAccessToken: (token: string) => void;
};

const Login: FC<LoginProps> = ({ setAccessToken }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const exchangeCodeForToken = async (code: string) => {
    try {
      const { data } = await axios.get(
        'https://graph.facebook.com/v22.0/oauth/access_token',
        {
          params: {
            client_id: process.env.REACT_APP_FACEBOOK_APP_ID,
            client_secret: process.env.REACT_APP_FACEBOOK_APP_SECRET,
            redirect_uri: process.env.REACT_APP_REDIRECT_URI,
            code,
          },
        },
      );
      setAccessToken(data.access_token);
      localStorage.setItem('fb_access_token', data.access_token);
      navigate('/posts');
    } catch (error) {
      console.error('Authentication error:', error);
      navigate('/', { state: { error: 'Authentication failed' } });
    }
  };

  useEffect(() => {
    const code = new URLSearchParams(location.search).get('code');
    if (!code) return;

    exchangeCodeForToken(code);
  }, [location.search, setAccessToken, navigate]);

  const handleLogin = () => {
    const baseUrl = 'https://www.facebook.com/v22.0/dialog/oauth';
    const params = new URLSearchParams({
      client_id: process.env.REACT_APP_FACEBOOK_APP_ID || '',
      redirect_uri: process.env.REACT_APP_REDIRECT_URI || '',
      scope: 'public_profile,email,user_posts',
      response_type: 'code',
    });

    window.location.href = `${baseUrl}?${params.toString()}`;
  };

  return (
    <div className="login">
      <div className="login__container">
        <h2 className="login__title">Welcome</h2>
        <p className="login__description">
          Connect with Facebook to manage your posts
        </p>
        <button onClick={handleLogin} className="login__button">
          <span className="login__button-icon">f</span>
          Login with Facebook
        </button>
      </div>
    </div>
  );
};

export default Login;
