import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useCreateBlogMutation } from '../../../redux/features/blogs/blogsApi'
import { useFetchCategoriesQuery } from '../../../redux/features/category/categoryApi'

const AddPost = () => {
  const [createBlog, { isLoading }] = useCreateBlogMutation()
  const { data: categories, isLoading: isCategoriesLoading } = useFetchCategoriesQuery()
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
  const [showFull, setShowFull] = useState(false);

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

      const response = await createBlog({
        ...formData,
        content: contentObject,
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
    <div className='max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg'>
      <h2 className='text-3xl font-bold mb-8 text-gray-800 border-b pb-4'>Add New Blog Post</h2>

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
            placeholder='Brief description or excerpt'
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
  <label className="block text-sm font-medium text-gray-600 mb-2">
    Cover Image URL
  </label>

  <input
    type="url"
    name="coverImg"
    value={formData.coverImg}
    onChange={handleChange}
    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg 
               focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
    placeholder="https://example.com/image.jpg"
  />

  {formData.coverImg && (
  <div className="mt-4">
    <p className="text-sm text-gray-500 mb-2">Preview:</p>

    {/* Thumbnail Preview */}
    <div
      className="w-32 h-32 border border-gray-300 rounded-lg overflow-hidden cursor-pointer group"
      onClick={() => setShowFull(true)}
    >
      <img
        src={formData.coverImg}
        alt="Thumbnail"
        className="w-full h-full object-cover group-hover:opacity-75 transition"
        onError={(e) => (e.target.style.display = "none")}
      />
    </div>

    {/* Full Image Modal */}
    {showFull && (
      <div
        className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
        onClick={() => setShowFull(false)}
      >
        <img
          src={formData.coverImg}
          alt="Full Preview"
          className="max-w-3xl max-h-[80vh] rounded-lg shadow-lg"
          onError={(e) => (e.target.style.display = "none")}
        />
      </div>
    )}
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
            placeholder='Write your blog content here (Markdown or raw text)...'
            required
          />
        </div>

        {/* Submit Button */}
        <div className='flex gap-4 pt-4 border-t border-gray-100'>
          <button
            type='submit'
            disabled={isLoading}
            className='bg-[#1E73BE] text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200 font-medium text-lg flex items-center justify-center gap-2 min-w-[150px]'
          >
            {isLoading ? 'Creating...' : 'Create Post'}
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

export default AddPost
