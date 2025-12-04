import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useI18n } from '../../hooks/useI18n';
import Image from 'next/image'; // Đã import Image

// Styled Components (Giữ nguyên, bao gồm sửa h3)
const ServicesWrapper = styled.section`
  padding: 100px 80px;
  background-color: #fff;
  text-align: center;

  @media (max-width: 768px) {
    padding: 60px 25px;
  }
`;

const SectionTitle = styled(motion.h2)` // Giữ là h2
  font-size: 3rem;
  color: #222;
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
  // Thêm transition cho scale của ảnh con khi hover
  // transition: transform 0.5s ease; // Bỏ vì đặt trên Image

  &:hover .service-card-image { // Target ảnh con qua class name
      transform: scale(1.1);
  }

  @media (max-width: 768px) {
    height: 300px;
  }
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
  z-index: 2; // Nổi trên ảnh
`;

const CardTitle = styled.h3` // Đã là h3
  font-size: 1.8rem;
  margin-bottom: 5px;
  color: #fff;
  line-height: 1.3;

  .gold-overlay & { color: #fff; }
`;

const CardDescription = styled.p`
  font-size: 0.95rem;
  font-weight: 300;
  color: #ccc;
  line-height: 1.5;

  .gold-overlay & { color: #fff; margin-bottom: 10px; }
`;

const CardPrice = styled(motion.p)`
    font-weight: bold;
    color: #f0f0f0;
    margin-top: auto;
`;

const GoldOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(198, 165, 0, 0.85);
  z-index: 3;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 30px;
  text-align: left;
  color: #fff;
  &.gold-overlay { }
`;


const ServicesGrid: React.FC = () => {
  const { t } = useI18n();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const getServiceKeys = () => { /* Giữ nguyên logic */
    const keys = []; let i = 0; while (i < 100) { const titleKey = `service_${i}_title`; const title = t(titleKey); if (typeof title !== 'string' || title.startsWith('[MISSING TRANSLATION:')) { break; } keys.push(i); i++; } return keys;
  };
  const serviceDataKeys = getServiceKeys();

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.3 } } };
  const cardVariants = { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
  const overlayVariants = { initial: { opacity: 0, y: "100%" }, hover: { opacity: 1, y: "0%", transition: { duration: 0.4, ease: "easeInOut" } } };

  return (
    <ServicesWrapper id="services" ref={ref}>
      <SectionTitle initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} >
        {t('header.services')}
      </SectionTitle>
      <GridContainer as={motion.div} variants={containerVariants} initial="hidden" animate={inView ? "visible" : "hidden"} >
        {serviceDataKeys.map((index) => {
          const imageUrl = t(`service_${index}_imageUrl`) || `/images/services/service-${index + 1}.jpg`;
          const title = t(`service_${index}_title`);
          const description = t(`service_${index}_desc`);
          const price = t(`service_${index}_price`);

          return (
            <ServiceCard key={index} variants={cardVariants} initial="initial" whileHover="hover" >
              {imageUrl && typeof imageUrl === 'string' && (
                  // --- SỬA CÚ PHÁP IMAGE ---
                  <Image
                    src={imageUrl}
                    alt={title || `Nanky Beauty Service ${index + 1}`}
                    fill // Thay layout="fill"
                    style={{ objectFit: 'cover', zIndex: 1, transition: 'transform 0.5s ease' }} // Thay objectFit bằng style
                    quality={70}
                    className="service-card-image"
                    // === THÊM SIZES ===
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  // --- KẾT THÚC SỬA ---
              )}
              <GoldOverlay variants={overlayVariants} className="gold-overlay">
                  <CardTitle>{title}</CardTitle>
                  <CardDescription>{description}</CardDescription>
                  <CardPrice initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.3 } }}>
                      {price}
                  </CardPrice>
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