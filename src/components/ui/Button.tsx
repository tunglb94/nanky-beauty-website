import React from 'react';
import styled from 'styled-components';
import { motion, MotionProps } from 'framer-motion';

const StyledGoldComponent = styled(motion.button)`
    padding: 14px 30px; 
    
    /* HIỆU ỨNG GRADIENT VÀ BO TRÒN */
    background-image: linear-gradient(to right, #D4AF37 0%, #F0E68C 50%, #D4AF37 100%);
    background-size: 200% auto; 
    border-radius: 25px;
    border: none; 
    
    /* FONT FIX: SỬ DỤNG FONT INTER */
    font-family: 'Inter', sans-serif;
    color: #333;
    font-size: 1rem;
    font-weight: 700;
    text-transform: uppercase;
    
    cursor: pointer;
    letter-spacing: 1px;
    transition: all 0.5s ease-in-out; 
    box-shadow: 0 4px 15px rgba(212, 175, 55, 0.4); 
    
    /* Thêm các thuộc tính này để thẻ 'a' hiển thị đúng */
    display: inline-block;
    text-align: center;
    text-decoration: none;
    
    &:hover {
        background-position: right center; 
        color: #111;
        transform: translateY(-3px);
        box-shadow: 0 8px 25px rgba(212, 175, 55, 0.6); 
    }
    
    &:active {
        transform: translateY(0);
        box-shadow: 0 2px 10px rgba(212, 175, 55, 0.3);
    }
`;

// Định nghĩa props cơ bản mà cả hai loại đều có
type BaseProps = {
    children: React.ReactNode;
} & MotionProps;

// Trường hợp 1: Component là một nút <button>
// Nó có tất cả thuộc tính của button, nhưng không có href
type ButtonAsButton = BaseProps & {
    as?: 'button';
    href?: never;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'as'>;

// Trường hợp 2: Component là một liên kết <a>
// Nó bắt buộc phải có href và có tất cả thuộc tính của anchor
type ButtonAsLink = BaseProps & {
    as: 'a';
    href: string;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'as'>;

// Gộp 2 trường hợp lại
type ButtonProps = ButtonAsButton | ButtonAsLink;

const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
    const commonProps = {
        whileTap: { scale: 0.95 },
        ...props,
    };

    return <StyledGoldComponent {...commonProps}>{children}</StyledGoldComponent>;
};

export default Button;