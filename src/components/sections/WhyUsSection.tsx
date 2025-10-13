import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer'; 
// *** ĐÃ THAY THẾ HÀM MOCK BẰNG IMPORT HOOK THỰC TẾ ***
import { useI18n } from '../../hooks/useI18n'; 
// ******************************************************


// Dữ liệu mock (Cần cập nhật đường dẫn import viData nếu đã di chuyển vi.json)
// import { default as viData } from '../../locales/vi.json'; // ĐÃ XÓA

const WhyUsWrapper = styled.section`
  /* *** NỀN SÁNG OFF-WHITE MỚI *** */
  padding: 100px 80px;
  background-color: #f7f7f7; 
  text-align: center;
  
  @media (max-width: 768px) {
    padding: 60px 25px;
  }
`;

const SectionTitle = styled(motion.h2)`
  font-size: 3rem;
  color: #222; /* Dark Text */
  margin-bottom: 20px;
  position: relative;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled(motion.p)`
    font-size: 1.2rem;
    color: #666; /* Dark Text */
    margin-bottom: 60px;
`;

const CardsContainer = styled.div`
  display: flex;
  gap: 40px;
  justify-content: center;
  align-items: flex-start;

  /* *** MOBILE OPTIMIZATION: STACK CARDS *** */
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 30px;
  }
`;

const Card = styled(motion.div)`
  flex-basis: 30%;
  padding: 0;
  background-color: #fff; /* Giữ card màu trắng */
  border: 1px solid #eee;
  border-top: 5px solid #C6A500; /* Vàng Đồng */
  
  /* CẬP NHẬT BO TRÒN VÀ ĐỔ BÓNG/SÁNG VIỀN CHO NỀN SÁNG */
  border-radius: 12px; 
  box-shadow: 0 0 0 1px rgba(198, 165, 0, 0.3), /* Viền sáng Vàng mỏng */
              0 5px 25px rgba(0, 0, 0, 0.08); /* Đổ bóng nhẹ nhàng */
  
  text-align: left;
  min-height: 250px;
  overflow: hidden; 
  transition: all 0.3s ease;
  
  /* Hover effect */
  &:hover {
    transform: scale(1.03); 
    box-shadow: 0 0 0 3px rgba(198, 165, 0, 0.6), 0 8px 30px rgba(0, 0, 0, 0.15); /* Viền vàng nổi bật */
  }

  @media (max-width: 768px) {
    min-height: auto;
    flex-basis: 100%;
    margin: 0 auto;
    max-width: 500px;
  }
`;

const CardImageContainer = styled.div`
    width: 100%;
    height: 180px; 
    overflow: hidden;
    margin-bottom: 20px;
    
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.4s ease;
    }
    
    ${Card}:hover & img {
        transform: scale(1.1); 
    }
`;

const CardContent = styled.div`
    padding: 0 40px 40px 40px; 
`;

const CardTitle = styled.h4`
  font-size: 1.5rem;
  color: #333; /* Giữ màu tối trên nền trắng */
  margin-bottom: 10px;
`;

const CardDescription = styled.p`
  font-size: 1rem;
  color: #666; /* Giữ màu xám trên nền trắng */
`;

const WhyUsSection: React.FC = () => {
  const { t } = useI18n();
  const [ref, inView] = useInView({
    triggerOnce: true, 
    threshold: 0.2,    
  });

  // DỮ LIỆU CARD CHỈ CẦN KEY VÌ TOÀN BỘ NỘI DUNG VÀ URL ĐƯỢC LẤY QUA t()
  const sectionDataKeys = [
    { key: 'cards.0' },
    { key: 'cards.1' },
    { key: 'cards.2' }
  ];


  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.6, 
        ease: 'easeOut' 
      } 
    },
  };

  return (
    <WhyUsWrapper ref={ref}>
      <SectionTitle
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
      >
        {t('why_us.title')}
      </SectionTitle>
      <Subtitle
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.3 }}
      >
        {t('why_us.subtitle')}
      </Subtitle>

      <CardsContainer>
        {sectionDataKeys.map((card, index) => {
          const baseKey = `why_us.${card.key}`;
          // *** LẤY HÌNH ẢNH ĐỘNG TỪ JSON QUA t() ***
          const imageUrl = t(`${baseKey}.imageUrl`);

          return (
            <Card
              key={index}
              variants={cardVariants}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              transition={{ delay: index * 0.2 + 0.5 }} 
              whileHover={{ scale: 1.03, boxShadow: '0 0 0 3px rgba(198, 165, 0, 0.6), 0 8px 30px rgba(0, 0, 0, 0.15)' }}
            >
              {imageUrl && (
                  <CardImageContainer>
                      <img src={imageUrl} alt={t(`${baseKey}.title`)} /> 
                  </CardImageContainer>
              )}
              
              <CardContent>
                  <CardTitle>{t(`${baseKey}.title`)}</CardTitle>
                  <CardDescription>{t(`${baseKey}.description`)}</CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </CardsContainer>
    </WhyUsWrapper>
  );
};

export default WhyUsSection;