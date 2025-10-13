import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useRevealAnimation } from '../../hooks/useScrollAnimation'; 
// *** ĐÃ THAY THẾ HÀM MOCK BẰNG IMPORT HOOK THỰC TẾ ***
import { useI18n } from '../../hooks/useI18n'; 
// ******************************************************

// Dữ liệu mẫu (6 cảm nhận chi tiết) - Đã thay đổi để chỉ lưu key và default URL
const TESTIMONIALS = [
    { id: 1, key: 'review_1', date: "20/07/2025", stars: 5, defaultImageUrl: "/images/reviews/review-1.jpg" }, 
    { id: 2, key: 'review_2', date: "15/06/2025", stars: 5, defaultImageUrl: "/images/reviews/review-2.jpg" },
    { id: 3, key: 'review_3', date: "01/05/2025", stars: 5, defaultImageUrl: "/images/reviews/review-3.jpg" },
    { id: 4, key: 'review_4', date: "10/04/2025", stars: 5, defaultImageUrl: "/images/reviews/review-4.jpg" },
    { id: 5, key: 'review_5', date: "25/03/2025", stars: 5, defaultImageUrl: "/images/reviews/review-5.jpg" },
    { id: 6, key: 'review_6', date: "05/03/2025", stars: 5, defaultImageUrl: "/images/reviews/review-6.jpg" }
];

const TestimonialsWrapper = styled.section`
  /* *** NỀN SÁNG OFF-WHITE MỚI *** */
  padding: 100px 80px;
  background-color: #F9F9F9;
  text-align: center;

  @media (max-width: 768px) {
    padding: 60px 25px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 3rem;
  color: #222; /* Dark Text */
  margin-bottom: 60px;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
    margin-bottom: 40px;
  }
`;

const TestimonialsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr); 
  gap: 30px; 
  text-align: left;

  /* *** MOBILE OPTIMIZATION: 1 CỘT *** */
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 30px;
    max-width: 500px;
    margin: 0 auto;
  }
`;

const TestimonialCard = styled(motion.div)`
  padding: 0;
  background-color: #fff; /* Giữ card màu trắng */
  border-radius: 8px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08); /* Đổ bóng nhẹ nhàng */
  overflow: hidden; 
  cursor: pointer;
  
  display: grid;
  grid-template-columns: 1fr; 
  height: auto; 
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  }
`;

const CardImage = styled.div`
    overflow: hidden;
    height: 200px; 
    
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.4s ease;
    }
    
    @media (max-width: 768px) {
        height: 150px;
    }
`;

const CardContent = styled.div`
    padding: 25px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    text-align: left;
    border-top: 3px solid #C6A500; /* Vàng Đồng */
    min-height: 250px;
`;

const ReviewHeader = styled.div`
    width: 100%;
    margin-bottom: 10px;
`;

const QuoteText = styled.p`
  font-size: 1rem;
  font-style: italic;
  color: #555; 
  margin-bottom: 20px;
`;

const CustomerName = styled.h4`
  font-size: 1.1rem;
  font-weight: 600;
  color: #C6A500; /* Vàng Đồng */
  margin-top: 5px;
`;

const ReviewDate = styled.p`
    font-size: 0.85rem;
    color: #999;
    margin-bottom: 10px;
`;

const StarRating = styled.div`
    color: gold;
    font-size: 1.2rem;
`;


const Testimonials: React.FC = () => {
    const { t } = useI18n(); // SỬ DỤNG HOOK THỰC TẾ
    const { ref, inView } = useRevealAnimation(0.1, true); 

    // Variants cho từng card (Slide-up effect)
    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: (i: number) => ({
            opacity: 1, 
            y: 0, 
            transition: { 
                delay: i * 0.15, 
                duration: 0.6 
            }
        }),
    };

    return (
        <TestimonialsWrapper id="testimonials">
            <SectionTitle>{t('testimonials_title') || 'Cảm Nhận Khách Hàng'}</SectionTitle>

            <TestimonialsGrid ref={ref}>
                {TESTIMONIALS.map((review, index) => {
                    // *** LẤY HÌNH ẢNH ĐỘNG TỪ JSON ***
                    const imageUrl = t(`${review.key}_imageUrl`) || review.defaultImageUrl;
                    const customerName = t(`${review.key}_name`);
                    
                    return (
                        <TestimonialCard
                            key={review.id}
                            variants={cardVariants}
                            initial="hidden"
                            animate={inView ? "visible" : "hidden"}
                            custom={index}
                        >
                            <CardImage>
                                {/* SỬ DỤNG imageUrl ĐỘNG */}
                                <img src={imageUrl} alt={`Đánh giá của khách hàng ${customerName} về nối mi tại Nanky Beauty`} />
                            </CardImage>
                            <CardContent>
                                <ReviewHeader>
                                    <StarRating>{"⭐".repeat(review.stars)}</StarRating>
                                    <ReviewDate>{review.date}</ReviewDate>
                                </ReviewHeader>
                                
                                <QuoteText>"{t(`${review.key}_quote`)}"</QuoteText>
                                <CustomerName>- {customerName}</CustomerName>
                            </CardContent>
                        </TestimonialCard>
                    )
                })}
            </TestimonialsGrid>
        </TestimonialsWrapper>
    );
};

export default Testimonials;