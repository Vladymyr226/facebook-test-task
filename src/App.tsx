import React, { FC, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Posts from './components/Posts';
import PostForm from './components/PostForm';

const App: FC = () => {
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('fb_access_token') || null);

  return (
    <Router>
      <div style={{ textAlign: 'center' }}>
        <Routes>
          <Route path="/" element={<Login setAccessToken={setAccessToken} />} />
          <Route
            path="/posts"
            element={
              <div>
                <PostForm accessToken={accessToken} />
                <Posts accessToken={accessToken} />
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
