import React from 'react';
import styled from 'styled-components';
import { motion, useScroll, useTransform } from 'framer-motion';
// *** ĐÃ THAY THẾ HÀM MOCK BẰNG IMPORT HOOK THỰC TẾ ***
import { useI18n } from '../../hooks/useI18n'; 
// ******************************************************


const HeroWrapper = styled.section`
  position: relative;
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  @media (max-width: 768px) {
    height: 75vh;
  }
`;

const BackgroundImage = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 120%; /* Cao hơn 100% để tạo Parallax */
  /* SỬ DỤNG HÌNH ẢNH ĐỘNG */
  background-size: cover;
  background-position: center 30%;
  filter: brightness(0.7); /* Làm mờ ảnh để chữ nổi bật */
`;

const ContentBox = styled.div`
  z-index: 10;
  text-align: center;
  color: #fff;
  padding: 0 40px;

  @media (max-width: 768px) {
    padding: 0 15px;
  }
`;

const Title = styled(motion.h1)`
  font-size: 6vw; 
  font-weight: 700;
  color: #FFD700; 
  margin-bottom: 20px;
  line-height: 1.1;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);

  @media (max-width: 768px) {
    font-size: 10vw; /* Tăng kích thước tương đối cho mobile */
    margin-bottom: 15px;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 1.5vw;
  font-weight: 300;
  margin-bottom: 40px;
  max-width: 800px;
  margin: 0 auto 40px;
  
  @media (max-width: 768px) {
    font-size: 4vw;
    margin-bottom: 30px;
  }
`;

const CtaButton = styled(motion.a)`
  display: inline-block;
  padding: 15px 40px;
  
  /* Style Gradient Vàng Đồng */
  background-image: linear-gradient(to right, #D4AF37 0%, #F0E68C 50%, #D4AF37 100%);
  background-size: 200% auto;
  
  border-radius: 25px; 
  
  color: #333; 
  text-decoration: none;
  font-weight: 700;
  font-size: 1.1rem;
  transition: all 0.5s ease-in-out;
  cursor: pointer;
  
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.4);

  &:hover {
    background-position: right center; 
    box-shadow: 0 8px 25px rgba(212, 175, 55, 0.6); 
    transform: translateY(-3px);
  }
`;

const HeroSection: React.FC = () => {
  const { t } = useI18n(); 
  const { scrollYProgress } = useScroll();
  
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%']); 

  const titleVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.05 
      } 
    },
  };

  const charVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  const titleText = t('hero.title');
  // *** LẤY HÌNH ẢNH NỀN ĐỘNG TỪ JSON ***
  const backgroundUrl = t('hero.backgroundUrl') || '/images/hero/hero-background.jpg';

  return (
    <HeroWrapper>
      {/* SỬ DỤNG backgroundUrl ĐỘNG */}
      <BackgroundImage style={{ y, backgroundImage: `url('${backgroundUrl}')` }} /> 

      <ContentBox>
        <Title
          variants={titleVariants}
          initial="hidden"
          animate="visible"
        >
          {titleText.split("").map((char, index) => (
            <motion.span 
              key={index} 
              variants={charVariants} 
              style={{ display: 'inline-block', marginRight: char === ' ' ? '10px' : '0' }}
            >
              {char}
            </motion.span>
          ))}
        </Title>
        
        <Subtitle initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 1.5 } }}>
          {t('hero.subtitle')}
        </Subtitle>
        
        <CtaButton 
          href="#services"
          initial={{ scale: 0.8, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1, transition: { type: 'spring', delay: 2 } }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {t('hero.cta_explore')}
        </CtaButton>
      </ContentBox>
    </HeroWrapper>
  );
};

export default HeroSection;