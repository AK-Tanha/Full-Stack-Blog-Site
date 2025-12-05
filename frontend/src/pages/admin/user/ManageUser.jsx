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
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-bold'>Manage Users</h2>
        <p className='text-gray-600 mt-2'>Total Users: {users.length}</p>
      </div>

      {/* Users Table */}
      <div className='bg-white rounded-lg shadow-md overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-gray-50 border-b border-gray-200'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Username
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Email
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Role
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm font-medium text-gray-900'>
                        {user.username || 'N/A'}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-500'>{user.email}</div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                      <button
                        onClick={() => initiateRoleChange(user._id, user.role)}
                        className='text-blue-600 hover:text-blue-900'
                      >
                        Change Role
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(user._id)}
                        className='text-red-600 hover:text-red-900 ml-4'
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan='4' className='px-6 py-4 text-center text-gray-500'>
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
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 max-w-md w-full mx-4'>
            <h3 className='text-lg font-bold mb-4'>Confirm Delete</h3>
            <p className='text-gray-600 mb-6'>
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div className='flex gap-4 justify-end'>
              <button
                onClick={() => setDeleteConfirm(null)}
                className='px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400'
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteUser(deleteConfirm)}
                className='px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600'
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Role Change Confirmation Modal */}
      {roleChangeConfirm && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 max-w-md w-full mx-4'>
            <h3 className='text-lg font-bold mb-4'>Confirm Role Change</h3>
            <p className='text-gray-600 mb-6'>
              Are you sure you want to change this user's role from{' '}
              <span className='font-semibold'>{roleChangeConfirm.currentRole}</span> to{' '}
              <span className='font-semibold'>{roleChangeConfirm.newRole}</span>?
            </p>
            <div className='flex gap-4 justify-end'>
              <button
                onClick={() => setRoleChangeConfirm(null)}
                className='px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400'
              >
                Cancel
              </button>
              <button
                onClick={() => handleRoleChange(roleChangeConfirm.userId, roleChangeConfirm.newRole)}
                className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600'
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
