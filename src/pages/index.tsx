import React from 'react';
import Head from 'next/head';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/sections/HeroSection';
import WhyUsSection from '../components/sections/WhyUsSection'; 
import ServicesGrid from '../components/sections/ServicesGrid'; 
import Testimonials from '../components/sections/Testimonials'; 
import MaterialsSection from '../components/sections/MaterialsSection'; 
import CallToAction from '../components/sections/CallToAction'; 
import styled from 'styled-components';
import { useI18n } from '../hooks/useI18n';

const MainContent = styled.main`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Home: React.FC = () => {
  const { t } = useI18n();

  const seoData = t('hero.seo') as { title: string; description: string; keywords: string; };
  const globalSeo = t('global_seo') as { site_name: string; title_separator: string; };
  const pageTitle = `${globalSeo.site_name} ${globalSeo.title_separator} ${seoData.title}`;

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

      <MainContent>
        <HeroSection /> 
        <WhyUsSection /> 
        <ServicesGrid /> 
        <Testimonials /> 
        <MaterialsSection />
        <CallToAction /> 
      </MainContent>

      <Footer />
    </>
  );
};

export default Home;