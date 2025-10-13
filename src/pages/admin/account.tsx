import React, { useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';

// ===============================================
// UI/UX - GIAO DIỆN QUẢN TRỊ ĐỒNG BỘ
// ===============================================

const AdminPageWrapper = styled.div`
  min-height: 100vh;
  background-color: #f8f9fa;
  display: flex;
  font-family: 'Inter', sans-serif;
`;

const SidebarWidth = '260px';

// NOTE: Sidebar này chỉ mang tính chất placeholder trực quan.
// Để có sidebar đầy đủ chức năng như trang index, chúng ta cần một component Layout dùng chung.
const SidebarPlaceholder = styled.nav`
  width: ${SidebarWidth};
  background-color: #111827;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  flex-shrink: 0;
`;

const MainContentArea = styled.main`
  flex: 1;
  margin-left: ${SidebarWidth};
  display: flex;
  flex-direction: column;
`;

const AdminHeader = styled.header`
  background-color: #ffffff;
  padding: 15px 40px;
  display: flex;
  justify-content: space-between; // Căn chỉnh các mục
  align-items: center;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 99;
`;

const HeaderTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
`;

const BackButton = styled.button`
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #e5e7eb;
  padding: 8px 15px;
  cursor: pointer;
  border-radius: 6px;
  font-weight: 700;
  font-size: 0.9rem;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #e5e7eb;
  }
`;

const ContentWrapper = styled.div`
  padding: 40px;
  display: flex;
  justify-content: center;
`;

const ContentForm = styled.form`
  padding: 40px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 600px;
  height: fit-content;
`;

const FormTitle = styled.h2`
  font-size: 1.8rem;
  color: #111827;
  margin-bottom: 30px;
  text-align: center;
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
  label {
    display: block;
    font-weight: 600;
    margin-bottom: 8px;
    color: #374151;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
`;

const Button = styled.button`
  width: 100%;
  padding: 15px;
  margin-top: 10px;
  background-color: #C6A500;
  color: #111827;
  border: none;
  border-radius: 6px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #FFD700;
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const StatusMessage = styled.p<{ $isError?: boolean }>`
  text-align: center;
  margin-top: 20px;
  color: ${({ $isError }) => ($isError ? '#ef4444' : '#10b981')};
  font-weight: bold;
`;

// ===============================================
// LOGIC CHÍNH
// ===============================================

const AccountAdminPage: React.FC = () => {
    const router = useRouter();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [status, setStatus] = useState({ message: '', isError: false });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus({ message: '', isError: false });

        if (!currentPassword) {
            setStatus({ message: 'Vui lòng nhập mật khẩu hiện tại để xác thực.', isError: true });
            setIsLoading(false);
            return;
        }

        if (!newUsername && !newPassword) {
            setStatus({ message: 'Bạn phải thay đổi Tên đăng nhập hoặc Mật khẩu mới.', isError: true });
            setIsLoading(false);
            return;
        }

        const response = await fetch('/api/admin/update-account', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ currentPassword, newUsername, newPassword }),
        });

        const data = await response.json();

        if (response.ok) {
            setStatus({ message: data.message, isError: false });
            // Xóa các trường sau khi thành công
            setCurrentPassword('');
            setNewUsername('');
            setNewPassword('');
        } else {
            setStatus({ message: data.error, isError: true });
        }
        setIsLoading(false);
    };

    return (
        <AdminPageWrapper>
            {/* Sidebar này chỉ là placeholder để giữ layout.
                Để dùng chung, chúng ta cần tạo một component AdminLayout.
            */}
            <SidebarPlaceholder />
            
            <MainContentArea>
                <AdminHeader>
                    <HeaderTitle>Quản lý Tài khoản</HeaderTitle>
                    <BackButton onClick={() => router.push('/admin')}>
                        ← Quay lại Dashboard
                    </BackButton>
                </AdminHeader>
                <ContentWrapper>
                    <ContentForm onSubmit={handleSubmit}>
                        <FormTitle>Thay đổi Thông tin Đăng nhập</FormTitle>
                        <InputGroup>
                            <label htmlFor="currentPassword">Mật khẩu hiện tại (Bắt buộc)</label>
                            <Input
                                id="currentPassword"
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                            />
                        </InputGroup>
                        <hr style={{ margin: '30px 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />
                        <InputGroup>
                            <label htmlFor="newUsername">Tên đăng nhập mới (Để trống nếu không đổi)</label>
                            <Input
                                id="newUsername"
                                type="text"
                                placeholder="ví dụ: nankyadmin"
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                            />
                        </InputGroup>
                        <InputGroup>
                            <label htmlFor="newPassword">Mật khẩu mới (Để trống nếu không đổi)</label>
                            <Input
                                id="newPassword"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </InputGroup>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Đang xử lý...' : 'Cập nhật Tài khoản'}
                        </Button>
                        {status.message && <StatusMessage $isError={status.isError}>{status.message}</StatusMessage>}
                    </ContentForm>
                </ContentWrapper>
            </MainContentArea>
        </AdminPageWrapper>
    );
};

export default AccountAdminPage;