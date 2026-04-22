export const getBaseUrl = () => {
    // For local development, you can uncomment the line below if you want to use the local backend
    // if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    //     return "http://localhost:5001";
    // }
    
    // Always use the Vercel backend as per user preference
    return "https://full-stack-blog-site-ontq.vercel.app";
}
