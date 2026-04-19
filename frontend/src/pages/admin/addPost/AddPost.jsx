import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useCreateBlogMutation } from '../../../redux/features/blogs/blogsApi'
import { useFetchCategoriesQuery } from '../../../redux/features/category/categoryApi'
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const AddPost = () => {
  const [createBlog, { isLoading }] = useCreateBlogMutation()
  const { data: categories, isLoading: isCategoriesLoading } = useFetchCategoriesQuery()
  const { user } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    coverImg: '',
    rating: 0,
    content: ''
  })

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showFull, setShowFull] = useState(false);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleContentChange = (value) => {
    setFormData({
      ...formData,
      content: value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      // Validation
      if (!formData.title || !formData.content || formData.content === '<p><br></p>' || !formData.category) {
        setError('Please fill in all required fields (Title, Category, and Content)')
        return
      }

      await createBlog({
        ...formData,
        author: user._id
      }).unwrap()

      setSuccess('Blog post created successfully!')
      
      // Reset form
      setFormData({
        title: '',
        category: '',
        description: '',
        coverImg: '',
        rating: 0,
        content: ''
      })

      setTimeout(() => {
        navigate('/dashboard/manage-items')
      }, 2000)

    } catch (err) {
      setError(err?.data?.message || 'Failed to create blog post')
      console.error('Error creating blog:', err)
    }
  }

  return (
    <div className='max-w-4xl mx-auto bg-white p-10 rounded-[32px] shadow-2xl shadow-gray-200/50 border border-gray-50'>
      <div className="flex items-center gap-4 mb-10">
        <h2 className='text-3xl font-black uppercase tracking-tight text-gray-900 px-6 py-2 bg-orange-50 border-orange-600 border-l-8'>
          Add New Story
        </h2>
        <div className="h-[2px] flex-grow bg-gray-100"></div>
      </div>

      {error && (
        <div className='bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-xl mb-8 flex items-center animate-shake'>
          <span className="mr-3 text-xl">⚠️</span>
          <p className="font-bold text-sm uppercase tracking-tight">{error}</p>
        </div>
      )}

      {success && (
        <div className='bg-green-50 border-l-4 border-green-500 text-green-700 px-6 py-4 rounded-xl mb-8 flex items-center animate-bounce-subtle'>
          <span className="mr-3 text-xl">✅</span>
          <p className="font-bold text-sm uppercase tracking-tight">{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className='space-y-8'>
        {/* Title */}
        <div>
          <label className='block text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-3'>
            Article Title <span className='text-orange-600'>*</span>
          </label>
          <input
            type='text'
            name='title'
            value={formData.title}
            onChange={handleChange}
            className='w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-orange-600 focus:ring-4 focus:ring-orange-100 transition-all duration-300 font-bold text-xl placeholder:text-gray-300'
            placeholder='e.g. UFC 300: The Greatest Night in Combat Sports History'
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className='block text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-3'>
            Short Excerpt / Description
          </label>
          <textarea
            name='description'
            value={formData.description}
            onChange={handleChange}
            rows="2"
            className='w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-orange-600 focus:ring-4 focus:ring-orange-100 transition-all duration-300 font-medium text-gray-600 placeholder:text-gray-300'
            placeholder='Brief summary for the homepage grid...'
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          {/* Category */}
          <div>
            <label className='block text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-3'>
              Category <span className='text-orange-600'>*</span>
            </label>
            <select
              name='category'
              value={formData.category}
              onChange={handleChange}
              className='w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-orange-600 focus:ring-4 focus:ring-orange-100 transition-all duration-300 font-bold text-sm uppercase tracking-widest appearance-none cursor-pointer'
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
            <label className='block text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-3'>
              Story Impact Rating (0-5)
            </label>
            <input
              type='number'
              name='rating'
              value={formData.rating}
              onChange={handleChange}
              min='0'
              max='5'
              step='0.1'
              className='w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-orange-600 focus:ring-4 focus:ring-orange-100 transition-all duration-300 font-bold'
            />
          </div>
        </div>

        {/* Cover Image URL */}
        <div>
          <label className="block text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-3">
            Cover Image URL
          </label>
          <div className="flex gap-4">
            <input
              type="url"
              name="coverImg"
              value={formData.coverImg}
              onChange={handleChange}
              className="flex-grow px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-orange-600 focus:ring-4 focus:ring-orange-100 transition-all duration-300 font-medium"
              placeholder="https://images.unsplash.com/..."
            />
            {formData.coverImg && (
              <div 
                className="w-14 h-14 rounded-2xl overflow-hidden cursor-pointer border-2 border-orange-100 shadow-lg hover:scale-110 transition-transform"
                onClick={() => setShowFull(true)}
              >
                <img src={formData.coverImg} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
          
          {showFull && (
            <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] p-10" onClick={() => setShowFull(false)}>
              <img src={formData.coverImg} alt="Full Preview" className="max-w-full max-h-full rounded-3xl shadow-2xl" />
            </div>
          )}
        </div>

        {/* Content - React Quill */}
        <div className="pt-4">
          <label className='block text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-3'>
            Article Content <span className='text-orange-600'>*</span>
          </label>
          <div className="quill-container">
            <ReactQuill 
              theme="snow"
              value={formData.content}
              onChange={handleContentChange}
              modules={modules}
              formats={formats}
              placeholder="Start writing your combat sports masterpiece..."
              className="bg-white rounded-[24px] overflow-hidden border-2 border-gray-100 focus-within:border-orange-600 transition-colors"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className='flex gap-4 pt-10 border-t border-gray-100'>
          <button
            type='submit'
            disabled={isLoading}
            className='bg-orange-600 text-white px-10 py-4 rounded-2xl hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300 font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 shadow-xl shadow-orange-100 hover:shadow-orange-200 active:scale-95'
          >
            {isLoading ? 'Publishing...' : 'Publish Story'}
          </button>
          <button
            type='button'
            onClick={() => navigate('/dashboard/manage-items')}
            className='bg-gray-100 text-gray-900 px-10 py-4 rounded-2xl hover:bg-gray-200 transition-all duration-300 font-black uppercase tracking-widest text-sm'
          >
            Cancel
          </button>
        </div>
      </form>

      <style dangerouslySetInnerHTML={{ __html: `
        .quill-container .ql-toolbar { border: none !important; border-bottom: 1px solid #f3f4f6 !important; padding: 1rem !important; background: #fafafa; }
        .quill-container .ql-container { border: none !important; min-height: 400px; font-size: 1.1rem; }
        .quill-container .ql-editor { padding: 2rem !important; }
        .quill-container .ql-editor.ql-blank::before { color: #d1d5db; font-style: normal; }
        .animate-shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
        @keyframes shake {
          10, 90% { transform: translate3d(-1px, 0, 0); }
          20, 80% { transform: translate3d(2px, 0, 0); }
          30, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40, 60% { transform: translate3d(4px, 0, 0); }
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-subtle { animation: bounce-subtle 2s infinite; }
      `}} />
    </div>
  )
}

export default AddPost
