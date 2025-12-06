import { useState } from 'react'
import { Link } from 'react-router-dom'
import Loading from '../../../Component/Loading'
import { useDeleteBlogMutation, useFetchBlogsQuery } from '../../../redux/features/blogs/blogsApi'

const ManageItems = () => {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  
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
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-bold'>Manage Blog Posts</h2>
        <Link 
          to='/dashboard/add-new-post'
          className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600'
        >
          Add New Post
        </Link>
      </div>

      {/* Search and Filter */}
      <div className='bg-white p-4 rounded-lg shadow-md'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Search
            </label>
            <input
              type='text'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder='Search by title or content...'
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            >
              <option value=''>All Categories</option>
              <option value='Technology'>Technology</option>
              <option value='Travel'>Travel</option>
              <option value='Food'>Food</option>
              <option value='Lifestyle'>Lifestyle</option>
              <option value='Business'>Business</option>
              <option value='Health'>Health</option>
              <option value='Education'>Education</option>
            </select>
          </div>
        </div>
      </div>

      {/* Blogs Table */}
      <div className='bg-white rounded-lg shadow-md overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-gray-50 border-b border-gray-200'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Title
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Category
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Author
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Created
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {blogs && blogs.length > 0 ? (
                blogs.map((blog) => (
                  <tr key={blog._id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm font-medium text-gray-900'>
                        {blog.title}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800'>
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
                      <Link
                        to={`/dashboard/update-items/${blog._id}`}
                        className='text-indigo-600 hover:text-indigo-900 hover:underline cursor-pointer mr-4'
                      >
                       Edit
                      </Link>
                      <button
                        onClick={() => setDeleteConfirm(blog._id)}
                        className='text-red-600 hover:text-red-900 ml-4'
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan='5' className='px-6 py-4 text-center text-gray-500'>
                    No blogs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 max-w-md w-full mx-4'>
            <h3 className='text-lg font-bold mb-4'>Confirm Delete</h3>
            <p className='text-gray-600 mb-6'>
              Are you sure you want to delete this blog post? This action cannot be undone.
            </p>
            <div className='flex gap-4 justify-end'>
              <button
                onClick={() => setDeleteConfirm(null)}
                className='px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400'
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className='px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600'
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
