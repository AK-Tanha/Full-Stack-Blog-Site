import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import Loading from '../../../Component/Loading'
import { useFetchBlogsByIDQuery, useUpdateBlogMutation } from '../../../redux/features/blogs/blogsApi'

const UpdatePost = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation()
  const { data: blogData, isLoading: isFetching, refetch } = useFetchBlogsByIDQuery(id)

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
    <div className='bg-white rounded-lg shadow-md p-6'>
      <h2 className='text-2xl font-bold mb-6'>Update Blog Post</h2>

      {error && (
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
          {error}
        </div>
      )}

      {success && (
        <div className='bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4'>
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className='space-y-4'>
        {/* Title */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Title <span className='text-red-500'>*</span>
          </label>
          <input
            type='text'
            name='title'
            value={formData.title}
            onChange={handleChange}
            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            placeholder='Enter blog title'
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Description
          </label>
          <input
            type='text'
            name='description'
            value={formData.description}
            onChange={handleChange}
            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            placeholder='Brief description'
          />
        </div>

        {/* Category */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Category <span className='text-red-500'>*</span>
          </label>
          <select
            name='category'
            value={formData.category}
            onChange={handleChange}
            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            required
          >
            <option value=''>Select a category</option>
            <option value='Technology'>Technology</option>
            <option value='Travel'>Travel</option>
            <option value='Food'>Food</option>
            <option value='Lifestyle'>Lifestyle</option>
            <option value='Business'>Business</option>
            <option value='Health'>Health</option>
            <option value='Education'>Education</option>
          </select>
        </div>

        {/* Cover Image URL */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Cover Image URL
          </label>
          <input
            type='url'
            name='coverImg'
            value={formData.coverImg}
            onChange={handleChange}
            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            placeholder='https://example.com/image.jpg'
          />
        </div>

        {/* Rating */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
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
            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          />
        </div>

        {/* Content */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Content <span className='text-red-500'>*</span>
          </label>
          <textarea
            name='content'
            value={formData.content}
            onChange={handleChange}
            rows='10'
            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            placeholder='Write your blog content here...'
            required
          />
        </div>

        {/* Submit Button */}
        <div className='flex gap-4'>
          <button
            type='submit'
            disabled={isUpdating}
            className='bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed'
          >
            {isUpdating ? 'Updating...' : 'Update Post'}
          </button>
          <button
            type='button'
            onClick={() => navigate('/dashboard/manage-items')}
            className='bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400'
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default UpdatePost
