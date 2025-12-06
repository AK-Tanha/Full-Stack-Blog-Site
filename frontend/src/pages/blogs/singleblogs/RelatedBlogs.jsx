import { useFetchRelatedBlogsQuery } from '../../../redux/features/blogs/blogsApi';
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Loading from '../../../Component/Loading';


const RelatedBlogs = () => {
  const { id } = useParams();
  const { data: blogs = [], error, isLoading } = useFetchRelatedBlogsQuery(id);

  return (
    <div>
      <hr className='mb-4' />

      {isLoading && <Loading />}
      {error && <p className="text-center text-red-500">Failed to load related blogs.</p>}

      {blogs.length > 0 ? (
        <div className='space-y-4 px-4 pb-4'>
          {blogs.map((blog) => (
            <Link
              to={`/blogs/${blog?._id}`}
              key={blog._id}
              className='flex items-start sm:items-center gap-4 p-3 bg-white hover:bg-gray-50 rounded-md shadow-sm border transition'
            >
              <div className='min-w-[56px] min-h-[56px]'>
                <img
                  src={blog.coverImg}
                  alt={blog.title}
                  className='w-14 h-14 rounded-full object-cover ring-2 ring-blue-600'
                />
              </div>
              <div className='flex-1'>
                <h4 className='font-medium text-[#1E73BE] leading-snug line-clamp-2'>
                  {blog?.title}
                </h4>
                <p className='text-sm text-gray-600 line-clamp-2'>
                  {blog?.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className='text-gray-500 px-4 pb-4'>No related blogs found.</p>
      )}
    </div>
  );
};

export default RelatedBlogs;
