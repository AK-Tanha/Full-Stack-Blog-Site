import { Link } from 'react-router-dom';
import Loading from '../../Component/Loading';
import { useFetchBlogsQuery } from '../../redux/features/blogs/blogsApi';

const Blogs = ({ query }) => {
  const { data: blogs = [], error, isLoading } = useFetchBlogsQuery(query);

  const renderBlogSection = (title, sectionBlogs, themeColor = 'orange', key) => {
    if (!sectionBlogs || sectionBlogs.length === 0) return null;
    
    const featuredBlog = sectionBlogs[0];
    const secondaryBlogs = sectionBlogs.slice(1, 5); 
    
    return (
      <div className="mb-24 last:mb-0" key={key}>
        <div className="flex items-center gap-4 mb-10">
          <h3 className={`text-3xl font-black uppercase tracking-tight text-gray-900 px-5 py-2 ${themeColor === 'orange' ? 'bg-orange-50 border-orange-600' : 'bg-amber-50 border-amber-500'} border-l-8 shadow-sm`}>
            {title}
          </h3>
          <div className="h-[2px] flex-grow bg-gray-100"></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Featured Blog - Left (7 cols) */}
          <div className="lg:col-span-7">
            <Link to={`/blogs/${featuredBlog._id}`} className="group relative block bg-gray-900 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 overflow-hidden h-[450px] lg:h-full min-h-[400px]">
              <img 
                src={featuredBlog.coverImg} 
                alt={featuredBlog.title} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-90" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              
              <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
                <span className={`${themeColor === 'orange' ? 'bg-orange-600' : 'bg-amber-500'} text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-6 inline-block text-white shadow-lg`}>
                  Featured Story
                </span>
                <h2 className="text-3xl md:text-4xl font-black leading-tight mb-4 text-white drop-shadow-2xl group-hover:underline decoration-4 underline-offset-8">
                  {featuredBlog.title}
                </h2>
                <p className="text-gray-200 line-clamp-2 text-base md:text-lg max-w-2xl font-medium opacity-90">
                  {featuredBlog.description || "Deep dive into the latest developments and exclusive insights from the world of combat sports..."}
                </p>
                <div className="mt-8 flex items-center gap-4 text-white/60 text-xs font-bold uppercase tracking-widest">
                  <span>{new Date(featuredBlog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  <span className="w-1.5 h-1.5 bg-white/40 rounded-full" />
                  <span>8 min read</span>
                </div>
              </div>
            </Link>
          </div>
          
          {/* Secondary Blogs - Right (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            {secondaryBlogs.length > 0 ? secondaryBlogs.map(blog => (
              <Link to={`/blogs/${blog._id}`} key={blog._id} className="group flex gap-5 bg-white p-4 rounded-2xl hover:bg-gray-50 transition-all duration-300 border border-gray-50 hover:border-gray-200 shadow-sm hover:shadow-md">
                <div className="w-24 h-24 md:w-32 md:h-28 flex-shrink-0 overflow-hidden rounded-xl shadow-inner">
                  <img src={blog.coverImg} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="flex flex-col justify-center py-1">
                  <span className={`text-[10px] font-black uppercase tracking-[0.15em] ${themeColor === 'orange' ? 'text-orange-600' : 'text-amber-500'} mb-2`}>
                    {blog.category || "General"}
                  </span>
                  <h4 className={`text-lg font-bold text-gray-900 line-clamp-2 leading-tight group-hover:${themeColor === 'orange' ? 'text-orange-600' : 'text-amber-500'} transition-colors duration-300`}>
                    {blog.title}
                  </h4>
                  <div className="mt-3 flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                    <span>4 min read</span>
                  </div>
                </div>
              </Link>
            )) : (
              <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-100 rounded-3xl p-10 text-center">
                <p className="text-gray-400 font-medium italic">More stories coming soon to this section...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const groupedBlogs = blogs.slice(3).reduce((acc, blog) => {
    const cat = blog.category || "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(blog);
    return acc;
  }, {});

  return (
    <div className='w-full'>
      {/* Status messages */}
      {isLoading && <Loading />}
      {error && (
        <div className="bg-orange-50 text-orange-600 p-8 rounded-2xl border border-orange-100 text-center shadow-inner">
          <p className="font-bold text-lg mb-2">Oops! Something went wrong.</p>
          <p className="text-sm opacity-80">{error?.data?.message || error?.error || "An error occurred while fetching blogs."}</p>
        </div>
      )}
      {!isLoading && blogs.length === 0 && (
        <div className="bg-gray-50 text-gray-500 p-20 rounded-3xl border border-gray-200 text-center shadow-inner">
          <p className="text-2xl font-black uppercase tracking-tighter mb-4">No Stories Found</p>
          <p className="text-lg font-medium opacity-60">Try adjusting your filters or check back later for new updates.</p>
        </div>
      )}

      {/* Latest Blogs Section */}
      {!isLoading && blogs.length > 0 && renderBlogSection("Latest Stories", blogs.slice(0, 5), 'orange')}

      {/* Category-wise Blog Sections */}
      {!isLoading && Object.entries(groupedBlogs).map(([catName, catBlogs]) => (
        renderBlogSection(catName, catBlogs, 'amber', catName)
      ))}
    </div>
  );
};

export default Blogs;
