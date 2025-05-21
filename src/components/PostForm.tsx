import React, { FC, FormEvent, useState } from 'react';
import axios, { AxiosError } from 'axios';
import './PostForm.scss';

const PostForm: FC<{ accessToken: string | null }> = ({ accessToken }) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const maxLength = 500;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!accessToken || !message.trim()) return;

    setIsLoading(true);
    try {
      await axios.post('https://graph.facebook.com/v22.0/me/feed', { message }, { params: { access_token: accessToken } });
      setMessage('');
      alert('Post published successfully!');
    } catch (error) {
      console.error('Publishing error:', error);
      const errorMessage = error instanceof AxiosError ? error.response?.data?.error?.message || 'Failed to publish post' : 'Failed to publish post';
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!accessToken) return <p>Please log in.</p>;

  return (
    <form onSubmit={handleSubmit} className="post-form">
      <h2>Create Post</h2>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter your message"
        maxLength={maxLength}
        className="post-form__textarea"
        disabled={isLoading}
      />
      <div className="post-form__counter">
        {message.length}/{maxLength}
      </div>
      <button type="submit" disabled={isLoading || !message.trim()} className="post-form__button">
        {isLoading ? 'Publishing...' : 'Publish'}
      </button>
    </form>
  );
};

export default PostForm;
