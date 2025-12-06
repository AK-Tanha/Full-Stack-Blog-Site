import { useState } from 'react';
import { Link } from 'react-router-dom';
import Loading from '../../Component/Loading';
import { useFetchBlogsQuery } from '../../redux/features/blogs/blogsApi';
import Searchblogs from "../blogs/Searchblogs";

const Blogs = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [query, setQuery] = useState({ search: "", category: "" });

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSearch = () => {
    setQuery({ search, category });
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setQuery({ ...query, category: e.target.value });
  };

  const { data: blogs = [], error, isLoading } = useFetchBlogsQuery(query);
  console.log(blogs);

  return (
    <div className='container mx-auto px-4 mt-20'>
      {/* Search bar */}
      <Searchblogs
        search={search}
        handleSearchChange={handleSearchChange}
        handleSearch={handleSearch}
        category={category}
        handleCategoryChange={handleCategoryChange}
      />

      {/* Status messages */}
      {isLoading && <Loading />}
      {error && <p className="text-center mt-10 text-red-500">{error?.data?.message || error?.error || JSON.stringify(error)}</p>}
      {!isLoading && blogs.length === 0 && <p className="text-center mt-10 text-gray-600">No blogs found.</p>}

      {/* Blog Cards */}
      <div className='mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
        {blogs.map(blog => (
          <Link
            to={`/blogs/${blog._id}`}
            key={blog._id}
            className='bg-white rounded-md shadow hover:shadow-lg transition duration-300 overflow-hidden flex flex-col'
          >
            <img
              src={blog.coverImg}
              alt={blog.title}
              className='w-full h-64 object-cover'
            />
            <div className='p-4 flex-1 flex flex-col justify-between'>
              <h2 className='text-lg font-semibold text-gray-800 line-clamp-2'>{blog.title}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Blogs;
