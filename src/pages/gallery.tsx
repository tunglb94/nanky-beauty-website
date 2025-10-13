import React, { useState } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '../hooks/useI18n';
import type { GetServerSideProps } from 'next';

// Import Lightbox
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

// Import Carousel
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

// Styled components
const PageWrapper = styled.div`
    padding-top: 80px;
`;

const PageTitle = styled.h1`
    font-family: 'Playfair Display', serif;
    font-size: 4rem;
    color: #C6A500;
    text-align: center;
    padding: 60px 20px 20px;
    background-color: #F9F9F9;
    margin-bottom: 40px;

    @media (max-width: 768px) {
        font-size: 2.5rem;
    }
`;

const FullGalleryGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 30px;
    padding: 40px 80px 100px;

    @media (max-width: 768px) {
        padding: 40px 25px;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    }
`;

const ItemOverlay = styled(motion.div)`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 25px 20px;
    color: white;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.8) 60%, transparent 100%);
    text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.8);
    transform: translateY(30%);
    opacity: 0;
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);

    .info-line {
        margin: 0 0 8px;
        font-size: 1rem;
        color: #FFD700;
        font-weight: 500;
    }

    h4 {
        margin: 0;
        font-size: 2rem;
        font-weight: 700;
        color: #FFFFFF;
        line-height: 1.2;
    }
`;

const GalleryItem = styled(motion.div)`
    position: relative;
    height: 450px;
    border-radius: 8px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    overflow: hidden;
    cursor: pointer;
    background-color: #fff;
    
    .carousel-wrapper {
        width: 100%;
        height: 100%;
        transition: transform 0.4s ease;
    }
    
    .carousel .slide img {
        height: 450px;
        object-fit: cover;
    }
    
    &:hover {
        .carousel-wrapper {
            transform: scale(1.05);
        }
        ${ItemOverlay} {
            transform: translateY(0);
            opacity: 1;
        }
    }
`;

// Interfaces
interface GalleryProject {
  id: string;
  mainImage: string;
  additionalImages: string[];
  alt: string;
  category: string;
  customerName: string;
  serviceDate: string;
  satisfaction: number;
}

interface GalleryPageProps {
    galleryProjects: GalleryProject[];
}

const GalleryPage: React.FC<GalleryPageProps> = ({ galleryProjects = [] }) => {
    const { t } = useI18n();
    const [open, setOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const allImagesForLightbox = galleryProjects.flatMap(p => 
        [p.mainImage, ...(p.additionalImages || [])].map(src => ({ src }))
    );
    
    const findGlobalIndex = (projectIndex: number) => {
        let globalIndex = 0;
        for (let i = 0; i < projectIndex; i++) {
            globalIndex += 1 + (galleryProjects[i].additionalImages?.length || 0);
        }
        return globalIndex;
    }

    const handleItemClick = (projectIndex: number, carouselIndex: number = 0) => {
        let globalIndex = findGlobalIndex(projectIndex);
        globalIndex += carouselIndex;
        setCurrentIndex(globalIndex);
        setOpen(true);
    };

    const pageTitleText = "Hình ảnh Feedback của Nanky Beauty";

    return (
        <>
            <Head>
                <title>{pageTitleText} | Nối Mi Quận 2</title>
                <meta name="description" content={`Xem hình ảnh feedback chân thực từ khách hàng đã trải nghiệm dịch vụ nối mi classic, volume, hybrid tại Nanky Beauty, Thảo Điền, Quận 2, TP.HCM.`} />
            </Head>

            <Header />
            <PageWrapper>
                <PageTitle>{pageTitleText}</PageTitle>
                <FullGalleryGrid>
                    <AnimatePresence>
                        {(galleryProjects || []).map((project, index) => {
                            const imagesForCarousel = [project.mainImage, ...(project.additionalImages || [])].filter(Boolean);
                            const formattedDate = new Date(project.serviceDate).toLocaleDateString('vi-VN');

                            return (
                                <GalleryItem
                                    key={project.id}
                                    layout
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -50 }}
                                    transition={{ delay: index * 0.1, duration: 0.5 }}
                                    onClick={() => handleItemClick(index)}
                                >
                                    <div className="carousel-wrapper">
                                        <Carousel
                                            showArrows={imagesForCarousel.length > 1}
                                            showStatus={false}
                                            showIndicators={imagesForCarousel.length > 1}
                                            showThumbs={false}
                                            infiniteLoop={true}
                                            autoPlay={imagesForCarousel.length > 1}
                                            interval={4000 + Math.random() * 2000}
                                            stopOnHover={true}
                                            swipeable={true}
                                            emulateTouch={true}
                                            onClickItem={(carouselIndex) => handleItemClick(index, carouselIndex)}
                                        >
                                            {imagesForCarousel.map((imgSrc, imgIdx) => (
                                                <div key={imgIdx}>
                                                    <img src={imgSrc} alt={`${project.alt} - Ảnh ${imgIdx + 1}`} />
                                                </div>
                                            ))}
                                        </Carousel>
                                    </div>

                                    <ItemOverlay>
                                        <p className="info-line">
                                            {formattedDate} - {'⭐'.repeat(project.satisfaction)}
                                        </p>
                                        <h4>{project.customerName || "Khách hàng"}</h4>
                                    </ItemOverlay>
                                </GalleryItem>
                            );
                        })}
                    </AnimatePresence>
                </FullGalleryGrid>
            </PageWrapper>
            <Footer />

            <Lightbox
                open={open}
                close={() => setOpen(false)}
                slides={allImagesForLightbox}
                index={currentIndex}
            />
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const protocol = context.req.headers['x-forwarded-proto'] || 'http';
    const host = context.req.headers.host;
    const apiUrl = `${protocol}://${host}/api/gallery`;

    try {
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error('Failed to fetch gallery data');
        const galleryProjects = await res.json();
        return { props: { galleryProjects } };
    } catch (error) {
        console.error(error);
        return { props: { galleryProjects: [] } };
    }
};

export default GalleryPage;