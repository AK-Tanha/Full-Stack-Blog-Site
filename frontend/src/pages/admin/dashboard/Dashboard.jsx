import React from 'react'
import Loading from '../../../Component/Loading'
import { useGetUserMutation } from '../../../redux/features/auth/authAPI'
import { useFetchBlogsQuery } from '../../../redux/features/blogs/blogsApi'
import { FaFileAlt, FaUsers, FaCrown, FaArrowRight } from 'react-icons/fa'
import { Link } from 'react-router-dom'

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
      title: 'Published Stories',
      count: totalBlogs,
      icon: FaFileAlt,
      color: 'from-orange-500 to-orange-700',
      shadow: 'shadow-orange-200'
    },
    {
      title: 'Active Readers',
      count: totalUsers,
      icon: FaUsers,
      color: 'from-amber-400 to-amber-600',
      shadow: 'shadow-amber-200'
    },
    {
      title: 'Platform Admins',
      count: 1,
      icon: FaCrown,
      color: 'from-gray-700 to-gray-900',
      shadow: 'shadow-gray-300'
    }
  ]

  if (blogsLoading) {
    return (
      <div className="flex justify-center items-center py-40">
        <Loading />
      </div>
    )
  }

  return (
    <div className='max-w-7xl mx-auto space-y-12 pb-24'>
      {/* Dashboard Header */}
      <div className='flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-gray-100 pb-10'>
        <div>
          <div className="flex items-center gap-4 mb-4">
            <h1 className='text-4xl font-black uppercase tracking-tight text-gray-900 px-6 py-2 bg-orange-50 border-orange-600 border-l-8'>
              Admin Control Room
            </h1>
          </div>
          <p className='text-gray-400 font-bold uppercase tracking-widest text-xs'>Combat Corner Bangladesh Operations Center</p>
        </div>
        <div className='flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-50'>
          <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          <span className='text-xs font-black uppercase tracking-[0.2em] text-gray-600'>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
        {adminStats.map((stat, index) => (
          <div key={index} className='group relative bg-white rounded-[32px] p-8 border border-gray-100 shadow-2xl shadow-gray-200/40 overflow-hidden transition-all duration-500 hover:-translate-y-2'>
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-5 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700`} />
            
            <div className='flex items-center justify-between relative z-10'>
              <div>
                <p className='text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-3'>{stat.title}</p>
                <p className='text-5xl font-black text-gray-900 tracking-tighter'>{stat.count}</p>
              </div>
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-2xl text-white shadow-xl ${stat.shadow} transform transition-all duration-500 group-hover:rotate-12`}>
                <stat.icon />
              </div>
            </div>
            
            <div className="mt-8 flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <span className="text-green-500 font-black">+12%</span>
              <span>Growth this month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Recent Content & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Recent Blogs */}
        <div className='lg:col-span-2 bg-white rounded-[40px] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden'>
          <div className='p-10 border-b border-gray-50 flex justify-between items-center'>
            <div className="flex items-center gap-4">
              <h2 className='text-xl font-black uppercase tracking-tight text-gray-900'>Live Editorial Feed</h2>
              <span className="bg-orange-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Recent</span>
            </div>
            <Link to="/dashboard/manage-items" className="text-gray-400 hover:text-orange-600 flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-colors group">
              View Database <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
          
          <div className='p-6 space-y-2'>
            {blogsData?.slice(0, 5).map((blog) => (
              <div key={blog._id} className='flex items-center justify-between p-4 rounded-3xl hover:bg-orange-50/50 transition-all duration-300 group border border-transparent hover:border-orange-100'>
                <div className="flex items-center gap-6 flex-1 min-w-0">
                  <div className="w-20 h-14 flex-shrink-0 overflow-hidden rounded-xl shadow-lg">
                    <img src={blog.coverImg} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="min-w-0 pr-4">
                    <h3 className='font-black text-gray-900 truncate uppercase tracking-tight text-sm mb-2'>{blog.title}</h3>
                    <div className='flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest'>
                      <span className='text-orange-600 bg-orange-50 px-3 py-1 rounded-full'>{blog.category}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-gray-400">{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                   <Link to={`/dashboard/update-items/${blog._id}`} className="p-3 bg-white shadow-md rounded-xl text-gray-400 hover:text-orange-600 hover:bg-orange-600 hover:text-white transition-all">
                      <FaArrowRight size={14} />
                   </Link>
                </div>
              </div>
            ))}
            
            {(!blogsData || blogsData.length === 0) && (
              <div className="p-20 text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaFileAlt className="text-gray-200 text-3xl" />
                </div>
                <p className="text-gray-400 font-black uppercase tracking-widest text-xs">No editorial content found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions Sidebar */}
        <div className="space-y-8">
          <div className="bg-gray-900 rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-40 h-40 bg-orange-600/20 rounded-full blur-[80px] -mr-10 -mt-10" />
            <h3 className="text-xl font-black uppercase tracking-tighter mb-8 relative z-10">Quick Launch</h3>
            <div className="space-y-4 relative z-10">
              <Link to="/dashboard/add-post" className="flex items-center justify-between w-full bg-orange-600 hover:bg-orange-700 p-6 rounded-[24px] font-black uppercase tracking-widest text-xs transition-all active:scale-95 shadow-xl shadow-orange-900/40">
                Create New Story <FaFileAlt />
              </Link>
              <Link to="/dashboard/manage-items" className="flex items-center justify-between w-full bg-white/10 hover:bg-white/20 p-6 rounded-[24px] font-black uppercase tracking-widest text-xs transition-all">
                Manage Database <FaUsers />
              </Link>
            </div>
          </div>

          <div className="bg-orange-600 rounded-[40px] p-10 text-white shadow-2xl shadow-orange-200">
            <h3 className="text-xl font-black uppercase tracking-tighter mb-4">Pro Tip</h3>
            <p className="text-orange-100 text-sm font-medium leading-relaxed opacity-80 uppercase tracking-tight">
              Keep your content fresh. Top news portals update at least 3-5 times daily to stay relevant in combat sports.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
