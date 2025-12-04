import React from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';
import { useI18n } from '../hooks/useI18n';
import { motion } from 'framer-motion';

const ErrorWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 80vh;
    padding: 80px 20px;
    text-align: center;
    background-color: #F9F9F9;
`;

const StatusCode = styled(motion.h1)`
    font-size: 10rem;
    color: #FFD700;
    margin: 0;
    font-family: 'Playfair Display', serif;
    text-shadow: 4px 4px 10px rgba(0, 0, 0, 0.1);

    @media (max-width: 768px) {
        font-size: 6rem;
    }
`;

const ErrorMessage = styled.h2`
    font-size: 2.5rem;
    color: #222;
    margin: 10px 0 20px;

    @media (max-width: 768px) {
        font-size: 1.8rem;
    }
`;

const SubText = styled.p`
    font-size: 1.1rem;
    color: #666;
    max-width: 600px;
    margin-bottom: 40px;
    line-height: 1.6;
`;

const LinkContainer = styled.div`
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    justify-content: center;
`;

const Custom404: React.FC = () => {
    const { t } = useI18n();
    const siteName = t('global_seo.site_name') || 'Nanky Beauty';

    return (
        <>
            <Head>
                <title>404 - Không tìm thấy trang | {siteName}</title>
                <meta name="robots" content="noindex, follow" /> {/* KHÔNG INDEX trang 404 */}
            </Head>
            <Header />
            <ErrorWrapper>
                <StatusCode 
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 100 }}
                >
                    404
                </StatusCode>
                <ErrorMessage>
                    Rất tiếc! Trang này không tồn tại.
                </ErrorMessage>
                <SubText>
                    Đường dẫn bạn truy cập có thể đã bị xóa, đổi tên hoặc chưa bao giờ tồn tại. Đừng lo lắng, hãy thử quay lại các trang chính của Nanky Beauty.
                </SubText>
                <LinkContainer>
                    <Button as="a" href="/">
                        Trang chủ Nanky Beauty
                    </Button>
                    <Button as="a" href="/services" style={{ backgroundColor: '#ccc', backgroundImage: 'none', boxShadow: 'none', color: '#333' }}>
                        Khám phá Dịch vụ
                    </Button>
                    <Button as="a" href="/contact">
                        Liên hệ tư vấn
                    </Button>
                </LinkContainer>
            </ErrorWrapper>
            <Footer />
        </>
    );
};

export default Custom404;