const CRAWLER_PATTERN = /facebookexternalhit|Facebot|Twitterbot|WhatsApp|LinkedInBot|Slack|Discordbot|TelegramBot|Pinterest|Flipboard|MetaInspector|meta-externalagent|Applebot|Embedly|Google-InspectionTool|Amazonbot|Slurp|BingPreview/i;

const API_BASE = 'https://full-stack-blog-site-ontq.vercel.app';
const SITE_NAME = 'Combat Corner';

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function toAbsoluteUrl(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
}

function getImageType(url) {
  if (url && typeof url === 'string') {
    if (url.endsWith('.png')) return 'image/png';
    if (url.endsWith('.gif')) return 'image/gif';
    if (url.endsWith('.webp')) return 'image/webp';
  }
  return 'image/jpeg';
}

function buildOgHtml({ title, description, image, url, type = 'website' }) {
  const fullTitle = title ? `${escapeHtml(title)} | ${SITE_NAME}` : SITE_NAME;
  const metaDesc = escapeHtml(description || 'Your premium source for combat sports news and blogs.');
  const metaImage = toAbsoluteUrl(image) || `${API_BASE}/og-default.png`;
  const fullUrl = url || API_BASE;
  const imageType = getImageType(metaImage);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${fullTitle}</title>
<meta name="description" content="${metaDesc}">
<meta property="og:type" content="${escapeHtml(type)}">
<meta property="og:url" content="${escapeHtml(fullUrl)}">
<meta property="og:title" content="${fullTitle}">
<meta property="og:description" content="${metaDesc}">
<meta property="og:image" content="${escapeHtml(metaImage)}">
<meta property="og:image:secure_url" content="${escapeHtml(metaImage)}">
<meta property="og:image:type" content="${imageType}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:site_name" content="${SITE_NAME}">
<meta itemprop="image" content="${escapeHtml(metaImage)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:url" content="${escapeHtml(fullUrl)}">
<meta name="twitter:title" content="${fullTitle}">
<meta name="twitter:description" content="${metaDesc}">
<meta name="twitter:image" content="${escapeHtml(metaImage)}">
<link rel="canonical" href="${escapeHtml(fullUrl)}">
</head>
<body></body>
</html>`;
}

export const config = {
  matcher: ['/blogs/:path*'],
};

export default async function middleware(request) {
  const userAgent = request.headers.get('user-agent') || '';
  if (!CRAWLER_PATTERN.test(userAgent)) {
    return;
  }

  const url = new URL(request.url);
  const blogId = url.pathname.replace(/^\/blogs\//, '');
  if (!blogId) {
    return;
  }

  try {
    const apiRes = await fetch(`${API_BASE}/api/blogs/${blogId}`, {
      signal: AbortSignal.timeout(5000),
    });
    if (!apiRes.ok) {
      return;
    }

    const data = await apiRes.json();
    const post = data?.post;
    if (!post) {
      return;
    }

    const title = post.title || post.title_bn || '';
    const description = post.description || post.description_bn || '';
    const rawImage = post.coverImg || '';
    const image = toAbsoluteUrl(rawImage) || `${API_BASE}/og-default.png`;

    const html = buildOgHtml({
      title,
      description,
      image,
      url: url.href,
      type: 'article',
    });

    return new Response(html, {
      status: 200,
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'public, max-age=3600',
      },
    });
  } catch {
    return;
  }
}
