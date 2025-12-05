import React from 'react'
import { useGetUserMutation } from '../../../redux/features/auth/authAPI'
import { useFetchBlogsQuery } from '../../../redux/features/blogs/blogsApi'

const Dashboard = () => {
  const { data: blogsData, isLoading: blogsLoading } = useFetchBlogsQuery({ search: '', category: '', location: '' })
  const [getUsers, { data: usersData }] = useGetUserMutation()

  React.useEffect(() => {
    getUsers()
  }, [getUsers])

  const totalBlogs = blogsData?.length || 0
  const totalUsers = usersData?.users?.length || 0

  const adminStats = [
    {
      title: 'Total Blogs',
      count: totalBlogs,
      icon: '📝',
      bgColor: 'bg-blue-500'
    },
    {
      title: 'Total Users',
      count: totalUsers,
      icon: '👥',
      bgColor: 'bg-green-500'
    },
    {
      title: 'Admin',
      count: 1,
      icon: '👑',
      bgColor: 'bg-purple-500'
    }
  ]

  if (blogsLoading) {
    return <div className="text-center py-8">Loading dashboard...</div>
  }

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold mb-4'>Dashboard Overview</h1>
        <p className='text-gray-600'>Welcome to the admin dashboard</p>
      </div>

      {/* Statistics Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {adminStats.map((stat, index) => (
          <div key={index} className='bg-white rounded-lg shadow-md p-6 border border-gray-200'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-500 text-sm mb-1'>{stat.title}</p>
                <p className='text-3xl font-bold'>{stat.count}</p>
              </div>
              <div className={`${stat.bgColor} w-16 h-16 rounded-full flex items-center justify-center text-3xl`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Blogs */}
      <div className='bg-white rounded-lg shadow-md p-6 border border-gray-200'>
        <h2 className='text-xl font-bold mb-4'>Recent Blog Posts</h2>
        <div className='space-y-3'>
          {blogsData?.slice(0, 5).map((blog) => (
            <div key={blog._id} className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
              <div>
                <h3 className='font-semibold'>{blog.title}</h3>
                <p className='text-sm text-gray-500'>
                  {blog.category} • {new Date(blog.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
