import { useState } from 'react'
import { Link } from 'react-router-dom'
import Loading from '../../../Component/Loading'
import { useDeleteBlogMutation, useFetchBlogsQuery } from '../../../redux/features/blogs/blogsApi'
import { useFetchCategoriesQuery } from '../../../redux/features/category/categoryApi'
import { HiOutlineSearch, HiOutlinePencilAlt, HiOutlineTrash, HiOutlineEye, HiOutlinePlus, HiChevronLeft, HiChevronRight } from 'react-icons/hi'

const ManageItems = () => {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
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
      // You could use a toast library here for better UX
      alert('Blog deleted successfully!')
    } catch (err) {
      console.error('Failed to delete blog:', err)
      alert('Failed to delete blog')
    }
  }

  if (isLoading) return <Loading />
  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-red-500 bg-red-50 rounded-xl border border-red-100 m-6">
      <p className="text-lg font-semibold">Error loading blogs</p>
      <p className="text-sm opacity-70">Please check your connection or try again later.</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              Manage Content
            </h1>
            <p className="text-gray-500 mt-1">Review, edit, and organize your blog posts</p>
          </div>
          <Link
            to="/dashboard/add-new-post"
            className="group flex items-center gap-2 bg-[#1E73BE] hover:bg-[#165a96] text-white px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
          >
            <HiOutlinePlus className="text-xl group-hover:rotate-90 transition-transform duration-300" />
            <span>Add New Post</span>
          </Link>
        </div>

        {/* Filters Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Search */}
            <div className="relative">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Search Posts</label>
              <div className="relative">
                <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type="text"
                  placeholder="Search by title..."
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-gray-700"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Filter Category</label>
              <select
                value={category}
                onChange={e => { setCategory(e.target.value); setPage(1); }}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-gray-700 appearance-none cursor-pointer"
              >
                <option value="">All Categories</option>
                {categories?.map(cat => (
                  <option key={cat._id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Items per page */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Show Entries</label>
              <select
                value={limit}
                onChange={(e) => { setLimit(Number(e.target.value)); setPage(1) }}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-gray-700 cursor-pointer"
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">#</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Post Title</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Author Info</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Date Published</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {blogs && blogs.length > 0 ? (
                  blogs.map((blog, index) => (
                    <tr key={blog._id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-400">
                          {((page - 1) * limit + index + 1).toString().padStart(2, '0')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-gray-800 line-clamp-1 max-w-[250px] group-hover:text-blue-600 transition-colors">
                          {blog.title}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                          {blog.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex flex-col">
                          <span className="font-medium">{blog.author?.username || 'Admin'}</span>
                          <span className="text-[10px] text-gray-400 truncate max-w-[150px]">{blog.author?.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(blog.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => window.open(`/blogs/${blog._id}`, '_blank')}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                            title="Preview Post"
                          >
                            <HiOutlineEye className="text-xl" />
                          </button>
                          <Link
                            to={`/dashboard/update-items/${blog._id}`}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                            title="Edit Post"
                          >
                            <HiOutlinePencilAlt className="text-xl" />
                          </Link>
                          <button
                            onClick={() => setDeleteConfirm(blog._id)}
                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                            title="Delete Post"
                          >
                            <HiOutlineTrash className="text-xl" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                          <HiOutlineSearch className="text-3xl text-gray-300" />
                        </div>
                        <p className="text-gray-500 font-medium text-lg">No posts found</p>
                        <p className="text-gray-400 text-sm">Try adjusting your filters or search keywords</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 bg-gray-50/30 border-t border-gray-100 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing <span className="font-semibold text-gray-900">{blogs?.length || 0}</span> entries
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm font-medium"
              >
                <HiChevronLeft className="text-lg" />
                <span>Previous</span>
              </button>
              
              <div className="flex items-center px-4 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700">
                Page {page}
              </div>

              <button
                disabled={!blogs || blogs.length < limit}
                onClick={() => setPage(page + 1)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm font-medium"
              >
                <span>Next</span>
                <HiChevronRight className="text-lg" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <div 
              className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" 
              onClick={() => setDeleteConfirm(null)}
            />
            
            <div className="relative transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-2xl transition-all w-full max-w-md border border-gray-100">
              <div className="flex items-center justify-center w-14 h-14 bg-rose-50 rounded-full mb-4 mx-auto">
                <HiOutlineTrash className="text-3xl text-rose-500" />
              </div>
              
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Blog Post?</h3>
                <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                  Are you sure you want to delete this post? This action cannot be undone and will permanently remove the content from our servers.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl font-semibold transition-all border border-gray-200"
                >
                  Cancel, Keep it
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-semibold shadow-lg shadow-rose-200 transition-all active:scale-95"
                >
                  Yes, Delete Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageItems
