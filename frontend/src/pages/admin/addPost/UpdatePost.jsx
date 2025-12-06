import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import Loading from '../../../Component/Loading'
import { useFetchBlogsByIDQuery, useUpdateBlogMutation } from '../../../redux/features/blogs/blogsApi'
import { useFetchCategoriesQuery } from '../../../redux/features/category/categoryApi'

const UpdatePost = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation()
  const { data: blogData, isLoading: isFetching, refetch } = useFetchBlogsByIDQuery(id)
  const { data: categories } = useFetchCategoriesQuery()

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    description: '',
    coverImg: '',
    rating: 0
  })

  // Populate form when data is fetched
  useEffect(() => {
    if (blogData && blogData.post) {
      const post = blogData.post
      
      // Handle content conversion from EditorJS object to string for textarea
      let contentText = ''
      if (post.content && typeof post.content === 'object' && Array.isArray(post.content.blocks)) {
        // Extract text from blocks
        contentText = post.content.blocks.map(block => block.data.text).join('\n\n')
      } else if (typeof post.content === 'string') {
        contentText = post.content
      }

      setFormData({
        title: post.title || '',
        content: contentText,
        category: post.category || '',
        description: post.description || '',
        coverImg: post.coverImg || '',
        rating: post.rating || 0
      })
    }
  }, [blogData])

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!formData.title || !formData.content || !formData.category) {
      setError('Please fill in all required fields')
      return
    }

    try {
      // Wrap content in EditorJS structure
      const contentObject = {
        time: Date.now(),
        blocks: [
          {
            type: "paragraph",
            data: {
              text: formData.content,
            },
          },
        ],
        version: "2.22.2"
      }

      const updatedData = {
        ...formData,
        content: contentObject,
        author: user._id // Keep author or update if needed, usually admin updates stay as admin
      }

      const response = await updateBlog({
        id,
        ...updatedData
      }).unwrap()

      setSuccess('Blog post updated successfully!')
      
      // Redirect to manage items after 2 seconds
      setTimeout(() => {
        navigate('/dashboard/manage-items')
      }, 2000)

    } catch (err) {
      setError(err?.data?.message || 'Failed to update blog post')
      console.error('Error updating blog:', err)
    }
  }

  if (isFetching) {
    return <Loading />
  }

  return (
    <div className='max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg'>
      <h2 className='text-3xl font-bold mb-8 text-gray-800 border-b pb-4'>Update Blog Post</h2>

      {error && (
        <div className='bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-6 flex items-center'>
          <span className="mr-2">⚠️</span>
          {error}
        </div>
      )}

      {success && (
        <div className='bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded mb-6 flex items-center'>
          <span className="mr-2">✅</span>
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Title */}
        <div>
          <label className='block text-sm font-medium text-gray-600 mb-2'>
            Title <span className='text-red-500'>*</span>
          </label>
          <input
            type='text'
            name='title'
            value={formData.title}
            onChange={handleChange}
            className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200'
            placeholder='Enter blog title'
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className='block text-sm font-medium text-gray-600 mb-2'>
            Description
          </label>
          <input
            type='text'
            name='description'
            value={formData.description}
            onChange={handleChange}
            className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200'
            placeholder='Brief description'
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Category */}
            <div>
            <label className='block text-sm font-medium text-gray-600 mb-2'>
                Category <span className='text-red-500'>*</span>
            </label>
            <select
                name='category'
                value={formData.category}
                onChange={handleChange}
                className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200'
                required
            >
                <option value=''>Select a category</option>
                {categories && categories.map((cat) => (
                    <option key={cat._id} value={cat.name}>{cat.name}</option>
                ))}
            </select>
            </div>

            {/* Rating */}
            <div>
            <label className='block text-sm font-medium text-gray-600 mb-2'>
                Rating (0-5)
            </label>
            <input
                type='number'
                name='rating'
                value={formData.rating}
                onChange={handleChange}
                min='0'
                max='5'
                step='0.1'
                className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200'
            />
            </div>
        </div>

        {/* Cover Image URL */}
        <div>
          <label className='block text-sm font-medium text-gray-600 mb-2'>
            Cover Image URL
          </label>
          <input
            type='url'
            name='coverImg'
            value={formData.coverImg}
            onChange={handleChange}
            className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200'
            placeholder='https://example.com/image.jpg'
          />
           {formData.coverImg && (
              <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">Preview:</p>
                  <img src={formData.coverImg} alt="Preview" className="h-40 w-full object-cover rounded-lg border border-gray-200" onError={(e) => e.target.style.display = 'none'} />
              </div>
          )}
        </div>

        {/* Content */}
        <div>
          <label className='block text-sm font-medium text-gray-600 mb-2'>
            Content <span className='text-red-500'>*</span>
          </label>
          <textarea
            name='content'
            value={formData.content}
            onChange={handleChange}
            rows='12'
            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 resize-y font-mono text-sm'
            placeholder='Write your blog content here...'
            required
          />
        </div>

        {/* Submit Button */}
        <div className='flex gap-4 pt-4 border-t border-gray-100'>
          <button
            type='submit'
            disabled={isUpdating}
             className='bg-[#1E73BE] text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200 font-medium text-lg flex items-center justify-center gap-2 min-w-[150px]'
          >
            {isUpdating ? 'Updating...' : 'Update Post'}
          </button>
          <button
            type='button'
            onClick={() => navigate('/dashboard/manage-items')}
             className='bg-gray-100 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-200 transition duration-200 font-medium text-lg'
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default UpdatePost
