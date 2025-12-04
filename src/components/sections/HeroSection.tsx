import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useI18n } from '../../hooks/useI18n';
import Head from 'next/head';
import Image from 'next/image'; // Đã import Image

// Styled Components (Giữ nguyên)
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
    font-size: 10vw;
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
  const titleVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } }, };
  const charVariants = { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 }, };
  const titleText = t('hero.title');
  const words = titleText.split(" ");
  const backgroundUrl = t('hero.backgroundUrl') || '/images/hero/hero-background.jpg';

  return (
    <>
      <Head>
        <link rel="preload" href={backgroundUrl} as="image" />
      </Head>

      <HeroWrapper>
        {/* --- CẬP NHẬT IMAGE --- */}
        <Image
          src={backgroundUrl}
          alt="Nanky Beauty background"
          fill // Giữ fill
          style={{ objectFit: 'cover', zIndex: 0, filter: 'brightness(0.7)' }} // Giữ style
          quality={70} // Giảm nhẹ quality
          priority // Giữ priority
          sizes="100vw" // === THÊM SIZES === (Ảnh hero chiếm 100% chiều rộng viewport)
        />
        {/* --- KẾT THÚC CẬP NHẬT --- */}

        <ContentBox>
           <Title variants={titleVariants} initial="hidden" animate="visible">
            {words.map((word, wordIndex) => (
              <span key={wordIndex} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
                {word.split("").map((char, charIndex) => (
                  <motion.span key={`${wordIndex}-${charIndex}`} variants={charVariants} style={{ display: 'inline-block' }}>
                    {char}
                  </motion.span>
                ))}
                {wordIndex < words.length - 1 && <>&nbsp;</>}
                {wordIndex === 1 && <br className="mobile-break" style={{ display: 'block' }} />}
              </span>
            ))}
          </Title>
          <Subtitle initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 1.5 } }}>
            {t('hero.subtitle')}
          </Subtitle>
          <CtaButton href="#services" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1, transition: { type: 'spring', delay: 2 } }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            {t('hero.cta_explore')}
          </CtaButton>
        </ContentBox>
      </HeroWrapper>
    </>
  );
};

export default HeroSection;