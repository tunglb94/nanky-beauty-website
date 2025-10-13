import React from 'react';
import styled from 'styled-components';
// Giả định sử dụng thư viện icon (ví dụ: react-icons)
// import { FaStar, FaDiamond, FaSpa } from 'react-icons/fa';

const IconWrapper = styled.div`
    color: #C6A500; /* Vàng Đồng */
    font-size: 2.5rem;
    line-height: 1;
`;

// Để đơn giản, ta sẽ dùng ký tự/placeholder
const IconMap: { [key: string]: React.ReactNode } = {
    star: <span role="img" aria-label="star">★</span>,
    diamond: <span role="img" aria-label="diamond">💎</span>,
    spa: <span role="img" aria-label="spa">🧖‍♀️</span>,
};

interface GoldIconProps {
    name: 'star' | 'diamond' | 'spa' | string;
    className?: string;
}

const GoldIcon: React.FC<GoldIconProps> = ({ name, className }) => {
    const IconComponent = IconMap[name] || <span role="img" aria-label="default">✦</span>;

    return (
        <IconWrapper className={className}>
            {IconComponent}
        </IconWrapper>
    );
};

export default GoldIcon;