import React from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { useI18n } from '../../hooks/useI18n';
import type { GetStaticPaths, GetStaticProps } from 'next';
import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { useRouter } from 'next/router';

// --- Styled Components (Giữ nguyên như trước) ---

const PageContainer = styled.div`
    padding-top: 80px;
`;

const Breadcrumbs = styled.div`
    padding: 20px 25px;
    background-color: #f7f7f7;
    font-size: 0.9rem;
    max-width: 1200px;
    margin: 0 auto;

    a {
        text-decoration: none;
        color: #C6A500;
        &:hover {
            text-decoration: underline;
        }
    }

    span {
        color: #666;
    }
`;

const MainLayout = styled.div`
    display: flex;
    gap: 40px;
    max-width: 1200px;
    margin: 40px auto;
    padding: 0 25px;

    @media (max-width: 992px) {
        flex-direction: column;
    }
`;

const ArticleWrapper = styled.article`
    flex: 1;
    min-width: 0;
`;

const ArticleHeader = styled.header`
    text-align: left;
    margin: 0 auto 40px;
`;

const ArticleTitle = styled.h1`
    font-size: 2.8rem;
    line-height: 1.2;
    margin-bottom: 20px;
    color: #222;

    @media (max-width: 768px) {
        font-size: 2rem;
    }
`;

const ArticleDate = styled.p`
    color: #888;
`;

const FeaturedImage = styled.div<{ $imageUrl: string }>`
    width: 100%;
    height: 450px;
    background-image: url(${props => props.$imageUrl});
    background-size: cover;
    background-position: center;
    margin-bottom: 40px;
    border-radius: 8px;

    @media (max-width: 768px) {
        height: 300px;
    }
`;

const ArticleContent = styled.div`
    line-height: 1.8;
    font-size: 1.1rem;
    color: #333;

    h1, h2, h3, h4 {
        scroll-margin-top: 100px;
        margin-top: 40px;
        margin-bottom: 20px;
        line-height: 1.3;
        color: #111;
    }

    p {
        margin-bottom: 20px;
    }

    blockquote {
        font-style: normal;
        background-color: #fdfbf5;
        border-left: 5px solid #C6A500;
        margin: 1.5em 0;
        padding: 1em 1.5em;
        color: #555;
    }

    blockquote p {
        margin-bottom: 0.5em;
    }

    figure {
        margin: 40px 0;
        max-width: 100%;
    }

    figure img {
        max-width: 100%;
        height: auto;
        border-radius: 8px;
        display: block;
        margin: 0 auto;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }

    figure figcaption {
        text-align: center;
        margin-top: 10px;
        font-size: 0.9rem;
        color: #888;
    }

    a {
        color: #C6A500;
        font-weight: 700;
        text-decoration: none;
        transition: text-decoration 0.2s ease-in-out;

        &:hover {
            text-decoration: underline;
        }
    }

    .comparison-table {
        width: 100%;
        border-collapse: collapse;
        margin: 30px 0;
        font-size: 1rem;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        overflow: hidden;
        border-radius: 8px;
    }
    .comparison-table th, .comparison-table td {
        border: 1px solid #ddd;
        padding: 12px 15px;
        text-align: left;
    }
    .comparison-table th {
        background-color: #f9f9f9;
        font-weight: 700;
        color: #333;
        border-bottom: 2px solid #C6A500;
    }
     .comparison-table td strong {
         font-weight: 700;
         color: #111;
    }
    .comparison-table tbody tr:nth-child(even) {
        background-color: #ffffff;
    }
    .comparison-table tbody tr:nth-child(odd) {
        background-color: #fefcf5;
    }
    .comparison-table tbody tr:hover {
        background-color: #f0eada;
    }

    @media (max-width: 768px) {
      .comparison-table {
          border-radius: 0;
          box-shadow: none;
      }
      .comparison-table thead {
          display: none;
      }
      .comparison-table tr {
          display: block;
          margin-bottom: 15px;
          border: 1px solid #ddd;
          border-radius: 4px;
          overflow: hidden;
      }
      .comparison-table td {
          display: block;
          padding: 10px 15px;
          padding-left: 45%;
          text-align: right;
          position: relative;
          border: none;
          border-bottom: 1px solid #eee;
          background-color: #fff;
      }
       .comparison-table tr:nth-child(even) td,
       .comparison-table tr:nth-child(odd) td {
            background-color: #fff;
       }
      .comparison-table td:last-child {
          border-bottom: none;
      }
      .comparison-table td::before {
          content: attr(data-label);
          position: absolute;
          left: 15px;
          width: 40%;
          padding-right: 10px;
          white-space: nowrap;
          text-align: left;
          font-weight: bold;
          color: #333;
      }
    }
`;

const TocContainer = styled.div`
    background: #fdfbf5;
    border: 1px solid #eee;
    width: 100%;
    padding: 20px 25px;
    margin-bottom: 40px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.07);
    border-left: 4px solid #C6A500;
`;

const TocTitleContainer = styled.div`
    margin-bottom: 15px;
    padding-bottom: 10px;
`;

const TocTitle = styled.p`
    font-size: 1.4rem;
    font-weight: 700;
    color: #444;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 8px;

    &::before {
        content: '☰';
        color: #C6A500;
        font-size: 1.2rem;
        line-height: 1;
    }
`;

const TocList = styled.ul`
    list-style-type: none;
    padding-left: 10px;
    margin: 0;

    li {
        padding: 6px 0;
        position: relative;
        margin-left: 15px;

        &::before {
            content: '';
            position: absolute;
            left: -15px;
            top: 50%;
            transform: translateY(-50%);
            width: 5px;
            height: 5px;
            background-color: #C6A500;
            border-radius: 50%;
        }
    }

    a {
        color: #555;
        text-decoration: none;
        font-weight: 500;
        transition: color 0.2s ease, background-color 0.2s ease, padding-left 0.2s ease;
        display: block;
        padding: 5px 10px;
        border-radius: 4px;
        margin-left: -10px;

        &:hover {
            color: #111;
            background-color: #f0eada;
            padding-left: 15px;
        }
    }
`;

const Sidebar = styled.aside`
    width: 300px;
    flex-shrink: 0;

    @media (max-width: 992px) {
        width: 100%;
    }
`;

const StickyWrapper = styled.div`
    position: sticky;
    top: 120px;
`;

const RelatedPostsWidget = styled.div`
    background-color: #f9f9f9;
    padding: 25px;
    border-radius: 8px;
    border: 1px solid #eee;
`;

const WidgetTitle = styled.h4`
    font-size: 1.4rem;
    margin-bottom: 20px;
    border-bottom: 2px solid #C6A500;
    padding-bottom: 10px;
    color: #333;
`;

const RelatedPostLink = styled(Link)`
    display: flex;
    align-items: center;
    gap: 15px;
    text-decoration: none;
    color: #444;
    margin-bottom: 18px;
    padding: 10px;
    border-radius: 6px;
    transition: background-color 0.2s ease;

    &:hover {
        background-color: #f0f0f0;
        color: #C6A500;
    }

    &:last-child {
        margin-bottom: 0;
    }
`;

const RelatedImage = styled.div<{ $imageUrl: string }>`
    flex-shrink: 0;
    width: 65px;
    height: 65px;
    border-radius: 6px;
    background-image: url(${props => props.$imageUrl});
    background-size: cover;
    background-position: center;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const RelatedTitle = styled.div`
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.4;
    transition: color 0.2s ease;

    ${RelatedPostLink}:hover & {
        color: #C6A500;
    }
`;

const ShareSection = styled.div`
    margin-top: 40px;
    padding-top: 25px;
    border-top: 1px solid #eee;
    display: flex;
    align-items: center;
    gap: 15px;
    flex-wrap: wrap;

    span {
        font-weight: 700;
        color: #333;
        font-size: 1rem;
    }
`;

const SocialButton = styled.a<{ $bgColor: string }>`
    display: inline-flex;
    align-items: center;
    padding: 9px 16px;
    border-radius: 6px;
    color: white !important;
    font-size: 0.9rem;
    font-weight: 600;
    text-decoration: none !important;
    background-color: ${props => props.$bgColor};
    transition: opacity 0.2s, transform 0.2s ease;
    box-shadow: 0 2px 5px rgba(0,0,0,0.15);

    &:hover {
        opacity: 0.9;
        text-decoration: none !important;
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }
    svg {
        margin-right: 6px;
        fill: white;
        width: 16px;
        height: 16px;
    }
`;

// --- Interfaces ---
interface BlogPost {
    slug: string;
    date: string;
    imageUrl: string;
    title: { [key: string]: string };
    excerpt: { [key:string]: string };
    content: { [key: string]: string };
}

interface RelatedPost {
    slug: string;
    title: { [key: string]: string };
    imageUrl: string;
}

interface Heading {
    id: string;
    title: string;
}

interface BlogPostPageProps {
    post: BlogPost;
    relatedPosts: RelatedPost[];
    headings: Heading[];
}

const BlogPostPage: React.FC<BlogPostPageProps> = ({ post, relatedPosts = [], headings = [] }) => {
    const { t, lang } = useI18n();
    const router = useRouter();
    const currentLang = lang || 'vi';

    if (!post) {
        return <p>Loading post...</p>;
    }

    const siteName = t('global_seo.site_name') || "Nanky Beauty";
    const title = post.title[currentLang] || post.title['vi'];
    const description = post.excerpt[currentLang] || post.excerpt['vi'];
    const content = post.content[currentLang] || post.content['vi'];
    const canonicalUrl = `https://nankybeauty.com/news/${post.slug}`;

    let publishedDateISO = '';
    try {
        const dateParts = post.date?.split('/');
        if (dateParts?.length === 3) {
            const [day, month, year] = dateParts;
            const monthNum = parseInt(month, 10);
            if (monthNum >= 1 && monthNum <= 12) {
                 publishedDateISO = new Date(Date.UTC(parseInt(year, 10), monthNum - 1, parseInt(day, 10))).toISOString();
            } else { throw new Error("Invalid month"); }
        } else { throw new Error("Invalid date format"); }
    } catch (e) {
        console.error("Error parsing date:", post.date, e);
        publishedDateISO = new Date().toISOString();
    }

    const encodedTitle = encodeURIComponent(title);
    const encodedUrl = encodeURIComponent(canonicalUrl);

    const faqEntities = headings.length >= 2 ? headings.map((h) => ({
        "@type": "Question",
        "name": h.title.replace(/<[^>]*>?/gm, ''),
        "acceptedAnswer": { "@type": "Answer", "text": description }
    })) : [];

    const jsonLdGraph: any[] = [
        {
          "@type": "Article",
          "headline": title,
          "image": `https://nankybeauty.com${post.imageUrl}`,
          "datePublished": publishedDateISO,
          "dateModified": publishedDateISO,
          "author": { "@type": "Organization", "name": siteName },
          "publisher": {
            "@type": "Organization", "name": siteName,
            "logo": { "@type": "ImageObject", "url": "https://nankybeauty.com/images/logos/logo.png" }
          },
          "description": description,
          "mainEntityOfPage": { "@type": "WebPage", "@id": canonicalUrl }
        },
        {
            "@type": "BreadcrumbList",
            "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": t('header.home'), "item": "https://nankybeauty.com" },
                { "@type": "ListItem", "position": 2, "name": t('header.news'), "item": "https://nankybeauty.com/news" },
                { "@type": "ListItem", "position": 3, "name": title }
            ]
        }
    ];
    if (faqEntities.length > 0) { jsonLdGraph.push({ "@type": "FAQPage", "mainEntity": faqEntities }); }
    const finalJsonLd = { "@context": "https://schema.org", "@graph": jsonLdGraph };

    return (
        <>
            <Head>
                <title>{`${title} | ${siteName}`}</title>
                <meta name="description" content={description} />
                <link rel="canonical" href={canonicalUrl} />

                <meta property="og:locale" content={currentLang === 'vi' ? 'vi_VN' : currentLang} />
                <meta property="og:type" content="article" />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:url" content={canonicalUrl} />
                <meta property="og:site_name" content={siteName} />
                <meta property="article:published_time" content={publishedDateISO} />
                <meta property="article:modified_time" content={publishedDateISO} />
                <meta property="og:image" content={`https://nankybeauty.com${post.imageUrl}`} />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={title} />
                <meta name="twitter:description" content={description} />
                <meta name="twitter:image" content={`https://nankybeauty.com${post.imageUrl}`} />
                <meta name="twitter:label1" content="Written by" />
                <meta name="twitter:data1" content={siteName} />

                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(finalJsonLd) }}
                />
            </Head>
            <Header />
            <PageContainer>
                 <Breadcrumbs>
                    <Link href="/">Trang chủ</Link> » <Link href="/news">Tin tức & Blog</Link> » <span>{title}</span>
                </Breadcrumbs>
                <MainLayout>
                    <ArticleWrapper>
                        <ArticleHeader>
                            <ArticleTitle>{title}</ArticleTitle>
                            <ArticleDate>Đăng ngày: {post.date}</ArticleDate>
                        </ArticleHeader>

                        {headings.length > 0 && (
                            <TocContainer>
                                <TocTitleContainer>
                                    <TocTitle>Mục Lục</TocTitle>
                                </TocTitleContainer>
                                <TocList>
                                    {headings.map((heading) => (
                                        <li key={heading.id}>
                                            <a href={`#${heading.id}`}>{heading.title}</a>
                                        </li>
                                    ))}
                                </TocList>
                            </TocContainer>
                        )}

                        <FeaturedImage $imageUrl={post.imageUrl} />
                        {/* SỬA LỖI TYPESCRIPT */}
                        <ArticleContent dangerouslySetInnerHTML={{ __html: content?.replace(
                                /<td(.*?)>(.*?)<\/td>/g, // Thêm (.*?) để bắt thuộc tính (nếu có)
                                (match, attributes, p1, offset, string) => {
                                    // Explicitly type 'm' as RegExpMatchArray
                                    const headers = Array.from(string.matchAll(/<th>(.*?)<\/th>/g), (m: RegExpMatchArray) => m[1]);
                                    // Sử dụng 'string' (chuỗi HTML gốc) thay vì match.input
                                    const cellIndex = (string.substring(0, offset).match(/<td>/g) || []).length % headers.length;
                                    return `<td${attributes || ''} data-label="${headers[cellIndex] || ''}">${p1}</td>`; // Giữ lại attributes
                                }) ?? ''
                        }} />
                        {/* KẾT THÚC SỬA LỖI */}


                        <ShareSection>
                            <span>Chia sẻ bài viết:</span>
                            <SocialButton
                                href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
                                target="_blank"
                                rel="nofollow noopener noreferrer"
                                $bgColor="#3b5998"
                                title="Chia sẻ lên Facebook"
                            >
                                <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z"></path></svg>
                                Facebook
                            </SocialButton>
                            <SocialButton
                                href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
                                target="_blank"
                                rel="nofollow noopener noreferrer"
                                $bgColor="#1DA1F2"
                                title="Chia sẻ lên X (Twitter)"
                            >
                                <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"></path></svg>
                                X (Twitter)
                            </SocialButton>
                             <SocialButton
                                href={`https://zalo.me/share/link?url=${encodedUrl}&text=${encodedTitle}`}
                                target="_blank"
                                rel="nofollow noopener noreferrer"
                                $bgColor="#0068ff"
                                title="Chia sẻ lên Zalo"
                            >
                                <svg viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M12.2 143.8L0 155.2l83.6 89.2 83.9-89.2-12.2-11.4-71.7 60.6-71.4-60.6zm233.7 13.3l-83.9 89.2 83.6 89.2 12.2-11.4-71.4-60.6 71.7-60.6-12.2-11.4zm-113 147.1l-83.6-89.2L0 231.7l83.9 89.2 71.7-60.6zm100.9.3l71.4 60.6 83.9-89.2-12.2-11.4-71.7 60.6-83.6-89.2-12.2 11.4 83.9 89.2zM212.7 0c-117.8 0-213 95.2-213 212.7S94.9 425.4 212.7 425.4s213-95.2 213-212.7S330.5 0 212.7 0zm103.1 316.4c-4.4 2.5-9.1 4-14.2 4-13 0-23.5-10.5-23.5-23.5s10.5-23.5 23.5-23.5c5.1 0 9.8 1.5 14.2 4l.3.2c16.3 9.4 27 25.8 27 43.1 0 17.3-10.7 33.7-27.3 43.1zm-100.2 15.6c-4.4 2.5-9.1 4-14.2 4-13 0-23.5-10.5-23.5-23.5s10.5-23.5 23.5-23.5c5.1 0 9.8 1.5 14.2 4l.3.2c16.3 9.4 27 25.8 27 43.1 0 17.3-10.7 33.7-27.3 43.1z"></path></svg>
                                Zalo
                            </SocialButton>
                        </ShareSection>
                    </ArticleWrapper>

                    <Sidebar>
                        <StickyWrapper>
                            <RelatedPostsWidget>
                                <WidgetTitle>Bài viết khác</WidgetTitle>
                                {relatedPosts.slice(0, 5).map(relatedPost => (
                                    <RelatedPostLink key={relatedPost.slug} href={`/news/${relatedPost.slug}`}>
                                        <RelatedImage $imageUrl={relatedPost.imageUrl} />
                                        <RelatedTitle>
                                            {relatedPost.title[currentLang] || relatedPost.title['vi']}
                                        </RelatedTitle>
                                    </RelatedPostLink>
                                ))}
                            </RelatedPostsWidget>
                        </StickyWrapper>
                    </Sidebar>
                </MainLayout>
            </PageContainer>
            <Footer />
        </>
    );
};

const POSTS_DIRECTORY = path.join(process.cwd(), 'src', 'content', 'posts');

export const getStaticPaths: GetStaticPaths = async () => {
    try {
        const fileNames = fs.readdirSync(POSTS_DIRECTORY);
        const paths = fileNames
            .filter(fileName => fileName.endsWith('.json'))
            .map(fileName => ({
                params: { slug: fileName.replace(/\.json$/, '') },
            }));
        return { paths, fallback: false };
    } catch (error) {
        console.error("Error reading post directory for static paths:", error);
        return { paths: [], fallback: false };
    }
};

export const getStaticProps: GetStaticProps<BlogPostPageProps, { slug: string }> = async (context) => {
    const slug = context.params?.slug;
    if (!slug) {
        return { notFound: true };
    }

    const currentFilePath = path.join(POSTS_DIRECTORY, `${slug}.json`);
    let currentPost: BlogPost;

    try {
        const fileContent = fs.readFileSync(currentFilePath, 'utf-8');
        currentPost = JSON.parse(fileContent);
    } catch (e) {
        console.error(`Error reading post file ${slug}.json:`, e);
        return { notFound: true };
    }

    const headings: Heading[] = [];
    const contentHtmlVi = currentPost.content?.['vi'] || '';
    const headingRegex = /<h([234]).*?id=['"](.*?)['"]>(.*?)<\/h\1>/gi;
    let match;
    while ((match = headingRegex.exec(contentHtmlVi)) !== null) {
        const id = match[2];
        const title = match[3]?.replace(/<[^>]*>?/gm, '').trim();
        if (id && title) {
            headings.push({ id, title });
        }
    }

    type RelatedPostForSorting = RelatedPost & { date?: string };

    let relatedPosts: RelatedPost[] = [];
    try {
        const allFileNames = fs.readdirSync(POSTS_DIRECTORY);
        relatedPosts = allFileNames
            .filter(fileName => fileName.endsWith('.json') && fileName !== `${slug}.json`)
            .map((fileName): RelatedPostForSorting | null => {
                const filePath = path.join(POSTS_DIRECTORY, fileName);
                try {
                    const postData: Partial<BlogPost> = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                    return {
                        slug: postData.slug || fileName.replace(/\.json$/, ''),
                        title: postData.title || { vi: 'N/A' },
                        imageUrl: postData.imageUrl || '/images/social/default-sharing-image.jpg',
                        date: postData.date
                    };
                } catch (readError) {
                    console.error(`Error reading or parsing related post file ${fileName}:`, readError);
                    return null;
                }
            })
            .filter((post): post is RelatedPostForSorting => post !== null)
            .sort((a, b) => {
                try {
                    const dateA = a.date ? new Date(a.date.split('/').reverse().join('-')).getTime() : 0;
                    const dateB = b.date ? new Date(b.date.split('/').reverse().join('-')).getTime() : 0;
                    return dateB - dateA;
                } catch {
                    return 0;
                }
            })
            .map(({ date, ...rest }) => rest);
    } catch (error) {
        console.error("Error fetching related posts:", error);
    }

    return {
        props: {
            post: currentPost,
            relatedPosts: relatedPosts,
            headings: headings,
        },
    };
};

export default BlogPostPage;