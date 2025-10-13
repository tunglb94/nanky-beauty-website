import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer'; 
// *** ĐÃ THAY THẾ HÀM MOCK BẰNG IMPORT HOOK THỰC TẾ ***
import { useI18n } from '../../hooks/useI18n'; 
// ******************************************************


// Dữ liệu giả (Chỉ dùng để xác định số lượng lặp)
const SERVICE_DATA_KEYS = [0, 1, 2, 3]; 

const ServicesWrapper = styled.section`
  /* *** NỀN TRẮNG TINH MỚI *** */
  padding: 100px 80px;
  background-color: #fff;
  text-align: center;

  @media (max-width: 768px) {
    padding: 60px 25px;
  }
`;

const SectionTitle = styled(motion.h2)`
  font-size: 3rem;
  color: #222; /* Dark Text */
  margin-bottom: 80px;
  position: relative;

  @media (max-width: 768px) {
    font-size: 2.5rem;
    margin-bottom: 40px;
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;

  /* *** MOBILE OPTIMIZATION: 1 CỘT *** */
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    max-width: 500px;
    margin: 0 auto;
  }
`;

const ServiceCard = styled(motion.div)`
  position: relative;
  height: 400px;
  overflow: hidden;
  border-radius: 6px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1); 
  cursor: pointer;
`;

const CardContent = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 30px;
  text-align: left;
  color: #fff;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0) 100%); 
  transition: background 0.3s ease;
  z-index: 2;
`;

const CardTitle = styled.h4`
  font-size: 1.8rem;
  margin-bottom: 5px;
  color: #fff;
`;

const CardDescription = styled.p`
  font-size: 0.95rem;
  font-weight: 300;
  color: #ccc; 
`;

// Hiệu ứng "Mask Reveal" - Lớp phủ Vàng Đồng
const GoldOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(198, 165, 0, 0.85); /* Vàng Đồng */
  z-index: 3;
`;

const CardImage = styled.div`
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  transition: transform 0.5s ease;
  
  ${ServiceCard}:hover & {
    transform: scale(1.1);
  }
`;

const ServicesGrid: React.FC = () => {
  const { t } = useI18n(); 
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.2, delayChildren: 0.3 } 
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  
  // Biến thể cho hiệu ứng Mask Reveal
  const overlayVariants = {
      initial: { opacity: 0, y: "100%" },
      hover: { opacity: 1, y: "0%", transition: { duration: 0.4, ease: "easeInOut" } }
  };

  return (
    <ServicesWrapper id="services" ref={ref}>
      <SectionTitle
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
      >
        {t('header.services')}
      </SectionTitle>

      <GridContainer 
        as={motion.div}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        {SERVICE_DATA_KEYS.map((index) => {
          // *** LẤY DỮ LIỆU ĐỘNG TỪ JSON ***
          const imageUrl = t(`service_${index}_imageUrl`) || `/images/services/service-${index + 1}.jpg`;
          const title = t(`service_${index}_title`);
          const description = t(`service_${index}_desc`);
          const price = t(`service_${index}_price`);
            
          return (
            <ServiceCard 
              key={index} 
              variants={cardVariants}
              initial="initial"
              whileHover="hover"
            >
              {/* SỬ DỤNG imageUrl ĐỘNG */}
              <CardImage style={{ backgroundImage: `url('${imageUrl}')` }} />
              
              <GoldOverlay variants={overlayVariants}>
                  <CardContent style={{ background: 'none', color: '#fff' }}>
                      <CardTitle style={{ color: '#fff' }}>{title}</CardTitle>
                      <CardDescription style={{ color: '#fff' }}>{description}</CardDescription>
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.3 } }}>
                          {price}
                      </motion.p>
                  </CardContent>
              </GoldOverlay>
              
              <CardContent>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardContent>
            </ServiceCard>
          );
        })}
      </GridContainer>
    </ServicesWrapper>
  );
};

export default ServicesGrid;