import { Link, useParams } from 'react-router-dom';
import Loading from '../../../Component/Loading';
import { useFetchRelatedBlogsQuery } from '../../../redux/features/blogs/blogsApi';


const RelatedBlogs = () => {
  const { id } = useParams();
  const { data: blogs = [], error, isLoading } = useFetchRelatedBlogsQuery(id);

  return (
    <div className='mt-2'>
      {isLoading && <Loading isSmall />}
      {error && <p className="text-center text-orange-600 font-bold bg-orange-50 p-4 rounded-xl">Failed to load related blogs.</p>}

      {blogs.length > 0 ? (
        <div className='space-y-6'>
          {blogs.map((blog) => (
            <Link
              to={`/blogs/${blog?._id}`}
              key={blog._id}
              className='group flex items-start gap-4 transition-all duration-300'
            >
              <div className='w-20 h-20 flex-shrink-0 overflow-hidden rounded-2xl shadow-sm'>
                <img
                  src={blog.coverImg}
                  alt={blog.title}
                  className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                />
              </div>
              <div className='flex-1 min-w-0'>
                <h4 className='font-black text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 mb-2 leading-[1.3] text-sm uppercase tracking-tight'>
                  {blog?.title}
                </h4>
                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <span>{new Date(blog?.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  <span className="w-1 h-1 bg-gray-200 rounded-full" />
                  <span className="text-orange-500">Must Read</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className='text-gray-400 text-sm font-medium italic'>No related articles found for this topic.</p>
      )}
    </div>
  );
};

export default RelatedBlogs;
