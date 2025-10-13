import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useI18n } from '../../hooks/useI18n'; 

// Dữ liệu nhãn ngôn ngữ (Đã bỏ Icon)
const languages = [
    { code: 'vi', label: 'Tiếng Việt', display: 'VN' },
    { code: 'en', label: 'English', display: 'US' }, 
    { code: 'ru', label: 'Русский', display: 'RU' },
    { code: 'kr', label: '한국어', display: 'KR' },
    { code: 'zh', label: '中文', display: 'ZH' },
];

const LanguageWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  font-family: 'Inter', sans-serif;
  z-index: 10;
`;

const CurrentLangButton = styled(motion.button)`
  /* Style Nút Dropdown */
  background-color: #fff; 
  border: 1px solid #C6A500; /* Viền Vàng Đồng */
  border-radius: 20px; /* Bo tròn */
  cursor: pointer;
  padding: 8px 15px;
  font-weight: 700;
  color: #222; /* Chữ màu tối */
  display: flex;
  align-items: center;
  transition: all 0.2s;
  font-size: 0.95rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #FFFAE5; /* Nền vàng nhẹ */
    color: #C6A500;
  }
`;

const Dropdown = styled(motion.div)`
  position: absolute;
  top: 100%; 
  right: 0;
  margin-top: 8px;
  background-color: #fff;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  overflow: hidden;
  z-index: 20;
  min-width: 160px;
`;

const LangOption = styled.div<{ $isActive: boolean }>`
  padding: 10px 15px;
  cursor: pointer;
  font-weight: ${({ $isActive }) => ($isActive ? '700' : '500')};
  color: ${({ $isActive }) => ($isActive ? '#fff' : '#222')};
  background-color: ${({ $isActive }) => ($isActive ? '#C6A500' : '#fff')};
  display: flex;
  align-items: center;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ $isActive }) => ($isActive ? '#FFD700' : '#f5f5f5')};
  }
`;

const LanguageSwitcher: React.FC = () => {
  const { lang, changeLanguage } = useI18n(); 
  const [isOpen, setIsOpen] = useState(false);
  const timerRef = useRef<number | null>(null);
  
  const currentLang = languages.find(l => l.code === lang) || languages[0];

  const dropdownVariants = {
    open: { opacity: 1, y: 0, display: 'block' },
    closed: { opacity: 0, y: -10, transition: { duration: 0.2, type: 'tween' }, transitionEnd: { display: 'none' } }
  };

  const handleLangSelect = (code: string) => {
    changeLanguage(code);
    setIsOpen(false);
  };
  
  const handleMouseEnter = () => {
    // Xóa timer nếu có, và mở dropdown ngay lập tức
    if (timerRef.current) {
        clearTimeout(timerRef.current);
    }
    setIsOpen(true);
  };
  
  const handleMouseLeave = () => {
    // Thiết lập timer để đóng sau 150ms (cho phép chuột di chuyển)
    timerRef.current = window.setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  // Cleanup timer khi component unmount
  React.useEffect(() => {
    return () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
    };
  }, []);


  return (
    // FIX: Đặt onMouseLeave trên Wrapper để giữ cho dropdown mở
    <LanguageWrapper onMouseLeave={handleMouseLeave} onMouseEnter={handleMouseEnter}> 
      
      <CurrentLangButton 
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.98 }}
        onMouseEnter={handleMouseEnter} // Đảm bảo luôn mở khi trỏ vào nút
      >
        {currentLang.label}
      </CurrentLangButton>
      
      <Dropdown
        initial="closed"
        animate={isOpen ? 'open' : 'closed'}
        variants={dropdownVariants}
        // Giữ nguyên timer logic trên Wrapper.
      >
        {languages.map((l) => (
          <LangOption
            key={l.code}
            $isActive={lang === l.code}
            onClick={() => handleLangSelect(l.code)}
          >
            {l.label} ({l.display})
          </LangOption>
        ))}
      </Dropdown>
    </LanguageWrapper>
  );
};

export default LanguageSwitcher;