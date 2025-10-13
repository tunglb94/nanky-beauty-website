import React, { useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';

const LoginPageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
  font-family: 'Inter', sans-serif;
`;

const LoginForm = styled.form`
  padding: 40px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  color: #C6A500;
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 15px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
`;

const Button = styled.button`
  width: 100%;
  padding: 12px 15px;
  background-color: #C6A500;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #FFD700;
  }
`;

const ErrorMessage = styled.p`
  color: #e74c3c;
  margin-top: 15px;
`;

const AdminLoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            // Đăng nhập thành công, chuyển hướng đến trang admin chính
            router.push('/admin');
        } else {
            const data = await response.json();
            setError(data.error || 'Tên đăng nhập hoặc mật khẩu không đúng.');
        }
    };

    return (
        <LoginPageWrapper>
            <LoginForm onSubmit={handleSubmit}>
                <Title>NANKY BEAUTY - ADMIN</Title>
                <Input
                    type="text"
                    placeholder="Tên đăng nhập"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <Input
                    type="password"
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <Button type="submit">Đăng Nhập</Button>
                {error && <ErrorMessage>{error}</ErrorMessage>}
            </LoginForm>
        </LoginPageWrapper>
    );
};

export default AdminLoginPage;