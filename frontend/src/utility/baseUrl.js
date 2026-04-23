export const getBaseUrl = () => {
    // For local development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return "http://localhost:5001";
    }
    
    // Fallback to production
    return "https://full-stack-blog-site-ontq.vercel.app";
}
