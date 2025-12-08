import { useState } from 'react'
import { Link } from 'react-router-dom'
import Loading from '../../../Component/Loading'
import { useDeleteBlogMutation, useFetchBlogsQuery } from '../../../redux/features/blogs/blogsApi'
import { useFetchCategoriesQuery } from '../../../redux/features/category/categoryApi'
//import { EyeIcon } from 'lucide-react'

const ManageItems = () => {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10) // default items per page
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const { data: categories } = useFetchCategoriesQuery()
  const { data: blogs, isLoading, error } = useFetchBlogsQuery({
    search,
    category,
    page,
    limit,
  })
  const [deleteBlog] = useDeleteBlogMutation()


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

  if (isLoading) return <Loading />
  if (error) return <div className="text-center py-8 text-red-500">Error loading blogs</div>

  return (
    // Full page fixed height
    <div className="h-screen flex flex-col max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">

      {/* Header */}
      <div className='flex flex-col md:flex-row justify-between items-center border-b pb-4'>
        <h2 className='text-3xl font-bold text-gray-800'>Manage Blog Posts</h2>
        <Link
          to='/dashboard/add-new-post'
          className='bg-[#1E73BE] text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center gap-2 font-medium mt-4 md:mt-0'
        >
          Add New Post
        </Link>
      </div>

      <div className='bg-gray-50 p-4 rounded-lg border border-gray-100 my-4'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>

          {/* Search */}
          <div>
            <label className='block text-sm font-medium text-gray-600 mb-2'>Search</label>
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200'
            />
          </div>

          {/* Category Filter */}
          <div>
            <label className='block text-sm font-medium text-gray-600 mb-2'>Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200'
            >
              <option value=''>All Categories</option>
              {categories?.map(cat => (
                <option key={cat._id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Items per page */}
          <div>
            <label className='block text-sm font-medium text-gray-600 mb-2'>Items per page</label>
            <select
              value={limit}
              onChange={(e) => { setLimit(Number(e.target.value)); setPage(1) }}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200'
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

        </div>
      </div>


      {/* Scrollable Table */}
      <div className='flex-1 overflow-auto'>
        <div className='overflow-x-auto overflow-y-auto max-h-[500px]'>
          <table className='min-w-max border-collapse w-full'>
            <thead className='bg-gray-50 sticky top-0 z-20'>
              <tr>
                <th className='px-4 py-2 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>Title</th>
                <th className='px-4 py-2 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>Category</th>
                <th className='px-4 py-2 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>Author</th>
                <th className='px-4 py-2 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>Created</th>
                <th className='px-4 py-2 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs && blogs.length > 0 ? (
                blogs.map(blog => (
                  <tr key={blog._id} className='hover:bg-gray-50'>
                    <td className='px-4 py-2 border-b'>
                      <div className='text-sm font-medium text-gray-900 truncate max-w-xs'>
                        {blog.title}
                      </div>
                    </td>

                    <td className='px-4 py-2 border-b'>{blog.category}</td>
                    <td className='px-4 py-2 border-b'>{blog.author?.email || 'Unknown'}</td>
                    <td className='px-4 py-2 border-b'>{new Date(blog.createdAt).toLocaleDateString()}</td>
                    <td className='px-4 py-2 border-b w-32'>
                      <div className='flex items-center justify-start gap-2'>
                        {/* View */}
                        <button
                          onClick={() => window.open(`/blogs/${blog._id}`, '_blank')}
                          className='text-green-600 hover:text-green-900'
                          title='View'
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </button>

                        {/* Edit */}
                        <Link
                          to={`/dashboard/update-items/${blog._id}`}
                          title='Edit'
                          className='text-indigo-600 hover:text-indigo-900'
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1-9l3 3-8 8H6v-3l8-8z" />
                          </svg>
                        </Link>

                        {/* Delete */}
                        <button
                          onClick={() => setDeleteConfirm(blog._id)}
                          title='Delete'
                          className='text-red-500 hover:text-red-700'
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan='5' className='px-4 py-8 text-center text-gray-500'>No blogs found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>



      {/* Pagination */}
      <div className='flex justify-between items-center mt-4'>
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className='px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-40'
        >
          Prev
        </button>
        <span>Page {page}</span>
        <button
          disabled={!blogs || blogs.length < limit}
          onClick={() => setPage(page + 1)}
          className='px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-40'
        >
          Next
        </button>
      </div>

      {/* Delete Modal */}
      {deleteConfirm && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white p-6 rounded-lg shadow-lg max-w-sm w-full'>
            <h3 className='text-lg font-bold mb-4'>Confirm Delete</h3>
            <p className='mb-6'>Are you sure you want to delete this blog? This cannot be undone.</p>
            <div className='flex justify-end gap-4'>
              <button onClick={() => setDeleteConfirm(null)} className='px-4 py-2 bg-gray-200 rounded-lg'>Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className='px-4 py-2 bg-red-600 text-white rounded-lg'>Delete</button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default ManageItems
