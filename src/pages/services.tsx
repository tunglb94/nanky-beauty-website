import React from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ServicesGrid from '../components/sections/ServicesGrid';
import { useI18n } from '../hooks/useI18n';
import { useRouter } from 'next/router';
import type { GetStaticProps } from 'next';

// Các ngôn ngữ hỗ trợ (Cần đồng bộ với cấu hình i18n và sitemap)
const SUPPORTED_LANGS = ['vi', 'en', 'ru', 'kr', 'zh']; 
const URL = 'https://nankybeauty.com';

// Hàm tiện ích để render hreflang tags (Tái sử dụng)
const renderHreflangTags = (currentPath: string, supportedLangs: string[]) => {
    const basePagePath = currentPath.replace(new RegExp(`^/(${supportedLangs.filter(l => l !== 'vi').join('|')})/`), '/');
    const basePage = basePagePath === '/' ? '' : basePagePath.substring(1).split('/')[0];

    return supportedLangs.map((lang) => {
        const href = `${URL}/${lang === 'vi' ? basePage : `${lang}/${basePage}`}`.replace(/\/\/$/, '/');
        const hreflangAttr = lang === 'vi' ? 'x-default' : lang; 

        return (
            <link 
                key={lang} 
                rel="alternate" 
                hrefLang={hreflangAttr} 
                href={href} 
            />
        );
    });
};


const PageWrapper = styled.div`
    padding-top: 80px;
`;

const PageTitle = styled.h1`
    font-family: 'Playfair Display', serif;
    font-size: 4rem;
    color: #C6A500;
    text-align: center;
    padding: 60px 0 20px;
    background-color: #F9F9F9;
    
    @media (max-width: 768px) {
        font-size: 2.5rem;
    }
`;

const ServicesPage: React.FC = () => {
    const { t, lang } = useI18n();
    const router = useRouter();

    // SỬ DỤNG ĐÚNG KEYS TỪ services_page
    const seoDataRaw = t('services_page.seo');
    const seoData = typeof seoDataRaw === 'object' ? seoDataRaw : { title: '', description: '', keywords: '' };

    const globalSeoRaw = t('global_seo');
    const globalSeo = typeof globalSeoRaw === 'object' ? globalSeoRaw : { site_name: 'Nanky Beauty', title_separator: '|', default_og_image: '/images/social/default-sharing-image.jpg' };

    const pageTitle = `${seoData.title} ${globalSeo.title_separator} ${globalSeo.site_name}`;
    const ogImage = globalSeo.default_og_image;

    return (
        <>
            <Head>
                <title>{pageTitle}</title>
                <meta name="description" content={seoData.description} />
                <meta name="keywords" content={seoData.keywords} />
                {/* OPEN GRAPH TAGS (Chia sẻ mạng xã hội) */}
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={seoData.description} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={`${URL}${router.asPath}`} />
                <meta property="og:site_name" content={globalSeo.site_name} />
                <meta property="og:image" content={`${URL}${ogImage}`} />
                {/* TWITTER CARD TAGS */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={pageTitle} />
                <meta name="twitter:description" content={seoData.description} />
                <meta name="twitter:image" content={`${URL}${ogImage}`} />

                {/* === HREFLANG TAGS === */}
                {renderHreflangTags(router.asPath, SUPPORTED_LANGS)}
                {/* ====================== */}
            </Head>

            <Header />
            <PageWrapper>
                {/* DÙNG ĐÚNG service_page.title */}
                <PageTitle>{t('services_page.title')}</PageTitle>
                <ServicesGrid /> 
            </PageWrapper>
            <Footer />
        </>
    );
};

export const getStaticProps: GetStaticProps = async () => {
    return { props: {} };
};

export default ServicesPage;