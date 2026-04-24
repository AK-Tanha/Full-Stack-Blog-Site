import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useCreateBlogMutation, useUploadImageMutation } from '../../../redux/features/blogs/blogsApi'
import { useFetchCategoriesQuery } from '../../../redux/features/category/categoryApi'
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { HiOutlineCloudUpload, HiOutlinePhotograph, HiOutlineX } from 'react-icons/hi'

const AddPost = () => {
  const [createBlog, { isLoading }] = useCreateBlogMutation()
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation()
  const { data: categories, isLoading: isCategoriesLoading } = useFetchCategoriesQuery()
  const { user } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: '',
    title_bn: '',
    category: '',
    description: '',
    description_bn: '',
    coverImg: '',
    rating: 0,
    content: '',
    content_bn: ''
  })

  const [activeLang, setActiveLang] = useState('en')
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

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const imageFormData = new FormData()
    imageFormData.append('image', file)

    try {
      const response = await uploadImage(imageFormData).unwrap()
      setFormData({
        ...formData,
        coverImg: response.url
      })
      setSuccess('Image uploaded successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      console.error('Failed to upload image:', err)
      setError('Failed to upload image. Please try again.')
    }
  }

  const handleContentChange = (value) => {
    setFormData({
      ...formData,
      [activeLang === 'en' ? 'content' : 'content_bn']: value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      // Validation
      if (!formData.title || !formData.content || formData.content === '<p><br></p>' || !formData.category) {
        setError('Please fill in all required fields (Title, Category, and Content in English)')
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
        title_bn: '',
        category: '',
        description: '',
        description_bn: '',
        coverImg: '',
        rating: 0,
        content: '',
        content_bn: ''
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
    <div className='max-w-4xl mx-auto bg-white p-5 md:p-10 rounded-2xl md:rounded-[32px] shadow-2xl shadow-gray-200/50 border border-gray-50'>
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-8 md:mb-10">
        <h2 className='text-2xl md:text-3xl font-black uppercase tracking-tight text-gray-900 px-4 md:px-6 py-2 bg-orange-50 border-orange-600 border-l-8'>
          Add New Story
        </h2>
        <div className="hidden md:block h-[2px] flex-grow bg-gray-100"></div>
      </div>

      {error && (
        <div className='bg-red-50 border-l-4 border-red-500 text-red-700 px-4 md:px-6 py-3 md:py-4 rounded-xl mb-8 flex items-center animate-shake'>
          <span className="mr-3 text-lg md:text-xl">⚠️</span>
          <p className="font-bold text-[10px] md:text-sm uppercase tracking-tight">{error}</p>
        </div>
      )}

      {success && (
        <div className='bg-green-50 border-l-4 border-green-500 text-green-700 px-4 md:px-6 py-3 md:py-4 rounded-xl mb-8 flex items-center animate-bounce-subtle'>
          <span className="mr-3 text-lg md:text-xl">✅</span>
          <p className="font-bold text-[10px] md:text-sm uppercase tracking-tight">{success}</p>
        </div>
      )}

      <div className="flex gap-4 mb-8 p-1 bg-gray-100 rounded-2xl w-fit">
        <button
          type="button"
          onClick={() => setActiveLang('en')}
          className={`px-6 py-2 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all ${activeLang === 'en' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          English
        </button>
        <button
          type="button"
          onClick={() => setActiveLang('bn')}
          className={`px-6 py-2 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all ${activeLang === 'bn' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Bangla
        </button>
      </div>

      <form onSubmit={handleSubmit} className='space-y-6 md:space-y-8'>
        {/* Title */}
        <div>
          <label className='block text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-2 md:mb-3'>
            Article Title ({activeLang === 'en' ? 'English' : 'Bangla'}) {activeLang === 'en' && <span className='text-orange-600'>*</span>}
          </label>
          <input
            type='text'
            name={activeLang === 'en' ? 'title' : 'title_bn'}
            value={activeLang === 'en' ? formData.title : formData.title_bn}
            onChange={handleChange}
            className='w-full px-4 md:px-6 py-3 md:py-4 bg-gray-50 border border-transparent rounded-xl md:rounded-2xl focus:bg-white focus:border-orange-600 focus:ring-4 focus:ring-orange-100 transition-all duration-300 font-bold text-lg md:text-xl placeholder:text-gray-300'
            placeholder={activeLang === 'en' ? 'e.g. UFC 300: The Greatest Night...' : 'উদা: ইউএফসি ৩০০: কমব্যাট স্পোর্টস ইতিহাসের সেরা রাত...'}
            required={activeLang === 'en'}
          />
        </div>

        {/* Description */}
        <div>
          <label className='block text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-2 md:mb-3'>
            Short Excerpt / Description ({activeLang === 'en' ? 'English' : 'Bangla'})
          </label>
          <textarea
            name={activeLang === 'en' ? 'description' : 'description_bn'}
            value={activeLang === 'en' ? formData.description : formData.description_bn}
            onChange={handleChange}
            rows="2"
            className='w-full px-4 md:px-6 py-3 md:py-4 bg-gray-50 border border-transparent rounded-xl md:rounded-2xl focus:bg-white focus:border-orange-600 focus:ring-4 focus:ring-orange-100 transition-all duration-300 font-medium text-gray-600 placeholder:text-gray-300 text-sm md:text-base'
            placeholder={activeLang === 'en' ? 'Brief summary for the homepage grid...' : 'হোমপেজ গ্রিডের জন্য সংক্ষিপ্ত সারসংক্ষেপ...'}
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8'>
          {/* Category */}
          <div>
            <label className='block text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-2 md:mb-3'>
              Category <span className='text-orange-600'>*</span>
            </label>
            <select
              name='category'
              value={formData.category}
              onChange={handleChange}
              className='w-full px-4 md:px-6 py-3 md:py-4 bg-gray-50 border border-transparent rounded-xl md:rounded-2xl focus:bg-white focus:border-orange-600 focus:ring-4 focus:ring-orange-100 transition-all duration-300 font-bold text-xs md:text-sm uppercase tracking-widest appearance-none cursor-pointer'
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
            <label className='block text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-2 md:mb-3'>
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
              className='w-full px-4 md:px-6 py-3 md:py-4 bg-gray-50 border border-transparent rounded-xl md:rounded-2xl focus:bg-white focus:border-orange-600 focus:ring-4 focus:ring-orange-100 transition-all duration-300 font-bold'
            />
          </div>
        </div>

        {/* Cover Image Upload */}
        <div>
          <label className="block text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-2 md:mb-3">
            Cover Image <span className='text-orange-600'>*</span>
          </label>
          
          {formData.coverImg ? (
            <div className="relative group rounded-2xl md:rounded-3xl overflow-hidden border-2 border-orange-100 shadow-xl aspect-video md:aspect-[21/9]">
              <img src={formData.coverImg} alt="Cover Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <button 
                  type="button"
                  onClick={() => setShowFull(true)}
                  className="p-2 md:p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-all"
                >
                  <HiOutlinePhotograph className="text-xl md:text-2xl" />
                </button>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, coverImg: ''})}
                  className="p-2 md:p-3 bg-rose-500/80 backdrop-blur-md rounded-full text-white hover:bg-rose-600 transition-all"
                >
                  <HiOutlineX className="text-xl md:text-2xl" />
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
                className={`flex flex-col items-center justify-center w-full aspect-video md:aspect-[21/9] border-4 border-dashed border-gray-100 rounded-2xl md:rounded-[32px] hover:border-orange-200 hover:bg-orange-50/30 transition-all cursor-pointer group ${isUploading ? 'opacity-50 cursor-wait' : ''}`}
              >
                {isUploading ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 md:w-12 md:h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
                    <p className="font-black text-gray-400 uppercase tracking-widest text-[10px] md:text-xs">Uploading Magic...</p>
                  </div>
                ) : (
                  <>
                    <div className="w-14 h-14 md:w-20 md:h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <HiOutlineCloudUpload className="text-2xl md:text-4xl text-gray-300 group-hover:text-orange-500 transition-colors" />
                    </div>
                    <p className="font-black text-gray-900 uppercase tracking-[0.2em] text-[10px] md:text-sm text-center px-4">Drop your visual or Click</p>
                    <p className="text-[9px] md:text-xs text-gray-400 mt-2 font-medium tracking-wide">Supports JPG, PNG, WEBP (Max 5MB)</p>
                  </>
                )}
              </label>
            </div>
          )}
          
          {showFull && (
            <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[100] p-5 md:p-10 backdrop-blur-lg" onClick={() => setShowFull(false)}>
              <img src={formData.coverImg} alt="Full Preview" className="max-w-full max-h-full rounded-2xl md:rounded-3xl shadow-2xl animate-in fade-in zoom-in duration-300" />
            </div>
          )}
        </div>

        {/* Content - React Quill */}
        <div className="pt-4">
          <label className='block text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-2 md:mb-3'>
            Article Content ({activeLang === 'en' ? 'English' : 'Bangla'}) {activeLang === 'en' && <span className='text-orange-600'>*</span>}
          </label>
          <div className="quill-container">
            <ReactQuill 
              theme="snow"
              key={activeLang}
              value={activeLang === 'en' ? formData.content : formData.content_bn}
              onChange={handleContentChange}
              modules={modules}
              formats={formats}
              placeholder={activeLang === 'en' ? "Start writing your combat sports masterpiece..." : "আপনার কমব্যাট স্পোর্টস মাস্টারপিস লেখা শুরু করুন..."}
              className="bg-white rounded-xl md:rounded-[24px] overflow-hidden border-2 border-gray-100 focus-within:border-orange-600 transition-colors"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className='flex flex-col md:flex-row gap-4 pt-8 md:pt-10 border-t border-gray-100'>
          <button
            type='submit'
            disabled={isLoading}
            className='w-full md:w-auto bg-orange-600 text-white px-8 md:px-10 py-3 md:py-4 rounded-xl md:rounded-2xl hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300 font-black uppercase tracking-widest text-[10px] md:text-sm flex items-center justify-center gap-2 shadow-xl shadow-orange-100 hover:shadow-orange-200 active:scale-95'
          >
            {isLoading ? 'Publishing...' : 'Publish Story'}
          </button>
          <button
            type='button'
            onClick={() => navigate('/dashboard/manage-items')}
            className='w-full md:w-auto bg-gray-100 text-gray-900 px-8 md:px-10 py-3 md:py-4 rounded-xl md:rounded-2xl hover:bg-gray-200 transition-all duration-300 font-black uppercase tracking-widest text-[10px] md:text-sm'
          >
            Cancel
          </button>
        </div>
      </form>

      <style dangerouslySetInnerHTML={{ __html: `
        /* Responsive Toolbar */
        .quill-container .ql-toolbar { 
          border: none !important; 
          border-bottom: 1px solid #f3f4f6 !important; 
          padding: 0.75rem !important; 
          background: #fafafa;
          display: flex;
          flex-wrap: nowrap;
          overflow-x: auto;
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none;  /* IE 10+ */
        }
        .quill-container .ql-toolbar::-webkit-scrollbar { display: none; }
        
        .quill-container .ql-formats {
          display: flex;
          align-items: center;
          margin-right: 12px !important;
          flex-shrink: 0;
        }

        .quill-container .ql-container { 
          border: none !important; 
          min-height: 300px; 
          font-size: 1rem; 
        }
        
        @media (min-width: 768px) {
          .quill-container .ql-toolbar { flex-wrap: wrap; overflow-x: visible; padding: 1rem !important; }
          .quill-container .ql-container { min-height: 450px; font-size: 1.1rem; }
        }

        .quill-container .ql-editor { padding: 1.5rem !important; }
        @media (min-width: 768px) {
          .quill-container .ql-editor { padding: 2.5rem !important; }
        }

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
