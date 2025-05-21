import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Posts.scss';

interface Post {
  id: string;
  message?: string;
  created_time: string;
}

const Posts: React.FC<{ accessToken: string | null }> = ({ accessToken }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!accessToken) return;

      setIsLoading(true);
      setError(null);

      try {
        const { data } = await axios.get('https://graph.facebook.com/v22.0/me/posts', {
          params: {
            fields: 'message,created_time',
            limit: 10,
            access_token: accessToken,
          },
        });
        setPosts(data.data);
      } catch (err) {
        setError('Failed to load posts. Please try again later.');
        console.error('Error while retrieving posts:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [accessToken]);

  if (!accessToken) return <p className="posts__login-message">Please log in.</p>;
  if (isLoading) return <div className="posts__loader">Loading posts...</div>;
  if (error) return <div className="posts__error">{error}</div>;

  return (
    <div className="posts">
      <h2 className="posts__title">Last 10 posts</h2>
      {posts.length === 0 ? (
        <p className="posts__empty">No posts found</p>
      ) : (
        <ul className="posts__list">
          {posts.map((post) => (
            <li key={post.id} className="posts__item">
              <p className="posts__message">{post.message || 'No text'}</p>
              <time className="posts__time">{new Date(post.created_time).toLocaleString()}</time>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Posts;
