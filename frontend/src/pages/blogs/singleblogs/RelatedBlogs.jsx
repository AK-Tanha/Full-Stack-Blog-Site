import { Link, useParams } from 'react-router-dom';
import Loading from '../../../Component/Loading';
import { useFetchRelatedBlogsQuery } from '../../../redux/features/blogs/blogsApi';


const RelatedBlogs = () => {
  const { id } = useParams();
  const { data: blogs = [], error, isLoading } = useFetchRelatedBlogsQuery(id);

  return (
    <div className='mt-4'>
      {isLoading && <Loading isSmall />}
      {error && <p className="text-center text-red-500">Failed to load related blogs.</p>}

      {blogs.length > 0 ? (
        <div className='space-y-4'>
          {blogs.map((blog) => (
            <Link
              to={`/blogs/${blog?._id}`}
              key={blog._id}
              className='group flex items-start gap-4 p-4 rounded-lg bg-gray-50 hover:bg-blue-50/50 transition-colors duration-200'
            >
              <div className='w-20 h-20 flex-shrink-0 overflow-hidden rounded-lg'>
                <img
                  src={blog.coverImg}
                  alt={blog.title}
                  className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                />
              </div>
              <div className='flex-1 min-w-0'>
                <h4 className='font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-1 leading-snug'>
                  {blog?.title}
                </h4>
                <p className='text-sm text-gray-500 line-clamp-2 leading-relaxed'>
                  {blog?.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className='text-gray-500'>No related blogs found.</p>
      )}
    </div>
  );
};

export default RelatedBlogs;
