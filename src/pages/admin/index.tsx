import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import type { ContentState, AdminEditorProps } from '../../types/admin';

// ===============================================
// DYNAMIC IMPORTS
// ===============================================
const AdminHomepageEditor = dynamic(() => import('components/admin/AdminContentEditor'));
const AdminAboutEditor = dynamic(() => import('components/admin/AdminAboutEditor'));
const AdminServicesEditor = dynamic(() => import('components/admin/AdminServicesEditor'));

// ===============================================
// UI/UX NÂNG CẤP - GIAO DIỆN QUẢN TRỊ CHUYÊN NGHIỆP
// ===============================================
const AdminPageWrapper = styled.div`
  min-height: 100vh;
  background-color: #f8f9fa;
  display: flex;
  font-family: 'Inter', sans-serif;
`;

const SidebarWidth = '260px';

const Sidebar = styled.nav`
  width: ${SidebarWidth};
  background-color: #111827;
  color: #d1d5db;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  flex-shrink: 0;
  box-shadow: 2px 0 15px rgba(0, 0, 0, 0.05);
`;

const SidebarHeader = styled.div`
  padding: 24px 20px;
  font-size: 1.5rem;
  font-weight: 700;
  color: #FFD700;
  text-align: center;
  border-bottom: 1px solid #1f2937;
`;

const NavList = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding: 15px 0;
`;

const NavHeader = styled.h3`
  color: #6b7280;
  padding: 10px 25px;
  margin-top: 20px;
  margin-bottom: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
`;

const NavItem = styled.div<{ $isActive: boolean }>`
  padding: 12px 25px;
  margin: 4px 12px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 12px;
  border-radius: 8px;
  background-color: ${({ $isActive }) => ($isActive ? '#C6A500' : 'transparent')};
  color: ${({ $isActive }) => ($isActive ? '#111827' : '#e5e7eb')};
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: ${({ $isActive }) => ($isActive ? '#FFD700' : '#1f2937')};
    color: ${({ $isActive }) => ($isActive ? '#111827' : '#fff')};
  }
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
  justify-content: flex-end;
  align-items: center;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 99;
`;

const HeaderControls = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const LanguageButton = styled.button<{ $isActive: boolean }>`
  background: ${({ $isActive }) => ($isActive ? '#C6A500' : '#f3f4f6')};
  color: ${({ $isActive }) => ($isActive ? '#ffffff' : '#374151')};
  border: 1px solid ${({ $isActive }) => ($isActive ? '#C6A500' : '#e5e7eb')};
  padding: 8px 15px;
  cursor: pointer;
  border-radius: 6px;
  font-weight: 700;
  font-size: 0.9rem;
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
`;

const LogoutButton = styled.button`
  background: transparent;
  color: #6b7280;
  border: none;
  padding: 9px 15px;
  cursor: pointer;
  border-radius: 6px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease-in-out;

  &:hover {
    background: #f87171;
    color: #fff;
  }
`;

const ContentWrapper = styled.div`
  padding: 40px;
  flex-grow: 1;
`;

const LoadingContainer = styled.div`
    text-align: center;
    padding: 100px;
    font-size: 1.2rem;
    color: #666;
`;

// ===============================================
// LOGIC CHÍNH
// ===============================================

const AdminSections: { [key: string]: string[] } = {
    Home: ['Hero', 'WhyUs', 'Services', 'GalleryTeaser', 'Testimonials', 'Materials', 'CTA'],
    About: ['HeroBanner', 'Philosophy', 'Pillars', 'Timeline', 'CTA'],
    Services: ['ServiceList'],
    Account: [],
};

const AdminDashboard: React.FC = () => {
    const router = useRouter();
    const languages: ('vi' | 'en' | 'ru' | 'kr' | 'zh')[] = ['vi', 'en', 'ru', 'kr', 'zh'];
    
    const [activePage, setActivePage] = useState<string>(() => (typeof window !== 'undefined' ? sessionStorage.getItem('adminActivePage') || 'Home' : 'Home'));
    const [activeInternalSection, setActiveInternalSection] = useState<string>(() => (typeof window !== 'undefined' ? sessionStorage.getItem('adminActiveInternalSection') || AdminSections.Home[0] : AdminSections.Home[0]));
    const [currentLang, setCurrentLang] = useState<'vi' | 'en' | 'ru' | 'kr' | 'zh'>('vi');
    const [content, setContent] = useState<ContentState | null>(null);
    const [rawContent, setRawContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState('');
    const [isRaw, setIsRaw] = useState(false);

    useEffect(() => {
        sessionStorage.setItem('adminActivePage', activePage);
        sessionStorage.setItem('adminActiveInternalSection', activeInternalSection);
    }, [activePage, activeInternalSection]);

    useEffect(() => {
        setIsLoading(true);
        fetch(`/api/content?lang=${currentLang}`)
          .then(res => res.json())
          .then(data => {
            setContent(data);
            setRawContent(JSON.stringify(data, null, 2));
            setIsLoading(false);
          })
          .catch(() => {
            setStatus('Error loading content.');
            setIsLoading(false);
          });
    }, [currentLang]);

    const updateContent = (path: (string | number)[], value: string | null) => {
        if (!content) return;
        const newContent = JSON.parse(JSON.stringify(content));
        let obj = newContent as any;
        for (let i = 0; i < path.length - 1; i++) {
            if (obj[path[i]] === undefined) obj[path[i]] = typeof path[i + 1] === 'number' ? [] : {};
            obj = obj[path[i]];
        }
        if (value === null) (Array.isArray(obj) ? obj.splice(path[path.length - 1] as number, 1) : delete obj[path[path.length - 1]]);
        else obj[path[path.length - 1]] = value;
        setContent(newContent);
        setRawContent(JSON.stringify(newContent, null, 2));
    };
    
    const handleSave = async () => {
        try {
          const contentToSave = isRaw ? JSON.parse(rawContent) : content;
          if (!contentToSave) throw new Error("Content is empty.");
          setIsLoading(true);
          const response = await fetch('/api/save-content', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lang: currentLang, content: contentToSave }),
          });
          if (!response.ok) throw new Error('Server response was not ok');
          setStatus(`Lưu thành công cho ${currentLang.toUpperCase()}!`);
        } catch (e: any) {
          setStatus(`LỖI: ${e.message}`);
        } finally {
          setIsLoading(false);
          setTimeout(() => setStatus(''), 5000);
        }
    };

    const syncImageAcrossLanguages = async (path: (string | number)[], newUrl: string) => {
        setStatus('Bắt đầu đồng bộ ảnh...');
        const languagesToSync = languages.filter(lang => lang !== currentLang);
        for (const lang of languagesToSync) {
            try {
                setStatus(`Đang đồng bộ cho ${lang.toUpperCase()}...`);
                const resGet = await fetch(`/api/content?lang=${lang}`);
                if (!resGet.ok) throw new Error(`Không thể tải nội dung ${lang}`);
                const contentToUpdate = await resGet.json();
                let obj = contentToUpdate as any;
                for (let i = 0; i < path.length - 1; i++) {
                    if (obj[path[i]] === undefined) obj[path[i]] = typeof path[i + 1] === 'number' ? [] : {};
                    obj = obj[path[i]];
                }
                obj[path[path.length - 1]] = newUrl;
                const resPost = await fetch('/api/save-content', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ lang: lang, content: contentToUpdate }),
                });
                if (!resPost.ok) throw new Error(`Không thể lưu nội dung ${lang}`);
            } catch (error: any) {
                setStatus(`LỖI khi đồng bộ cho ${lang.toUpperCase()}: ${error.message}`);
                return;
            }
        }
        setStatus('Đồng bộ ảnh hoàn tất!');
        setTimeout(() => setStatus(''), 5000);
    };

    const handleLogout = async () => {
        sessionStorage.clear();
        await fetch('/api/auth/logout');
        router.push('/admin/login');
    };

    const primaryNavSections = [{ key: 'Home', label: 'Trang Chủ' }, { key: 'About', label: 'Trang Về Chúng Tôi' }, { key: 'Services', label: 'Trang Dịch Vụ' }, { key: 'Account', label: 'Tài Khoản' }];
    
    const handlePrimaryNavClick = (pageKey: string) => {
        setActivePage(pageKey);
        if (pageKey === 'Account') {
            router.push('/admin/account');
            return;
        }
        const subSections = AdminSections[pageKey as keyof typeof AdminSections];
        setActiveInternalSection(subSections.length > 0 ? subSections[0] : '');
    };
    
    const renderEditor = () => {
        if (activePage === 'Account') return null;
        if (isLoading || !content) return <LoadingContainer>Đang tải dữ liệu {currentLang.toUpperCase()}...</LoadingContainer>;

        const editorProps: AdminEditorProps = {
            lang: currentLang, activeSection: activeInternalSection, content: content, updateContent,
            handleSave, isLoading, status, setStatus, isRaw, setIsRaw, rawContent, setRawContent, syncImageAcrossLanguages
        };

        switch (activePage) {
            case 'Home': return <AdminHomepageEditor {...editorProps} />;
            case 'About': return <AdminAboutEditor {...editorProps} />;
            case 'Services': return <AdminServicesEditor {...editorProps} />;
            default: return (
                <div style={{padding: '20px', backgroundColor: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', borderRadius: '8px'}}>
                    <h2 style={{color: '#333'}}>Chào mừng đến với Trang Quản trị</h2>
                    <p>Vui lòng chọn một mục từ menu bên trái để bắt đầu chỉnh sửa.</p>
                </div>
            );
        }
    };

    return (
        <AdminPageWrapper>
            <Sidebar>
                <SidebarHeader>Nanky Beauty</SidebarHeader>
                <NavList>
                    <NavHeader>Quản Lý</NavHeader>
                    {primaryNavSections.map(page => (
                        <NavItem key={page.key} $isActive={activePage === page.key} onClick={() => handlePrimaryNavClick(page.key)}>
                            {page.label}
                        </NavItem>
                    ))}
                    {AdminSections[activePage as keyof typeof AdminSections]?.length > 0 && (
                        <>
                            <NavHeader>Nội dung trang {activePage}</NavHeader>
                            {AdminSections[activePage as keyof typeof AdminSections].map(section => (
                                <NavItem key={section} $isActive={activeInternalSection === section} onClick={() => setActiveInternalSection(section)} style={{ paddingLeft: '40px' }}>
                                    {section.replace(/([A-Z])/g, ' $1').trim()}
                                </NavItem>
                            ))}
                        </>
                    )}
                </NavList>
            </Sidebar>
            <MainContentArea>
                <AdminHeader>
                    <HeaderControls>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {languages.map((langCode) => (
                                <LanguageButton key={langCode} $isActive={currentLang === langCode} onClick={() => setCurrentLang(langCode)}>
                                    {langCode.toUpperCase()}
                                </LanguageButton>
                            ))}
                        </div>
                        <LogoutButton onClick={handleLogout}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                            <span>Đăng Xuất</span>
                        </LogoutButton>
                    </HeaderControls>
                </AdminHeader>
                <ContentWrapper>
                    {renderEditor()}
                </ContentWrapper>
            </MainContentArea>
        </AdminPageWrapper>
    );
};

export default AdminDashboard;