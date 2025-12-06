import { useParams } from 'react-router-dom';
import { useFetchBlogsByIDQuery } from '../../../redux/features/blogs/blogsApi';
import CommentsCard from '../Comments/CommentsCard';
import RelatedBlogs from './RelatedBlogs';
import SingleBlogCard from './SingleBlogCard';
import Loading from '../../../Component/Loading';

const Singleblogs = () => {
  const { id } = useParams(); 
  const { data: blog, error, isLoading } = useFetchBlogsByIDQuery(id); 
  console.log(blog);

  return (
    <div className="container mx-auto px-4 mt-12 text-primary">
      {isLoading && (
        <Loading />
      )}

      {error && (
        <div className="text-center text-red-500 text-lg font-medium">Something went wrong.</div>
      )}

      {blog?.post && (
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Main Content */}
          <div className="w-full lg:w-2/3">
            <SingleBlogCard blog={blog.post} />
            <div className="mt-8">
              <CommentsCard comments={blog?.comments} />
            </div>
          </div>

          {/* Related Blogs Sidebar */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white shadow-md rounded-md p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Related Blogs</h3>
              <RelatedBlogs />
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default Singleblogs;
