import React from 'react'
import Loading from '../../../Component/Loading'
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
    return <Loading />
  }

  return (
    <div className='max-w-7xl mx-auto space-y-8'>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center'>
        <div>
            <h1 className='text-3xl font-bold text-gray-800'>Dashboard Overview</h1>
            <p className='text-gray-500 mt-1'>Welcome to your admin dashboard</p>
        </div>
        <div className='mt-4 md:mt-0'>
            <span className='bg-white px-4 py-2 rounded-full text-sm font-medium text-gray-600 shadow-sm border border-gray-100'>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {adminStats.map((stat, index) => (
          <div key={index} className='bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-500 text-sm font-medium mb-1 uppercase tracking-wider'>{stat.title}</p>
                <p className='text-3xl font-bold text-gray-800'>{stat.count}</p>
              </div>
              <div className={`${stat.bgColor} w-14 h-14 rounded-xl flex items-center justify-center text-2xl text-white shadow-md transform transition-transform duration-300 hover:scale-110`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Blogs */}
      <div className='bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden'>
        <div className='p-6 border-b border-gray-100 flex justify-between items-center'>
            <h2 className='text-xl font-bold text-gray-800'>Recent Blog Posts</h2>
            <a href="/dashboard/manage-items" className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline">View All</a>
        </div>
        <div className='divide-y divide-gray-100'>
          {blogsData?.slice(0, 5).map((blog) => (
            <div key={blog._id} className='flex items-center justify-between p-4 hover:bg-gray-50 transition duration-150'>
              <div className="flex-1 min-w-0 pr-4">
                <h3 className='font-semibold text-gray-800 truncate'>{blog.title}</h3>
                <p className='text-sm text-gray-500 mt-1 flex items-center gap-2'>
                  <span className='bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-medium border border-blue-100'>{blog.category}</span>
                  <span>•</span>
                  <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                </p>
              </div>
              <div className="flex-shrink-0">
                 {blog.coverImg && (
                    <img src={blog.coverImg} alt={blog.title} className="h-10 w-16 object-cover rounded-md border border-gray-200" />
                 )}
              </div>
            </div>
          ))}
          {(!blogsData || blogsData.length === 0) && (
              <div className="p-8 text-center text-gray-500 italic">No recent blogs found.</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
