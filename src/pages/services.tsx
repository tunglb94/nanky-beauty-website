import React from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ServicesGrid from '../components/sections/ServicesGrid';
import { useI18n } from '../hooks/useI18n';

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
`;

const ServicesPage: React.FC = () => {
    const { t } = useI18n();

    const seoData = t('services_page.seo') as { title: string; description: string; keywords: string; };
    const globalSeo = t('global_seo') as { site_name: string; title_separator: string; };
    const pageTitle = `${seoData.title} ${globalSeo.title_separator} ${globalSeo.site_name}`;

    return (
        <>
            <Head>
                <title>{pageTitle}</title>
                <meta name="description" content={seoData.description} />
                <meta name="keywords" content={seoData.keywords} />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={seoData.description} />
                <meta property="og:type" content="website" />
            </Head>

            <Header />
            <PageWrapper>
                <PageTitle>{t('services_page.title')}</PageTitle>
                <ServicesGrid /> 
            </PageWrapper>
            <Footer />
        </>
    );
};

export default ServicesPage;