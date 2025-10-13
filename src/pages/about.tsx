import React, { useRef } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { useRevealAnimation } from '../hooks/useScrollAnimation';
import Button from '../components/ui/Button'; 
import { useI18n } from '../hooks/useI18n'; 

const PageWrapper = styled.div` padding-top: 80px; background-color: #fff; `;
const HeroBanner = styled.section` height: 90vh; background: #f7f7f7; position: relative; overflow: hidden; display: flex; justify-content: center; align-items: center; text-align: center; `;
const HeroImage = styled(motion.div)` position: absolute; top: 0; left: 0; width: 100%; height: 120%; background-size: cover; background-position: center 70%; filter: brightness(0.6); `;
const HeroTitle = styled(motion.h1)` position: relative; z-index: 10; font-size: 7vw; color: #FFD700; text-shadow: 0 0 20px rgba(255, 215, 0, 0.5); line-height: 1.1; `;
const HeroOverlay = styled.div` position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255, 255, 255, 0.4); backdrop-filter: blur(2px); `;
const PhilosophySection = styled.section` background-color: #1a1a1a; color: #fff; padding: 120px 80px; display: flex; justify-content: space-between; gap: 100px; `;
const PhilosophyTextColumn = styled.div` flex: 1; text-align: left; max-width: 50%; `;
const PhilosophyImageColumn = styled(motion.div)` flex: 1; min-height: 400px; background-size: cover; background-position: center; border-radius: 8px; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5); `;
const PhilosophySectionTitle = styled(motion.h2)` font-size: 3rem; color: #FFD700; margin-bottom: 15px; `;
const SectionText = styled.p` font-size: 1.1rem; color: #ccc; line-height: 1.8; margin-bottom: 30px; `;
const PillarsSection = styled.section` padding: 120px 80px; background-color: #fff; text-align: center; `;
const SectionHeader = styled(motion.div)` text-align: center; margin-bottom: 60px; `;
const SectionTitle = styled(motion.h2)` font-size: 3rem; color: #222; margin-bottom: 15px; `;
const SectionSubtitle = styled(motion.p)` font-size: 1.2rem; color: #666; max-width: 800px; margin: 0 auto; `;
const PillarsGrid = styled.div` display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; margin-top: 60px; text-align: left; `;
const ExpertiseCard = styled(motion.div)` padding: 40px; border-radius: 15px; border: 1px solid #eee; box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08); background-color: #f7f7f7; `;
const CardTitle = styled.h4` font-size: 1.5rem; color: #C6A500; margin-bottom: 10px; `;
const CardDescription = styled.p` font-size: 1rem; color: #555; line-height: 1.6; `;
const MilestoneList = styled.ul` list-style: none; padding: 0; margin-top: 20px; li { font-size: 1rem; color: #555; margin-bottom: 8px; position: relative; padding-left: 20px; &::before { content: '⭐'; position: absolute; left: 0; color: #C6A500; } } `;
const TimelineSection = styled.section` background-color: #1a1a1a; padding: 100px 0; overflow-x: hidden; text-align: center; color: #fff; `;
const TimelineTitle = styled.h2` font-size: 3rem; color: #FFD700; margin-bottom: 80px; padding: 0 80px; `;
const TimelineContainer = styled(motion.div)` display: flex; justify-content: flex-start; align-items: center; padding: 0 100px; height: 300px; position: relative; `;
const TimelineItem = styled(motion.div)` flex: 0 0 300px; margin-right: 50px; position: relative; text-align: center; padding: 20px; border-top: 4px solid #FFD700; &::before { content: attr(data-year); position: absolute; top: -40px; left: 50%; transform: translateX(-50%); font-size: 1.5rem; font-weight: bold; color: #fff; background-color: #1a1a1a; padding: 5px 10px; border: 2px solid #FFD700; border-radius: 5px; } `;
const TimelineEvent = styled.p` font-size: 1.1rem; margin-top: 20px; color: #ccc; `;

const AboutPage: React.FC = () => {
    const { t } = useI18n();

    // SỬA LỖI: Kiểm tra kiểu dữ liệu an toàn
    const seoDataRaw = t('about_page.seo');
    const seoData = typeof seoDataRaw === 'object' ? seoDataRaw : { title: '', description: '', keywords: '' };

    const globalSeoRaw = t('global_seo');
    const globalSeo = typeof globalSeoRaw === 'object' ? globalSeoRaw : { site_name: 'Nanky Beauty', title_separator: '|' };
    
    const pageTitle = `${seoData.title} ${globalSeo.title_separator} ${globalSeo.site_name}`;
    
    const parseI18nJson = (key: string) => { const value = t(key); if (typeof value === 'string') { try { return JSON.parse(value); } catch (e) { return []; } } return Array.isArray(value) ? value : []; };
    const safelyParseNestedArray = (value: any) => { if (Array.isArray(value)) return value; if (typeof value === 'string') { try { return JSON.parse(value); } catch { return []; } } return []; };
    const heroImageUrl = t('about_page.hero_image_url') || '/images/about/about-hero-bg.jpg';
    const philosophyTitle = t('about_page.philosophy_title');
    const philosophyText = t('about_page.philosophy_text');
    const philosophyImageUrl = t('about_page.philosophy_image_url') || '/images/about/philosophy-image.jpg';
    const missionText = t('about_page.mission');
    const visionText = t('about_page.vision');
    const timelineTitle = t('about_page.timeline_title');
    const ctaTitle = t('about_page.cta_about_title');
    const ctaButton = t('about_page.cta_about_button');
    const pillarsSectionTitle = t('about_page.pillars_section_title');
    const pillarsSectionSubtitle = t('about_page.pillars_section_subtitle');
    const pillarsArray = parseI18nJson('about_page.pillars');
    const timelineArray = parseI18nJson('about_page.timeline'); 
    const { scrollY } = useScroll();
    const yParallax = useTransform(scrollY, [0, 800], ['0%', '30%']); 
    const titleVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05, } }, };
    const charVariants = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }, };
    const titleText = "VỀ CHÚNG TÔI";
    const timelineRef = useRef(null);
    const { scrollYProgress: timelineScrollProgress } = useScroll({ target: timelineRef, offset: ["start end", "end start"] });
    const xTimeline: MotionValue<string> = useTransform(timelineScrollProgress, [0, 1], ["-20%", "20%"]); 
    const { ref: sectionRef, inView: sectionInView } = useRevealAnimation(0.2, true);

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
                <HeroBanner>
                    <HeroImage style={{ y: yParallax, backgroundImage: `url('${heroImageUrl}')` }} />
                    <HeroOverlay />
                    <HeroTitle variants={titleVariants} initial="hidden" animate="visible">
                        {titleText.split("").map((char, index) => ( <motion.span key={index} variants={charVariants} style={{ display: 'inline-block', marginRight: char === ' ' ? '15px' : '0' }}>{char}</motion.span> ))}
                    </HeroTitle>
                </HeroBanner>
                <PhilosophySection>
                    <PhilosophyTextColumn>
                        <SectionSubtitle initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}> TRIẾT LÝ CỦA NANKY BEAUTY </SectionSubtitle>
                        <PhilosophySectionTitle initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}> {philosophyTitle} </PhilosophySectionTitle>
                        <SectionText> {philosophyText} </SectionText>
                        <SectionText> **SỨ MỆNH:** "{missionText}" </SectionText>
                        <SectionText> **TẦM NHÌN:** "{visionText}" </SectionText>
                    </PhilosophyTextColumn>
                    <PhilosophyImageColumn style={{ backgroundImage: `url('${philosophyImageUrl}')` }} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.5, type: 'spring' }} />
                </PhilosophySection>
                <PillarsSection>
                    <SectionHeader>
                        <SectionTitle>{pillarsSectionTitle}</SectionTitle>
                        <SectionSubtitle>{pillarsSectionSubtitle}</SectionSubtitle>
                    </SectionHeader>
                    <PillarsGrid ref={sectionRef}>
                        {pillarsArray.map((item: any, index: number) => (
                            <ExpertiseCard key={index} initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={sectionInView ? { opacity: 1, y: 0, scale: 1 } : {}} transition={{ delay: index * 0.2 + 0.5, type: 'spring', stiffness: 100 }} whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(198, 165, 0, 0.15)' }}>
                                <CardTitle>{item.title}</CardTitle>
                                <CardDescription>{item.description}</CardDescription>
                                <MilestoneList>
                                    {safelyParseNestedArray(item.milestones).map((milestone: string, i: number) => ( <li key={i}>{milestone}</li> ))}
                                </MilestoneList>
                            </ExpertiseCard>
                        ))}
                    </PillarsGrid>
                </PillarsSection>
                <TimelineSection>
                    <TimelineTitle>{timelineTitle}</TimelineTitle>
                    <div ref={timelineRef} style={{ width: '100%', overflowX: 'scroll' }}>
                        <TimelineContainer style={{ x: xTimeline }}>
                            {(Array.isArray(timelineArray) ? timelineArray : []).map((item: any, index: number) => (
                                <TimelineItem key={index} data-year={item.year} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ delay: index * 0.3 }}>
                                    <TimelineEvent>{item.event}</TimelineEvent>
                                </TimelineItem>
                            ))}
                        </TimelineContainer>
                    </div>
                </TimelineSection>
                <section style={{ backgroundColor: '#1a1a1a', padding: '80px 0', textAlign: 'center' }}>
                    <h2 style={{ color: '#FFD700', fontSize: '2rem', marginBottom: '30px' }}>{ctaTitle}</h2>
                    <Button as="a" href="/contact">{ctaButton}</Button>
                </section>
            </PageWrapper>
            <Footer />
        </>
    );
};

export default AboutPage;