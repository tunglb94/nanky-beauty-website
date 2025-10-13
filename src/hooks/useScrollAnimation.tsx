import { useScroll, useTransform, MotionValue } from 'framer-motion';
import { RefObject } from 'react';
import { useInView } from 'react-intersection-observer';

interface ScrollAnimationProps {
    ref?: RefObject<HTMLElement>;
    yRange?: [number, number]; // Phạm vi cuộn y (ví dụ: [0, 100] cho 100px di chuyển)
    inViewThreshold?: number; // Ngưỡng kích hoạt animation khi cuộn đến
}

// Hàm cung cấp giá trị cho hiệu ứng Parallax dựa trên cuộn toàn trang
export const useParallaxScroll = (yRange: [number, number] = [0, 200]): MotionValue<number> => {
    const { scrollYProgress } = useScroll();
    
    // Áp dụng biến đổi từ 0 (đầu trang) đến 1 (cuối trang) thành phạm vi Y mong muốn
    const y = useTransform(scrollYProgress, [0, 1], yRange);

    return y;
};

// Hàm cung cấp trạng thái cho hiệu ứng Reveal (Fade-up, Slide-in) khi phần tử hiển thị
export const useRevealAnimation = (threshold: number = 0.2, triggerOnce: boolean = true) => {
    const [ref, inView] = useInView({
        triggerOnce: triggerOnce, 
        threshold: threshold,     // Kích hoạt khi bao nhiêu phần trăm component hiển thị
    });

    const variants = {
        hidden: { opacity: 0, y: 50 },
        visible: { 
            opacity: 1, 
            y: 0, 
            transition: { 
                duration: 0.8, 
                ease: [0.25, 0.46, 0.45, 0.94] // Custom cubic-bezier cho sự mượt mà
            } 
        },
    };
    
    // Trả về ref để gắn vào component và trạng thái inView
    return { ref, inView, variants };
};