export const getBaseUrl = () => {
    return window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
        ? "http://localhost:5001"
        : "https://full-stack-blog-site-ontq.vercel.app";
}
