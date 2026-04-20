import React, { useEffect, useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import Loading from '../../../Component/Loading'
import { useFetchBlogsByIDQuery, useUpdateBlogMutation, useUploadImageMutation } from '../../../redux/features/blogs/blogsApi'
import { useFetchCategoriesQuery } from '../../../redux/features/category/categoryApi'
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { FaFileAlt, FaArrowLeft } from 'react-icons/fa'
import { HiOutlineCloudUpload, HiOutlinePhotograph, HiOutlineX } from 'react-icons/hi'

const UpdatePost = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation()
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation()
  const { data: blogData, isLoading: isFetching } = useFetchBlogsByIDQuery(id)
  const { data: categories } = useFetchCategoriesQuery()
  const [showFull, setShowFull] = useState(false);

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

  // Memoize Quill modules to prevent re-registration issues
  const quillModules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image', 'video'],
      ['clean']
    ],
  }), []);

  const quillFormats = useMemo(() => [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'indent',
    'link', 'image', 'video'
  ], []);

  const [hasInitialized, setHasInitialized] = useState(false);

  // Populate form when data is fetched
  useEffect(() => {
    if (blogData && !hasInitialized) {
      const post = blogData.post || blogData.data || blogData;
      const actualPost = Array.isArray(post) ? post[0] : post;

      if (actualPost && (actualPost.title || actualPost._id)) {
        let initialContent = ''
        if (typeof actualPost.content === 'string') {
          initialContent = actualPost.content
        } else if (actualPost.content && typeof actualPost.content === 'object' && Array.isArray(actualPost.content.blocks)) {
          initialContent = actualPost.content.blocks.map(block => {
            if (block.type === 'paragraph') return `<p>${block.data.text}</p>`;
            if (block.type === 'header') return `<h${block.data.level}>${block.data.text}</h${block.data.level}>`;
            return `<p>${block.data.text || ''}</p>`;
          }).join('')
        }

        setFormData({
          title: actualPost.title || '',
          category: actualPost.category || '',
          description: actualPost.description || '',
          coverImg: actualPost.coverImg || '',
          rating: actualPost.rating || 0,
          content: initialContent || ''
        });
        setHasInitialized(true);
      }
    }
  }, [blogData, hasInitialized]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const imageFormData = new FormData()
    imageFormData.append('image', file)

    try {
      const response = await uploadImage(imageFormData).unwrap()
      setFormData(prev => ({
        ...prev,
        coverImg: response.url
      }))
      setSuccess('Image updated successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      console.error('Failed to upload image:', err)
      setError('Failed to upload image. Please try again.')
    }
  }

  const handleContentChange = (value) => {
    setFormData(prev => ({
      ...prev,
      content: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!formData.title || !formData.content || formData.content === '<p><br></p>' || !formData.category) {
      setError('Please fill in all required fields (Title, Category, and Content)')
      return
    }

    try {
      await updateBlog({
        id,
        ...formData,
        author: user._id
      }).unwrap()

      setSuccess('Article updated successfully!')
      
      setTimeout(() => {
        navigate('/dashboard/manage-items')
      }, 2000)

    } catch (err) {
      setError(err?.data?.message || 'Failed to update story')
      console.error('Error updating blog:', err)
    }
  }

  if (isFetching && !hasInitialized) {
    return (
      <div className="flex justify-center items-center py-40">
        <Loading />
      </div>
    )
  }

  return (
    <div className='max-w-4xl mx-auto bg-white p-10 rounded-[32px] shadow-2xl shadow-gray-200/50 border border-gray-50'>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-gray-50 pb-8'>
        <div className="flex items-center gap-4">
          <h2 className='text-3xl font-black uppercase tracking-tight text-gray-900 px-6 py-2 bg-amber-50 border-amber-500 border-l-8'>
            Update Story
          </h2>
        </div>
        <button 
          onClick={() => navigate('/dashboard/manage-items')}
          className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-orange-600 transition-colors group"
        >
          <FaArrowLeft className="group-hover:-translate-x-2 transition-transform" /> Back to Database
        </button>
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

        {/* Cover Image Upload */}
        <div>
          <label className="block text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-3">
            Cover Image <span className='text-orange-600'>*</span>
          </label>
          
          {formData.coverImg ? (
            <div className="relative group rounded-3xl overflow-hidden border-2 border-orange-100 shadow-xl aspect-video md:aspect-[21/9]">
              <img src={formData.coverImg} alt="Cover Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <button 
                  type="button"
                  onClick={() => setShowFull(true)}
                  className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-all"
                >
                  <HiOutlinePhotograph className="text-2xl" />
                </button>
                <button 
                  type="button"
                  onClick={() => setFormData(prev => ({...prev, coverImg: ''}))}
                  className="p-3 bg-rose-500/80 backdrop-blur-md rounded-full text-white hover:bg-rose-600 transition-all"
                >
                  <HiOutlineX className="text-2xl" />
                </button>
              </div>
            </div>
          ) : (
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="coverImageUpload"
                disabled={isUploading}
              />
              <label
                htmlFor="coverImageUpload"
                className={`flex flex-col items-center justify-center w-full aspect-video md:aspect-[21/9] border-4 border-dashed border-gray-100 rounded-[32px] hover:border-orange-200 hover:bg-orange-50/30 transition-all cursor-pointer group ${isUploading ? 'opacity-50 cursor-wait' : ''}`}
              >
                {isUploading ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
                    <p className="font-black text-gray-400 uppercase tracking-widest text-xs">Uploading Magic...</p>
                  </div>
                ) : (
                  <>
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <HiOutlineCloudUpload className="text-4xl text-gray-300 group-hover:text-orange-500 transition-colors" />
                    </div>
                    <p className="font-black text-gray-900 uppercase tracking-[0.2em] text-sm">Update your visual or Click</p>
                    <p className="text-xs text-gray-400 mt-2 font-medium tracking-wide">Supports JPG, PNG, WEBP (Max 5MB)</p>
                  </>
                )}
              </label>
            </div>
          )}
          
          {showFull && (
            <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[100] p-10 backdrop-blur-lg" onClick={() => setShowFull(false)}>
              <img src={formData.coverImg} alt="Full Preview" className="max-w-full max-h-full rounded-3xl shadow-2xl animate-in fade-in zoom-in duration-300" />
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
              modules={quillModules}
              formats={quillFormats}
              placeholder="Refine your combat sports masterpiece..."
              className="bg-white rounded-[24px] overflow-hidden border-2 border-gray-100 focus-within:border-orange-600 transition-colors"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className='flex gap-4 pt-10 border-t border-gray-100'>
          <button
            type='submit'
            disabled={isUpdating}
            className='bg-orange-600 text-white px-10 py-4 rounded-2xl hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300 font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 shadow-xl shadow-orange-100 hover:shadow-orange-200 active:scale-95'
          >
            {isUpdating ? 'Updating...' : 'Save Changes'}
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

export default UpdatePost
