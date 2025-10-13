import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useI18n } from '../../hooks/useI18n';

const GalleryTeaserWrapper = styled.section`
    padding: 100px 80px;
    background-color: #f9f9f9;
    text-align: center;
`;

const TeaserTitle = styled.h2`
    font-size: 3rem;
    color: #222;
    margin-bottom: 60px;
`;

const ImageGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;

    @media (max-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
    }
`;

const ImageItem = styled(motion.div)`
    height: 400px;
    overflow: hidden;
    border-radius: 8px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    cursor: pointer;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;
    }

    &:hover img {
        transform: scale(1.05);
    }
`;

const GalleryTeaser: React.FC = () => {
    const { t } = useI18n();
    
    const images = [
        { src: t('gallery_teaser_image_0') || '/images/gallery/mi-volume.jpg', alt: 'Feedback nối mi volume tại Quận 2' },
        { src: t('gallery_teaser_image_1') || '/images/gallery/mi-classic.jpg', alt: 'Feedback nối mi classic tại Thảo Điền' },
        { src: t('gallery_teaser_image_2') || '/images/gallery/mi-hybrid.jpg', alt: 'Feedback nối mi hybrid tại TP.HCM' },
        { src: t('gallery_teaser_image_3') || '/images/gallery/mi-style.jpg', alt: 'Feedback khách hàng Nanky Beauty' },
    ];

    const imageVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { 
            opacity: 1, 
            y: 0, 
            transition: { duration: 0.8, ease: "easeOut" } 
        },
    };

    return (
        <GalleryTeaserWrapper id="gallery-teaser">
            <TeaserTitle>
                Feedback Từ Khách Hàng
            </TeaserTitle>
            <ImageGrid>
                {images.map((image, index) => (
                    <ImageItem 
                        key={index}
                        variants={imageVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ delay: index * 0.15 }}
                        onClick={() => window.location.href = '/gallery'}
                    >
                        <img src={image.src} alt={image.alt} />
                    </ImageItem>
                ))}
            </ImageGrid>
        </GalleryTeaserWrapper>
    );
};

export default GalleryTeaser;