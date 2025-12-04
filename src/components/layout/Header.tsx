import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import LanguageSwitcher from './LanguageSwitcher';
import { useI18n } from '../../hooks/useI18n';

// Keyframes cho hiệu ứng Lấp lánh (Shimmer) cho Logo
const logoShimmer = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%; /* Lặp lại hiệu ứng */
  }
`;

const HeaderWrapper = styled(motion.header)<{ $isScrolled: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 80px;

  background-color: ${({ $isScrolled }) => ($isScrolled ? 'rgba(249, 249, 249, 0.95)' : 'transparent')};
  box-shadow: ${({ $isScrolled }) => ($isScrolled ? '0 2px 10px rgba(0, 0, 0, 0.05)' : 'none')};

  backdrop-filter: blur(5px);
  transition: all 0.3s ease-in-out;

  /* MOBILE OPTIMIZATION */
  @media (max-width: 768px) {
    padding: 15px 25px;
  }
`;

// Logo Nanky Beauty: Đã chuyển từ h1 sang motion.a (link) và tối ưu line-height
const Logo = styled(motion.a)<{ $isScrolled: boolean }>`
  font-family: 'Inter', sans-serif;
  font-size: ${({ $isScrolled }) => ($isScrolled ? '26px' : '30px')};
  transition: font-size 0.3s ease;
  font-weight: 700;
  cursor: pointer;

  background: linear-gradient(to right, #FFD700 0%, #C6A500 50%, #FFD700 100%);
  background-size: 200% auto;

  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;

  transition: all 0.5s ease;

  /* FIX LOGO MOBILE: Đảm bảo nằm trên một dòng */
  line-height: 1;
  display: inline-block;

  &:hover {
    animation: ${logoShimmer} 2s linear infinite;
    transform: scale(1.02);
  }

  @media (max-width: 768px) {
    font-size: 22px;
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 30px;

  /* ẨN TRÊN MOBILE */
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(motion.a)`
  text-decoration: none;

  /* MENU CHỮ ĐEN BOLD */
  color: #222;
  font-weight: 700;

  position: relative;
  text-transform: capitalize;

  &:hover {
    color: #C6A500;
  }
`;

// BookButton: Đã chuyển từ button sang motion.a (link) và tối ưu white-space
const BookButton = styled(motion.a)`
  padding: 12px 25px;
  font-size: 16px;
  letter-spacing: 0.5px;

  background-image: linear-gradient(to right, #D4AF37 0%, #F0E68C 50%, #D4AF37 100%);
  background-color: transparent;
  background-size: 200% auto;
  border-radius: 25px;
  border: none;

  color: #111;
  cursor: pointer;
  font-weight: 700;
  overflow: hidden;
  position: relative;
  text-transform: uppercase;
  transition: all 0.5s ease-in-out;
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.4);

  /* FIX NÚT BẤM MOBILE: Buộc không xuống dòng */
  white-space: nowrap;
  padding: 12px 30px;

  &:hover {
    background-position: right center;
    box-shadow: 0 8px 25px rgba(212, 175, 55, 0.6);
    transform: translateY(-2px);
    color: #111;
  }
`;

const MobileNavContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const MenuIcon = styled.button`
    background: none;
    border: none;
    font-size: 28px;
    color: #222;
    cursor: pointer;
    z-index: 1001;

    /* CHỈ HIỂN THỊ TRÊN MOBILE */
    @media (min-width: 769px) {
        display: none;
    }
`;

// *** MOBILE MENU OVERLAY ***
const MobileMenuOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  right: 0;
  width: 300px;
  height: 100vh;
  background-color: #fff;
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.2);
  z-index: 999;
  padding-top: 80px;
  display: flex;
  flex-direction: column;

  @media (min-width: 769px) {
    display: none;
  }
`;

const MobileNavLink = styled(NavLink)`
  display: block;
  padding: 15px 25px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 1.1rem;
  font-weight: 600; /* Làm cho chữ nổi bật hơn trong mobile */
  color: #333;

  &:last-child {
    border-bottom: none;
  }
`;

const MobileLangSwitcherWrapper = styled.div`
    padding: 15px 25px;
    border-bottom: 1px solid #f0f0f0;

    /* YÊU CẦU MỚI: Thêm nhãn Ngôn ngữ */
    & > p {
        font-weight: 700;
        color: #222;
        margin-bottom: 10px;
        font-size: 0.95rem;
    }

    /* Đảm bảo Language Switcher dropdown hoạt động tốt trong menu mobile */
    & > div {
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }
`;
// **********************************


const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Đóng menu khi resize từ mobile sang desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMenuOpen]);

  // Đã thêm 'news' vào danh sách
  const navItems = ['home', 'services', 'gallery', 'news', 'about', 'contact'];


  const shineAnimation = {
    initial: { x: '-100%', skewX: '-45deg' },
    hover: { x: '100%', transition: { duration: 0.8, ease: "easeInOut" } }
  };

  const menuVariants = {
    open: { x: 0, opacity: 1, pointerEvents: 'auto' as 'auto', transition: { duration: 0.3 } },
    closed: { x: 300, opacity: 0, pointerEvents: 'none' as 'none', transition: { duration: 0.3 } }
  };

  return (
    <HeaderWrapper $isScrolled={isScrolled}>
      {/* Logo: Link về Trang chủ ("/") */}
      <Logo $isScrolled={isScrolled} href="/">Nanky Beauty</Logo>

      {/* DESKTOP NAV */}
      <Nav>
        {/* Nav Links */}
        {navItems.map(item => (
          <NavLink
            key={item}
            href={`/${item === 'home' ? '' : item}`}
            whileHover={{ y: -2 }}
          >
            {t(`header.${item}`)}
          </NavLink>
        ))}
        {/* Language Switcher cuối cùng của Nav Desktop */}
        <LanguageSwitcher />
      </Nav>

      <MobileNavContainer>
        {/* BookButton: Link đến trang Liên hệ ("/contact") */}
        <BookButton
          href="/contact"
          initial="initial"
          whileHover="hover"
        >
          <motion.span
            variants={shineAnimation}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '20px',
              height: '100%',
              background: 'rgba(255, 255, 255, 0.4)'
            }}
          />
          {t('header.cta_book')}
        </BookButton>
        <MenuIcon onClick={() => setIsMenuOpen(!isMenuOpen)}>
             {isMenuOpen ? '✕' : '☰'}
        </MenuIcon>
      </MobileNavContainer>

      {/* MOBILE MENU OVERLAY */}
      <MobileMenuOverlay
        initial="closed"
        animate={isMenuOpen ? 'open' : 'closed'}
        variants={menuVariants}
      >
        {/* Menu Links */}
        {navItems.map(item => (
          <MobileNavLink
            key={item}
            href={`/${item === 'home' ? '' : item}`}
            onClick={() => setIsMenuOpen(false)}
          >
            {t(`header.${item}`)}
          </MobileNavLink>
        ))}

        {/* Language Switcher trong Mobile Menu - THÊM NHÃN NGÔN NGỮ */}
        <MobileLangSwitcherWrapper>
            <p>{t('language_switcher_label')}</p>
            <LanguageSwitcher />
        </MobileLangSwitcherWrapper>
      </MobileMenuOverlay>
    </HeaderWrapper>
  );
};

export default Header;