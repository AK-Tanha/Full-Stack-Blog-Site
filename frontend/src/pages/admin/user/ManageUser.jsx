import { useEffect, useState } from 'react'
import { 
  useDeleteUserMutation, 
  useGetUsersQuery, 
  useUpdateUserByAdminMutation, 
  useCreateUserByAdminMutation 
} from '../../../redux/features/auth/authAPI'
import { useUploadImageMutation } from '../../../redux/features/blogs/blogsApi'

const ManageUser = () => {
  const { data: usersData, isLoading, refetch } = useGetUsersQuery()
  const [deleteUser] = useDeleteUserMutation()
  const [updateUser] = useUpdateUserByAdminMutation()
  const [createUser] = useCreateUserByAdminMutation()
  const [uploadImageMutation, { isLoading: isUploading }] = useUploadImageMutation()
  
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [userModal, setUserModal] = useState({ isOpen: false, type: 'create', user: null })
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user',
    profileImage: ''
  })
  
  const [imageFile, setImageFile] = useState(null)

  const handleOpenModal = (type, user = null) => {
    if (type === 'edit' && user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        password: '', // Don't show password on edit
        role: user.role || 'user',
        profileImage: user.profileImage || ''
      })
    } else {
      setFormData({
        username: '',
        email: '',
        password: '',
        role: 'user',
        profileImage: ''
      })
    }
    setUserModal({ isOpen: true, type, user })
    setImageFile(null)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
    }
  }

  const handleUploadAndSubmit = async (e) => {
    e.preventDefault()
    try {
      let profileImageUrl = formData.profileImage

      if (imageFile) {
        const uploadData = new FormData()
        uploadData.append('image', imageFile)
        const uploadResponse = await uploadImageMutation(uploadData).unwrap()
        profileImageUrl = uploadResponse.url
      }
      
      const finalData = { ...formData, profileImage: profileImageUrl }
      
      if (userModal.type === 'create') {
        await createUser(finalData).unwrap()
        alert('User created successfully!')
      } else {
        // If editing, only send password if it's provided
        const updateData = { ...finalData }
        if (!updateData.password) delete updateData.password
        
        await updateUser({ userId: userModal.user._id, userData: updateData }).unwrap()
        alert('User updated successfully!')
      }
      
      setUserModal({ isOpen: false, type: 'create', user: null })
      refetch()
    } catch (err) {
      console.error('Operation failed:', err)
      alert(err.data?.message || 'Failed to process user')
    }
  }

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId).unwrap()
      setDeleteConfirm(null)
      alert('User deleted successfully!')
      refetch()
    } catch (err) {
      console.error('Failed to delete user:', err)
      alert('Failed to delete user')
    }
  }

  if (isLoading) {
    return <div className="text-center py-8 text-indigo-600 font-bold">Loading users...</div>
  }

  const users = usersData?.users || []

  console.log(users)

  return (
    <div className='max-w-7xl mx-auto bg-white p-4 md:p-8 rounded-[24px] md:rounded-[32px] shadow-2xl shadow-gray-200/50 border border-gray-100'>
      <div className='flex flex-col md:flex-row justify-between items-center mb-8 md:mb-10 pb-6 border-b border-gray-100 gap-6'>
        <div className="text-center md:text-left">
            <h2 className='text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tight'>Control Users</h2>
            <p className='text-gray-400 font-bold uppercase tracking-widest text-[10px] md:text-xs mt-2'>Manage permissions and profiles</p>
        </div>
        <button 
          onClick={() => handleOpenModal('create')}
          className='w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 md:py-3 rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-95 shadow-xl shadow-indigo-200'
        >
          Add New User
        </button>
      </div>

      {/* Mobile Card View (Visible on small screens) */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {users.map((user) => (
          <div key={user._id} className="bg-gray-50/50 rounded-3xl p-5 border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white border-2 border-white shadow-md">
                {user.profileImage ? (
                  <img src={user.profileImage} alt={user.username} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-600 font-black text-xl">
                    {user.username?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-gray-900 uppercase tracking-tight truncate">{user.username}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">{user.email}</p>
              </div>
              <span className={`px-3 py-1 text-[8px] font-black uppercase tracking-widest rounded-full ${
                user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
              }`}>
                {user.role}
              </span>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => handleOpenModal('edit', user)}
                className="flex-1 py-3 bg-white text-indigo-600 rounded-xl font-black uppercase tracking-widest text-[10px] border border-indigo-50"
              >
                Edit Details
              </button>
              <button 
                onClick={() => setDeleteConfirm(user._id)}
                className="flex-1 py-3 bg-white text-red-500 rounded-xl font-black uppercase tracking-widest text-[10px] border border-red-50"
              >
                Delete User
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View (Hidden on small screens) */}
      <div className='hidden md:block bg-white border border-gray-100 rounded-[24px] overflow-hidden shadow-xl shadow-gray-100/50'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-gray-50/50'>
              <tr>
                <th className='px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]'>User Profile</th>
                <th className='px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]'>Email Address</th>
                <th className='px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]'>Access Level</th>
                <th className='px-8 py-5 text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-50'>
              {users.map((user) => (
                <tr key={user._id} className='hover:bg-indigo-50/30 transition-all duration-300 group'>
                  <td className='px-8 py-5 whitespace-nowrap'>
                    <div className='flex items-center gap-4'>
                      <div className='w-12 h-12 rounded-2xl overflow-hidden bg-gray-100 border-2 border-white shadow-md'>
                        {user.profileImage ? (
                          <img src={user.profileImage} alt={user.username} className='w-full h-full object-cover' />
                        ) : (
                          <div className='w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-600 font-black'>
                            {user.username?.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className='text-sm font-black text-gray-900 uppercase tracking-tight'>{user.username}</div>
                    </div>
                  </td>
                  <td className='px-8 py-5 whitespace-nowrap'>
                    <div className='text-sm font-bold text-gray-500'>{user.email}</div>
                  </td>
                  <td className='px-8 py-5 whitespace-nowrap'>
                    <span className={`px-4 py-1.5 inline-flex text-[10px] font-black uppercase tracking-widest rounded-full ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className='px-8 py-5 whitespace-nowrap text-sm font-medium'>
                    <div className='flex items-center justify-center gap-4'>
                      <button
                          onClick={() => handleOpenModal('edit', user)}
                          className='p-2.5 bg-white text-indigo-600 rounded-xl shadow-sm border border-indigo-50 hover:bg-indigo-600 hover:text-white transition-all duration-300'
                      >
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                      </button>
                      <button
                          onClick={() => setDeleteConfirm(user._id)}
                          className='p-2.5 bg-white text-red-500 rounded-xl shadow-sm border border-red-50 hover:bg-red-500 hover:text-white transition-all duration-300'
                      >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Create/Edit Modal */}
      {userModal.isOpen && (
        <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-[40px] p-10 max-w-lg w-full shadow-2xl relative overflow-hidden'>
            <div className='absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full -mr-16 -mt-16' />
            
            <h3 className='text-2xl font-black mb-8 text-gray-900 uppercase tracking-tight'>
              {userModal.type === 'create' ? 'Onboard New User' : 'Revise User Profile'}
            </h3>
            
            <form onSubmit={handleUploadAndSubmit} className='space-y-6 relative z-10'>
              <div className='flex justify-center mb-8'>
                <div className='relative group'>
                  <div className='w-28 h-28 rounded-[32px] overflow-hidden bg-indigo-50 border-4 border-white shadow-xl flex items-center justify-center'>
                    {imageFile ? (
                      <img src={URL.createObjectURL(imageFile)} alt="Preview" className='w-full h-full object-cover' />
                    ) : formData.profileImage ? (
                      <img src={formData.profileImage} alt="Profile" className='w-full h-full object-cover' />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    )}
                  </div>
                  <label className='absolute -bottom-2 -right-2 bg-indigo-600 text-white p-2.5 rounded-2xl cursor-pointer shadow-lg hover:scale-110 transition-transform active:scale-95'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <input type="file" className='hidden' onChange={handleImageChange} accept="image/*" />
                  </label>
                </div>
              </div>

              <div className='grid grid-cols-1 gap-6'>
                <div>
                  <label className='block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1'>Username</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className='w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-[20px] focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-gray-700'
                    required
                  />
                </div>
                <div>
                  <label className='block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1'>Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className='w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-[20px] focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-gray-700'
                    required
                  />
                </div>
                <div>
                  <label className='block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1'>
                    {userModal.type === 'create' ? 'Password' : 'New Password (Leave blank to keep current)'}
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className='w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-[20px] focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-gray-700'
                    required={userModal.type === 'create'}
                  />
                </div>
                <div>
                  <label className='block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1'>Access Level</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className='w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-[20px] focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-black uppercase tracking-widest text-xs text-gray-700'
                  >
                    <option value="user">Standard User</option>
                    <option value="admin">System Administrator</option>
                  </select>
                </div>
              </div>

              <div className='flex gap-4 pt-6'>
                <button
                  type="button"
                  onClick={() => setUserModal({ isOpen: false, type: 'create', user: null })}
                  className='flex-1 px-6 py-4 bg-gray-50 text-gray-400 rounded-[24px] hover:bg-gray-100 font-black uppercase tracking-widest text-[10px] transition-all'
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className='flex-1 px-6 py-4 bg-indigo-600 text-white rounded-[24px] hover:bg-indigo-700 font-black uppercase tracking-widest text-[10px] transition-all shadow-lg shadow-indigo-100 disabled:opacity-50'
                >
                  {isUploading ? 'Uploading...' : userModal.type === 'create' ? 'Create User' : 'Update User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-[40px] p-10 max-w-md w-full shadow-2xl text-center relative overflow-hidden'>
            <div className='w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className='text-2xl font-black mb-4 text-gray-900 uppercase tracking-tight'>Terminate Access?</h3>
            <p className='text-gray-400 font-bold mb-10 leading-relaxed uppercase tracking-widest text-[10px]'>
              Are you absolutely sure? This will permanently revoke all access for this user.
            </p>
            <div className='flex gap-4'>
              <button
                onClick={() => setDeleteConfirm(null)}
                className='flex-1 px-6 py-4 bg-gray-50 text-gray-400 rounded-[24px] hover:bg-gray-100 font-black uppercase tracking-widest text-[10px] transition-all'
              >
                No, Keep
              </button>
              <button
                onClick={() => handleDeleteUser(deleteConfirm)}
                className='flex-1 px-6 py-4 bg-red-500 text-white rounded-[24px] hover:bg-red-600 font-black uppercase tracking-widest text-[10px] transition-all shadow-lg shadow-red-100'
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageUser

