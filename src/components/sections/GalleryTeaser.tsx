import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useI18n } from '../../hooks/useI18n'; // Thêm import hook

const GalleryTeaserWrapper = styled.section`
// ... (omitted for brevity)
`;

const TeaserTitle = styled.h3`
// ... (omitted for brevity)
`;

const ImageGrid = styled.div`
// ... (omitted for brevity)
`;

const ImageItem = styled(motion.div)`
// ... (omitted for brevity)
`;

const GalleryTeaser: React.FC = () => {
    const { t } = useI18n();
    
    // *** Sửa: Lấy ảnh động từ JSON, fallback về ảnh mặc định ***
    const images = [
        t('gallery_teaser_image_0') || '/images/gallery/mi-volume.jpg',
        t('gallery_teaser_image_1') || '/images/gallery/mi-classic.jpg',
        t('gallery_teaser_image_2') || '/images/gallery/mi-hybrid.jpg',
        t('gallery_teaser_image_3') || '/images/gallery/mi-style.jpg',
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
                Bộ Sưu Tập Tác Phẩm Nối Mi
            </TeaserTitle>
            <ImageGrid>
                {images.map((src, index) => (
                    <ImageItem 
                        key={index}
                        variants={imageVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ delay: index * 0.15 }} // Hiệu ứng xuất hiện nối tiếp
                        onClick={() => window.location.href = '/gallery'}
                    >
                        <img src={src} alt={`Mi Nanky Beauty ${index + 1}`} />
                    </ImageItem>
                ))}
            </ImageGrid>
        </GalleryTeaserWrapper>
    );
};

export default GalleryTeaser;