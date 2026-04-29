import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, image, url, type = 'article' }) => {
  const siteTitle = 'Combat Corner';
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const siteDescription = 'Your premium source for combat sports news and blogs.';
  const metaDescription = description || siteDescription;
  
  // Base URL for the frontend
  const siteUrl = 'https://full-stack-blog-site-frontend.vercel.app'; // Replace with your actual frontend URL if different
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : siteUrl;
  
  const fullUrl = url ? `${currentOrigin}${url}` : (typeof window !== 'undefined' ? window.location.href : siteUrl);
  
  // Ensure image is an absolute URL
  let metaImage = image || `${currentOrigin}/Logo.png`;
  if (metaImage && !metaImage.startsWith('http')) {
    metaImage = `${currentOrigin}${metaImage.startsWith('/') ? '' : '/'}${metaImage}`;
  }

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:image:secure_url" content={metaImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={siteTitle} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />
      
      {/* WhatsApp specific (often uses og:image, but sometimes needs this) */}
      <meta property="og:image:type" content="image/jpeg" />
    </Helmet>
  );
};

export default SEO;
