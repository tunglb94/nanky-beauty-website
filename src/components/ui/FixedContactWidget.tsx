import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, TargetAndTransition, VariantLabels } from 'framer-motion';
import { useI18n } from '../../hooks/useI18n';
import Image from 'next/image'; // Đã import Image

// Keyframes và Interfaces (Giữ nguyên)
const tada = keyframes`
  0% { transform: scale(1); }
  10%, 20% { transform: scale(0.9) rotate(-3deg); }
  30%, 50%, 70%, 90% { transform: scale(1.1) rotate(3deg); }
  40%, 60%, 80% { transform: scale(1.1) rotate(-3deg); }
  100% { transform: scale(1) rotate(0); }
`;
const softPulseScale = keyframes`
  0% { transform: scale(1); box-shadow: 0 4px 18px rgba(0, 0, 0, 0.4); }
  50% { transform: scale(1.05); box-shadow: 0 6px 22px rgba(255, 215, 0, 0.6); }
  100% { transform: scale(1); box-shadow: 0 4px 18px rgba(0, 0, 0, 0.4); }
`;
const shimmer = keyframes`/* ... */`; // Giả định keyframe shimmer đã được định nghĩa
interface IconLinkProps { $bgColor?: string; $gradient?: string; $isImage?: boolean; }
interface ContactLink { name: string; href: string; icon: React.ReactNode; className?: string; whileHover?: TargetAndTransition | VariantLabels; bgColor?: string; gradient?: string; isImage?: boolean; iconSrc?: string; }


// Styled Components (Giữ nguyên)
const WidgetWrapper = styled.div`
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (max-width: 768px) {
    right: 15px;
    bottom: 15px;
  }
`;

const IconLink = styled(motion.a)<IconLinkProps>`
  position: relative; // Cần thiết cho Image fill
  display: flex;
  justify-content: center;
  align-items: center;
  width: 58px;
  height: 58px;
  border-radius: 50%;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.4);
  text-decoration: none;
  overflow: hidden; // Cần thiết cho Image fill

  background-color: ${props => props.$bgColor || 'transparent'};
  background-image: ${props => props.$gradient || 'none'};
  color: white;

  svg {
    width: 26px;
    height: 26px;
    fill: white;
    z-index: 10; // Đảm bảo SVG nổi trên Image nếu không phải ảnh nền
  }

  &.call-button {
    animation: ${tada} 4s ease-in-out infinite 2s, ${softPulseScale} 1.5s ease-in-out infinite;
    background-image: linear-gradient(135deg, #FFD700 0%, #C6A500 100%);

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 150%;
        height: 150%;
        background: rgba(255, 255, 255, 0.5);
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
    }
    &:hover::before {
        opacity: 1;
        animation: none;
    }
  }
`;


const FixedContactWidget: React.FC = () => {
  const { t } = useI18n();

  const hotlineRaw = t('footer.hotline');
  const phoneNumber = typeof hotlineRaw === 'string' ? hotlineRaw.replace(/[^\d]/g, '') : '0852759678';

  const contactLinks: ContactLink[] = [
    {
        name: 'Call',
        href: `tel:${phoneNumber}`,
        icon: ( <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M497.39 361.8l-112-48a24 24 0 0 0-28 6.9l-49.6 60.6A370.66 370.66 0 0 1 130.6 204.11l60.6-49.6a23.94 23.94 0 0 0 6.9-28l-48-112A24.16 24.16 0 0 0 122.6.61l-104 24A24 24 0 0 0 0 48c0 256.5 207.9 464 464 464a24 24 0 0 0 23.4-18.6l24-104a24.29 24.29 0 0 0-14.01-27.6z"/></svg> ),
        className: 'call-button',
        bgColor: '#FFD700',
        whileHover: { scale: 1.15, rotate: 360, transition: { type: "spring", stiffness: 300, damping: 15 } }
    },
    {
        name: 'Zalo',
        href: `https://zalo.me/${phoneNumber}`,
        isImage: true,
        icon: null,
        iconSrc: '/images/uploads/icon-zalo.png',
        bgColor: 'white',
        whileHover: { scaleX: 1.1, scaleY: 0.9, transition: { type: "spring", stiffness: 500, damping: 10, duration: 0.1 } }
    },
    {
        name: 'Messenger',
        href: 'https://m.me/nanky.beaute',
        isImage: true,
        icon: null,
        iconSrc: '/images/uploads/mess.png',
        bgColor: '#A83DFF',
        whileHover: { scale: 1.1, rotateY: 180, transition: { type: "spring", stiffness: 300, damping: 15 } }
    },
  ];

  return (
    <WidgetWrapper>
      {contactLinks.map((link) => (
        <IconLink
          key={link.name}
          href={link.href}
          $bgColor={link.bgColor}
          $gradient={link.gradient}
          $isImage={link.isImage}
          className={link.className}
          target="_blank"
          rel="noopener noreferrer"
          whileTap={{ scale: 0.9 }}
          whileHover={link.whileHover}
          title={`Liên hệ qua ${link.name}`}
        >
          {link.isImage && link.iconSrc ? (
            // --- SỬA CÚ PHÁP IMAGE ---
            <Image
              src={link.iconSrc}
              alt={`${link.name} Contact`}
              fill // Thay thế layout="fill"
              style={{ objectFit: 'cover' }} // Thay thế objectFit bằng style
              sizes="58px" // === THÊM SIZES === (Kích thước cố định)
              quality={60} // Có thể giảm quality cho icon PNG
            />
            // --- KẾT THÚC SỬA ---
          ) : (
            link.icon // Render SVG
          )}
        </IconLink>
      ))}
    </WidgetWrapper>
  );
};

export default FixedContactWidget;