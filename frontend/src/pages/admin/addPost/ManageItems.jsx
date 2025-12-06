import { useState } from 'react'
import { Link } from 'react-router-dom'
import Loading from '../../../Component/Loading'
import { useDeleteBlogMutation, useFetchBlogsQuery } from '../../../redux/features/blogs/blogsApi'
import { useFetchCategoriesQuery } from '../../../redux/features/category/categoryApi'

const ManageItems = () => {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const { data: categories } = useFetchCategoriesQuery()
  
  const { data: blogs, isLoading, error } = useFetchBlogsQuery({ 
    search, 
    category, 
    location: '' 
  })
  
  const [deleteBlog] = useDeleteBlogMutation()
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const handleDelete = async (id) => {
    try {
      await deleteBlog(id).unwrap()
      setDeleteConfirm(null)
      alert('Blog deleted successfully!')
    } catch (err) {
      console.error('Failed to delete blog:', err)
      alert('Failed to delete blog')
    }
  }

  if (isLoading) {
    return <Loading />
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error loading blogs</div>
  }

  return (
    <div className='max-w-7xl mx-auto bg-white p-8 rounded-lg shadow-lg'>
      <div className='flex flex-col md:flex-row justify-between items-center mb-8 border-b pb-4'>
        <h2 className='text-3xl font-bold text-gray-800'>Manage Blog Posts</h2>
        <Link 
          to='/dashboard/add-new-post'
          className='bg-[#1E73BE] text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center gap-2 font-medium mt-4 md:mt-0'
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add New Post
        </Link>
      </div>

      {/* Search and Filter */}
      <div className='bg-gray-50 p-6 rounded-lg border border-gray-100 mb-8'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <label className='block text-sm font-medium text-gray-600 mb-2'>
              Search
            </label>
            <input
              type='text'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder='Search by title or content...'
              className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-600 mb-2'>
              Filter by Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200'
            >
              <option value=''>All Categories</option>
              {categories && categories.map((cat) => (
                  <option key={cat._id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Blogs Table */}
      <div className='bg-white border rounded-lg overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-gray-50 border-b border-gray-200'>
              <tr>
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                  Title
                </th>
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                  Category
                </th>
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                  Author
                </th>
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                  Created
                </th>
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {blogs && blogs.length > 0 ? (
                blogs.map((blog) => (
                  <tr key={blog._id} className='hover:bg-gray-50 transition duration-150'>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm font-medium text-gray-900 line-clamp-1'>
                        {blog.title}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span className='px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-100'>
                        {blog.category}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {blog.author?.email || 'Unknown'}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                      <div className='flex items-center gap-4'>
                        <Link
                          to={`/dashboard/update-items/${blog._id}`}
                          className='text-indigo-600 hover:text-indigo-900 flex items-center gap-1 transition duration-200'
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </Link>
                        <button
                          onClick={() => setDeleteConfirm(blog._id)}
                          className='text-red-500 hover:text-red-700 flex items-center gap-1 transition duration-200'
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan='5' className='px-6 py-12 text-center text-gray-500 bg-gray-50'>
                    No blogs found. Try adjusting your search or add a new post.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm transition-opacity'>
          <div className='bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl transform transition-all'>
            <h3 className='text-xl font-bold mb-4 text-gray-800'>Confirm Delete</h3>
            <p className='text-gray-600 mb-8'>
              Are you sure you want to delete this blog post? This action cannot be undone.
            </p>
            <div className='flex gap-4 justify-end'>
              <button
                onClick={() => setDeleteConfirm(null)}
                className='px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition duration-200'
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className='px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition duration-200 shadow-md hover:shadow-lg'
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageItems
