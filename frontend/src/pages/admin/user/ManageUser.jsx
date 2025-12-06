import { useEffect, useState } from 'react'
import { useDeleteUserMutation, useGetUserMutation, useUpdateUserRoleMutation } from '../../../redux/features/auth/authAPI'

const ManageUser = () => {
  const [getUsers, { data: usersData, isLoading }] = useGetUserMutation()
  const [deleteUser] = useDeleteUserMutation()
  const [updateUserRole] = useUpdateUserRoleMutation()
  
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [roleChangeConfirm, setRoleChangeConfirm] = useState(null)

  useEffect(() => {
    getUsers()
  }, [getUsers])

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId).unwrap()
      setDeleteConfirm(null)
      alert('User deleted successfully!')
      getUsers() // Refresh the list
    } catch (err) {
      console.error('Failed to delete user:', err)
      alert('Failed to delete user')
    }
  }

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole({ userId, role: { role: newRole } }).unwrap()
      setRoleChangeConfirm(null)
      alert('User role updated successfully!')
      getUsers() // Refresh the list
    } catch (err) {
      console.error('Failed to update user role:', err)
      alert('Failed to update user role')
    }
  }

  const initiateRoleChange = (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin'
    setRoleChangeConfirm({ userId, currentRole, newRole })
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading users...</div>
  }

  const users = usersData?.users || []

  return (
    <div className='max-w-7xl mx-auto bg-white p-8 rounded-lg shadow-lg'>
      <div className='flex flex-col md:flex-row justify-between items-center mb-8 border-b pb-4'>
        <div>
            <h2 className='text-3xl font-bold text-gray-800'>Manage Users</h2>
            <p className='text-gray-500 mt-1'>View and manage user roles</p>
        </div>
        <div className='bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 mt-4 md:mt-0'>
            <span className='text-blue-800 font-medium'>Total Users: </span>
            <span className='text-blue-900 font-bold'>{users.length}</span>
        </div>
      </div>

      {/* Users Table */}
      <div className='bg-white border rounded-lg overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-gray-50 border-b border-gray-200'>
              <tr>
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                  Username
                </th>
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                  Email
                </th>
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                  Role
                </th>
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id} className='hover:bg-gray-50 transition duration-150'>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm font-medium text-gray-900'>
                        {user.username || 'N/A'}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-500'>{user.email}</div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${
                        user.role === 'admin' 
                          ? 'bg-purple-50 text-purple-700 border-purple-100' 
                          : 'bg-green-50 text-green-700 border-green-100'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                      <div className='flex items-center gap-4'>
                        <button
                            onClick={() => initiateRoleChange(user._id, user.role)}
                            className='text-blue-600 hover:text-blue-900 flex items-center gap-1 transition duration-200'
                        >
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            {user.role === 'admin' ? 'Demote' : 'Promote'}
                        </button>
                        <button
                            onClick={() => setDeleteConfirm(user._id)}
                            className='text-red-500 hover:text-red-700 flex items-center gap-1 transition duration-200'
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan='4' className='px-6 py-12 text-center text-gray-500 bg-gray-50'>
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm transition-opacity'>
          <div className='bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl transform transition-all'>
            <h3 className='text-xl font-bold mb-4 text-gray-800'>Confirm Delete</h3>
            <p className='text-gray-600 mb-8'>
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div className='flex gap-4 justify-end'>
              <button
                onClick={() => setDeleteConfirm(null)}
                className='px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition duration-200'
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteUser(deleteConfirm)}
                className='px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition duration-200 shadow-md hover:shadow-lg'
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Role Change Confirmation Modal */}
      {roleChangeConfirm && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm transition-opacity'>
          <div className='bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl transform transition-all'>
            <h3 className='text-xl font-bold mb-4 text-gray-800'>Confirm Role Change</h3>
            <p className='text-gray-600 mb-8'>
              Are you sure you want to change this user's role from{' '}
              <span className='font-bold text-gray-800'>{roleChangeConfirm.currentRole}</span> to{' '}
              <span className='font-bold text-[#1E73BE]'>{roleChangeConfirm.newRole}</span>?
            </p>
            <div className='flex gap-4 justify-end'>
              <button
                onClick={() => setRoleChangeConfirm(null)}
                className='px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition duration-200'
              >
                Cancel
              </button>
              <button
                onClick={() => handleRoleChange(roleChangeConfirm.userId, roleChangeConfirm.newRole)}
                className='px-6 py-2.5 bg-[#1E73BE] text-white rounded-lg hover:bg-blue-700 font-medium transition duration-200 shadow-md hover:shadow-lg'
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageUser
