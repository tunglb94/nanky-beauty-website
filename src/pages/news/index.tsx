import React from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { motion } from 'framer-motion';
import { useI18n } from '../../hooks/useI18n';
import { useRouter } from 'next/router';
import type { GetStaticProps } from 'next';
import fs from 'fs';
import path from 'path';

// --- HÀM TIỆN ÍCH: CHUYỂN ĐỔI MARKDOWN THÀNH HTML AN TOÀN ---
// Chuyển **text** thành <strong>text</strong> để render in đậm
const renderContentWithMarkdown = (text: string) => {
    // 1. Chuyển đổi **text** thành <strong>text</strong>
    // Dùng regex non-greedy (.*?) để chỉ bắt cặp ** gần nhất
    const strongHtml = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // 2. Trả về đối tượng để sử dụng trong dangerouslySetInnerHTML
    return { __html: strongHtml };
};
// -------------------------------------------------------------

// --- Styled Components ---
const PageWrapper = styled.div`
    padding-top: 80px;
`;

const PageHeader = styled.div`
    padding: 80px 25px;
    background-color: #f7f7f7;
    text-align: center;
`;

const PageTitle = styled.h1`
    font-size: 3.5rem;
    color: #222;
    margin-bottom: 15px;
`;

const PageSubtitle = styled.p`
    font-size: 1.2rem;
    color: #666;
    max-width: 800px;
    margin: 0 auto;
`;

const BlogGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 40px;
    padding: 80px;

    @media (max-width: 768px) {
        padding: 40px 25px;
    }
`;

const BlogCard = styled(motion.a)`
    display: block;
    text-decoration: none;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    background-color: #fff;
    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
    }
`;

const CardImage = styled.div<{ $imageUrl: string }>`
    height: 220px;
    background-image: url(${props => props.$imageUrl});
    background-size: cover;
    background-position: center;
`;

const CardContent = styled.div`
    padding: 25px;
`;

const CardTitle = styled.h3`
    font-size: 1.5rem;
    color: #333;
    margin-bottom: 10px;
    line-height: 1.3;
    /* FIX: Ensure strong tags inside h3 render correctly */
    strong {
        font-weight: 700;
    }
`;

const CardDate = styled.p`
    font-size: 0.9rem;
    color: #999;
    margin-bottom: 15px;
`;

const CardExcerpt = styled.p`
    font-size: 1rem;
    color: #666;
    line-height: 1.6;
`;

const ReadMoreLink = styled.span`
    display: inline-block;
    margin-top: 20px;
    color: #C6A500;
    font-weight: 700;
    
    &:hover {
        text-decoration: underline;
    }
`;


// --- Interfaces ---
interface BlogPost {
    slug: string;
    date: string;
    imageUrl: string;
    title: { [key: string]: string };
    excerpt: { [key: string]: string };
    content: { [key: string]: string };
}

interface NewsPageProps {
    posts: BlogPost[];
}

const NewsPage: React.FC<NewsPageProps> = ({ posts }) => {
    const { t } = useI18n();
    const router = useRouter();

    const seoDataRaw = t('news_page.seo');
    const seoData = typeof seoDataRaw === 'object' ? seoDataRaw : { title: '', description: '', keywords: '' };

    const globalSeoRaw = t('global_seo');
    const globalSeo = typeof globalSeoRaw === 'object' ? globalSeoRaw : { site_name: 'Nanky Beauty', title_separator: '|' };
    
    const pageTitle = `${seoData.title} ${globalSeo.title_separator} ${globalSeo.site_name}`;
    const currentLang = router.locale || 'vi';


    return (
        <>
            <Head>
                <title>{pageTitle}</title>
                <meta name="description" content={seoData.description} />
                <meta name="keywords" content={seoData.keywords} />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={seoData.description} />
            </Head>
            <Header />
            <PageWrapper>
                <PageHeader>
                    <PageTitle>{t('news_page.title')}</PageTitle>
                    <PageSubtitle>{t('news_page.subtitle')}</PageSubtitle>
                </PageHeader>
                <BlogGrid>
                    {posts.map((post, index) => {
                        const postTitle = post.title[currentLang] || post.title['vi'];
                        const postExcerpt = post.excerpt[currentLang] || post.excerpt['vi'];
                        
                        return (
                            <BlogCard
                                key={post.slug}
                                href={`/news/${post.slug}`}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                {/* HIỂN THỊ THUMBNAIL */}
                                <CardImage $imageUrl={post.imageUrl} />
                                <CardContent>
                                    <CardDate>Đăng ngày: {post.date}</CardDate>
                                    {/* FIX: Sử dụng dangerouslySetInnerHTML và hàm tiện ích để render tiêu đề */}
                                    <CardTitle dangerouslySetInnerHTML={renderContentWithMarkdown(postTitle)} />
                                    <CardExcerpt>{postExcerpt}</CardExcerpt>
                                    <ReadMoreLink>{t('news_page.read_more')} →</ReadMoreLink>
                                </CardContent>
                            </BlogCard>
                        );
                    })}
                </BlogGrid>
            </PageWrapper>
            <Footer />
        </>
    );
};

// ĐƯỜNG DẪN MỚI TỚI THƯ MỤC CHỨA BÀI VIẾT RIÊNG LẺ
const POSTS_DIRECTORY = path.join(process.cwd(), 'src', 'content', 'posts');

// CẬP NHẬT LOGIC ĐỂ ĐỌC TỪ THƯ MỤC CHỨA CÁC FILE JSON RIÊNG LẺ
export const getStaticProps: GetStaticProps<NewsPageProps> = async () => {
    // 1. Lấy danh sách tên file trong thư mục
    const fileNames = fs.readdirSync(POSTS_DIRECTORY);

    // 2. Đọc nội dung của từng file JSON, thêm cơ chế xử lý lỗi
    const posts: BlogPost[] = fileNames
        .filter(fileName => fileName.endsWith('.json'))
        .map(fileName => {
            try {
                const filePath = path.join(POSTS_DIRECTORY, fileName);
                const fileContent = fs.readFileSync(filePath, 'utf-8');
                return JSON.parse(fileContent) as BlogPost;
            } catch (e) {
                // Xử lý lỗi khi parse JSON (ví dụ: file trống, lỗi cú pháp)
                console.error(`Error parsing JSON file: ${fileName}. This file will be skipped.`);
                return null;
            }
        })
        // Loại bỏ các file bị lỗi parse
        .filter((post): post is BlogPost => post !== null); 

    // 3. Sắp xếp bài viết theo ngày mới nhất (giả sử định dạng là DD/MM/YYYY)
    const sortedPosts = posts.sort((a, b) => {
        // Chuyển đổi định dạng ngày DD/MM/YYYY sang YYYY-MM-DD để so sánh
        const dateA = new Date(a.date.split('/').reverse().join('-')).getTime();
        const dateB = new Date(b.date.split('/').reverse().join('-')).getTime();
        return dateB - dateA;
    });

    return {
        props: {
            posts: sortedPosts,
        },
    };
};

export default NewsPage;