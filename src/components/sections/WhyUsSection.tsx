import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useI18n } from '../../hooks/useI18n';
import Image from 'next/image'; // === IMPORT Image ===

const WhyUsWrapper = styled.section`
  padding: 100px 80px;
  background-color: #f7f7f7;
  text-align: center;

  @media (max-width: 768px) {
    padding: 60px 25px;
  }
`;

const SectionTitle = styled(motion.h2)`
  font-size: 3rem;
  color: #222;
  margin-bottom: 20px;
  position: relative;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled(motion.p)`
    font-size: 1.2rem;
    color: #666;
    margin-bottom: 60px;
`;

const CardsContainer = styled.div`
  display: flex;
  gap: 40px;
  justify-content: center;
  align-items: flex-start;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 30px;
  }
`;

const Card = styled(motion.div)`
  flex-basis: 30%;
  padding: 0;
  background-color: #fff;
  border: 1px solid #eee;
  border-top: 5px solid #C6A500;
  border-radius: 12px;
  box-shadow: 0 0 0 1px rgba(198, 165, 0, 0.3),
              0 5px 25px rgba(0, 0, 0, 0.08);
  text-align: left;
  min-height: 250px;
  overflow: hidden; // Quan trọng cho hiệu ứng scale ảnh
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.03);
    box-shadow: 0 0 0 3px rgba(198, 165, 0, 0.6), 0 8px 30px rgba(0, 0, 0, 0.15);
  }

  // Target ảnh bên trong Card khi Card được hover
  &:hover .why-us-card-image {
     transform: scale(1.1);
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
    height: 180px; // Giữ chiều cao cố định
    overflow: hidden; // Cắt ảnh nếu nó scale ra ngoài
    margin-bottom: 20px;
    position: relative; // Cần thiết cho Image fill
`;

const CardContent = styled.div`
    padding: 0 40px 40px 40px;
`;

// --- SỬA HEADING ORDER: Đổi thành h3 và bỏ 'as' prop ---
const CardTitle = styled.h3`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 10px;
`;

const CardDescription = styled.p`
  font-size: 1rem;
  color: #666;
`;

const WhyUsSection: React.FC = () => {
  const { t } = useI18n();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

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
          const imageUrl = t(`${baseKey}.imageUrl`);
          const title = t(`${baseKey}.title`); // Lấy title để dùng làm alt

          return (
            <Card
              key={index}
              variants={cardVariants}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              transition={{ delay: index * 0.2 + 0.5 }}
            >
              {imageUrl && typeof imageUrl === 'string' && (
                  <CardImageContainer>
                      {/* --- SỬA CÚ PHÁP IMAGE --- */}
                      <Image
                          src={imageUrl}
                          alt={title || `Nanky Beauty Feature ${index + 1}`}
                          fill // Thay layout="fill"
                          style={{ objectFit: 'cover', transition: 'transform 0.4s ease' }} // Thay objectFit bằng style
                          quality={75}
                          className="why-us-card-image"
                          // === THÊM SIZES ===
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      {/* --- KẾT THÚC SỬA --- */}
                  </CardImageContainer>
              )}

              <CardContent>
                  {/* Bỏ 'as' prop */}
                  <CardTitle>{title}</CardTitle>
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