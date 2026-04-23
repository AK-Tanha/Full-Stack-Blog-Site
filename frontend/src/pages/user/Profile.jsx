import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useGetUserProfileQuery, useUpdateUserProfileMutation } from '../../redux/features/auth/authAPI'
import { useUploadImageMutation } from '../../redux/features/blogs/blogsApi'
import { setUser } from '../../redux/features/auth/authSlice'
import Loading from '../../Component/Loading'

const Profile = () => {
  const { user: authUser } = useSelector((state) => state.auth)
  const { data: profileData, isLoading, refetch } = useGetUserProfileQuery()
  const [updateProfile, { isLoading: isUpdating }] = useUpdateUserProfileMutation()
  const [uploadImageMutation] = useUploadImageMutation()
  const dispatch = useDispatch()

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    profileImage: '',
    password: ''
  })
  const [imageFile, setImageFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    if (profileData?.user) {
      setFormData({
        username: profileData.user.username || '',
        email: profileData.user.email || '',
        profileImage: profileData.user.profileImage || ''
      })
    }
  }, [profileData])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
    }
  }

  const uploadImage = async () => {
    if (!imageFile) return formData.profileImage
    
    setIsUploading(true)
    try {
      const uploadData = new FormData()
      uploadData.append('image', imageFile)
      const uploadResponse = await uploadImageMutation(uploadData).unwrap()
      setIsUploading(false)
      return uploadResponse.url
    } catch (err) {
      console.error('Image upload failed:', err)
      setIsUploading(false)
      return formData.profileImage
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage({ type: '', text: '' })
    
    try {
      const profileImageUrl = await uploadImage()
      
      const payload = { 
        username: formData.username, 
        profileImage: profileImageUrl 
      }
      
      if (formData.password) {
        payload.password = formData.password
      }

      const updatedUser = await updateProfile(payload).unwrap()
      
      // Update local state and Redux
      dispatch(setUser({ user: updatedUser.user, token: localStorage.getItem('token') }))
      setFormData(prev => ({ ...prev, password: '' }))
      setMessage({ type: 'success', text: 'Profile updated successfully!' })
      refetch()
    } catch (err) {
      console.error('Profile update error:', err)
      setMessage({ type: 'error', text: err.data?.message || 'Failed to update profile' })
    }
  }

  if (isLoading) return <div className="py-20 text-center"><Loading /></div>

  const user = profileData?.user || authUser

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-[40px] shadow-2xl shadow-gray-200/50 overflow-hidden border border-gray-100">
          {/* Cover Header */}
          <div className="h-48 bg-gradient-to-r from-indigo-600 to-purple-600 relative">
            <div className="absolute -bottom-16 left-12">
              <div className="relative group">
                <div className="w-32 h-32 rounded-[32px] bg-white p-1.5 shadow-2xl">
                  <div className="w-full h-full rounded-[28px] overflow-hidden bg-indigo-50 flex items-center justify-center">
                    {imageFile ? (
                      <img src={URL.createObjectURL(imageFile)} alt="Preview" className="w-full h-full object-cover" />
                    ) : formData.profileImage ? (
                      <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-4xl font-black text-indigo-300">{user?.username?.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                </div>
                <label className="absolute bottom-0 right-0 bg-white p-2 rounded-xl shadow-lg border border-gray-100 cursor-pointer hover:scale-110 transition-transform active:scale-95">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                </label>
              </div>
            </div>
          </div>

          <div className="pt-24 pb-12 px-6 md:px-12">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 text-center md:text-left">
              <div className="flex-1 space-y-2">
                <h1 className="text-2xl md:text-4xl font-black text-gray-900 uppercase tracking-tight">{user?.username}</h1>
                <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs">
                   {user?.role} • Member since {new Date(user?.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
              </div>
              
              <div className="bg-indigo-50 px-6 py-3 rounded-2xl border border-indigo-100 w-full md:w-auto">
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Status</p>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-black text-indigo-900 uppercase">Active Account</span>
                </div>
              </div>
            </div>

            <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Display Name</label>
                      <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-[20px] focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-gray-700"
                        placeholder="Enter your username"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Email Address</label>
                      <input
                        type="email"
                        value={formData.email}
                        disabled
                        className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-[20px] font-bold text-gray-400 cursor-not-allowed"
                        placeholder="Email cannot be changed"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">New Password</label>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-[20px] focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-gray-700"
                        placeholder="Leave blank to keep current"
                      />
                    </div>
                  </div>

                  {message.text && (
                    <div className={`p-4 rounded-2xl text-xs font-black uppercase tracking-widest ${
                      message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                    }`}>
                      {message.text}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isUpdating || isUploading}
                    className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-[24px] font-black uppercase tracking-widest text-xs transition-all active:scale-95 shadow-xl shadow-indigo-200 disabled:opacity-50"
                  >
                    {isUpdating || isUploading ? 'Saving Changes...' : 'Update Profile'}
                  </button>
                </form>
              </div>

              <div className="space-y-8">
                <div className="bg-gray-900 rounded-[32px] p-8 text-white relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 rounded-full blur-[60px] -mr-16 -mt-16" />
                   <h3 className="text-lg font-black uppercase tracking-tight mb-6 relative z-10">Account Stats</h3>
                   <div className="space-y-6 relative z-10">
                      <div className="flex justify-between items-center border-b border-white/10 pb-4">
                        <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Total Comments</span>
                        <span className="text-xl font-black">12</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-white/10 pb-4">
                        <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Saved Stories</span>
                        <span className="text-xl font-black">4</span>
                      </div>
                   </div>
                </div>

                <div className="bg-indigo-600 rounded-[32px] p-8 text-white shadow-2xl shadow-indigo-100">
                  <h3 className="text-lg font-black uppercase tracking-tight mb-4">Security Tip</h3>
                  <p className="text-indigo-100 text-xs font-medium leading-relaxed opacity-80 uppercase tracking-tight">
                    Never share your password with anyone. Use a strong, unique password to keep your account safe.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
