import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import Button from '../ui/Button'; 
// *** ĐÃ THAY THẾ HÀM MOCK BẰNG IMPORT HOOK THỰC TẾ ***
import { useI18n } from '../../hooks/useI18n'; 
// ******************************************************
import { useRevealAnimation } from '../../hooks/useScrollAnimation';

// Keyframes cho hiệu ứng Lấp lánh (Gold Shimmer)
const shimmer = keyframes`
  0% { transform: translateX(-100%) skewX(-45deg); }
  100% { transform: translateX(100%) skewX(-45deg); }
`;

const CtaWrapper = styled.section`
    position: relative;
    background-color: #1a1a1a; /* NỀN ĐEN VẪN GIỮ NGUYÊN ĐỂ TẠO SỰ NỔI BẬT */
    padding: 150px 80px;
    text-align: center;
    overflow: hidden;

    @media (max-width: 768px) {
      padding: 80px 25px;
    }
`;

const DecorativeShape = styled(motion.div)`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    
    &::before {
        content: '';
        position: absolute;
        top: -50px;
        left: -50px;
        width: 150%;
        height: 150%;
        background: radial-gradient(circle at 50% 50%, rgba(255, 215, 0, 0.2) 0%, transparent 70%); /* Sáng Vàng */
        transform: rotate(30deg);
        opacity: 0.5;
    }
`;

const ContentBox = styled.div`
    position: relative;
    z-index: 10;
`;

const CtaTitle = styled(motion.h2)`
    font-size: 5vw; 
    font-weight: 700;
    color: #FFD700; /* Vàng rực rỡ */
    margin-bottom: 20px;
    line-height: 1.1;
    text-shadow: 0 0 10px rgba(255, 215, 0, 0.5); 

    @media (max-width: 768px) {
      font-size: 10vw;
    }
`;

const CtaSubtitle = styled(motion.p)`
    font-size: 1.5rem;
    color: #ccc; /* Text sáng */
    margin-bottom: 60px;
    max-width: 800px;
    margin: 20px auto 60px;

    @media (max-width: 768px) {
      font-size: 1.1rem;
      margin-bottom: 30px;
    }
`;

// Nút CTA tối thượng: Áp dụng button cơ bản + hiệu ứng lấp lánh
const UltimateCtaButton = styled(Button)`
    position: relative;
    overflow: hidden;
    padding: 18px 45px; 
    font-size: 1.2rem;
    color: #111;
    font-weight: 800;

    &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.4);
        animation: ${shimmer} 3s infinite;
        pointer-events: none;
        mix-blend-mode: screen; 
        opacity: 0;
        transition: opacity 0.5s ease;
    }

    &:hover::after {
        opacity: 1; 
        animation: ${shimmer} 1s infinite; 
    }
`;

// Variants cho từng từ 
const wordVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};


const CallToAction: React.FC = () => {
    const { t } = useI18n(); 
    const { ref, inView } = useRevealAnimation(0.2, true);

    // Animation cho chữ
    const titleVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1, 
            transition: { 
                staggerChildren: 0.1, 
            } 
        },
    };
    
    // Tách chữ thành từng từ
    const titleText = t('cta_final.title');

    return (
        <CtaWrapper ref={ref}>
            <DecorativeShape 
                 initial={{ scale: 0.5, rotate: 0 }}
                 animate={inView ? { scale: 1.2, rotate: 360 } : {}}
                 transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
            <ContentBox>
                <CtaTitle
                    variants={titleVariants}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                >
                     {/* Sử dụng titleText đã dịch */}
                     {titleText.split(" ").map((word, index) => (
                        <motion.span 
                            key={index} 
                            variants={wordVariants} 
                            style={{ display: 'inline-block', marginRight: '15px' }} 
                        >
                            {word}
                        </motion.span>
                    ))}
                </CtaTitle>
                
                <CtaSubtitle
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 1, duration: 0.8 }}
                >
                    {t('cta_final.subtitle')}
                </CtaSubtitle>
            
                {/* FIX: Áp dụng animation props lên motion.div wrapper */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={inView ? { scale: 1, opacity: 1 } : {}}
                    transition={{ delay: 1.5, type: 'spring', stiffness: 200 }}
                    whileHover={{ scale: 1.05 }}
                    // whileTap={{ scale: 0.95 }} <-- whileTap được handle bên trong Button.tsx
                >
                    <UltimateCtaButton 
                        href="/contact" 
                        // Đã xóa các animation props khỏi đây để khắc phục lỗi typing
                    >
                        {t('cta_final.button')}
                    </UltimateCtaButton>
                </motion.div>
            </ContentBox>
        </CtaWrapper>
    );
};

export default CallToAction;