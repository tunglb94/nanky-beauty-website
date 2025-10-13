import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const CardContainer = styled(motion.div)`
    padding: 30px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
    border: 1px solid #eee;
    text-align: center;
    max-width: 400px;
    margin: 20px auto;
    
    // Hiệu ứng viền vàng tinh tế khi hover
    &:hover {
        border-color: #C6A500; 
    }
`;

const QuoteText = styled.p`
    font-family: 'Lora', serif;
    font-style: italic;
    font-size: 1.1rem;
    color: #555;
    margin-bottom: 20px;
`;

const CustomerInfo = styled.div`
    margin-top: 15px;
`;

const CustomerName = styled.h5`
    font-weight: 600;
    color: #333;
    font-size: 1rem;
`;

const StarRating = styled.div`
    color: #FFD700;
    font-size: 1.2rem;
    margin-bottom: 5px;
`;

interface TestimonialCardProps {
    quote: string;
    name: string;
    stars: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ quote, name, stars }) => {
    const starIcons = '⭐'.repeat(stars);

    return (
        <CardContainer
            whileHover={{ scale: 1.02 }} // Hiệu ứng zoom nhẹ
        >
            <StarRating>{starIcons}</StarRating>
            <QuoteText>"{quote}"</QuoteText>
            <CustomerInfo>
                <CustomerName>- {name}</CustomerName>
            </CustomerInfo>
        </CardContainer>
    );
};

export default TestimonialCard;