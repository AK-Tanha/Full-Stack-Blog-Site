import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useCreateBlogMutation } from '../../../redux/features/blogs/blogsApi'

const AddPost = () => {
  const [createBlog, { isLoading }] = useCreateBlogMutation()
  const { user } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    description: '',
    coverImg: '',
    rating: 0
  })

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

    // Validation
    if (!formData.title || !formData.content || !formData.category) {
      setError('Please fill in all required fields')
      return
    }

    try {
      const response = await createBlog({
        ...formData,
        author: user._id
      }).unwrap()

      setSuccess('Blog post created successfully!')
      
      // Reset form
      setFormData({
        title: '',
        content: '',
        category: '',
        description: '',
        coverImg: '',
        rating: 0
      })

      // Redirect to manage items after 2 seconds
      setTimeout(() => {
        navigate('/dashboard/manage-items')
      }, 2000)

    } catch (err) {
      setError(err?.data?.message || 'Failed to create blog post')
      console.error('Error creating blog:', err)
    }
  }

  return (
    <div className='bg-white rounded-lg shadow-md p-6'>
      <h2 className='text-2xl font-bold mb-6'>Add New Blog Post</h2>

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
            disabled={isLoading}
            className='bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed'
          >
            {isLoading ? 'Creating...' : 'Create Post'}
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

export default AddPost
