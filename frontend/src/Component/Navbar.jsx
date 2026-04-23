import React, { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate, useSearchParams } from 'react-router-dom'
import { IoCloseSharp, IoMenuSharp, IoSearchOutline } from "react-icons/io5";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import avatarImg from "../assets/commentor.png"
import { useLogoutUserMutation } from '../../src/redux/features/auth/authAPI';
import { logout, setUser } from '../../src/redux/features/auth/authSlice'
import { useFetchCategoriesQuery } from '../../src/redux/features/category/categoryApi';
import { useGetUserProfileQuery } from '../../src/redux/features/auth/authAPI';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const [scrolled, setScrolled] = useState(false);
  
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || "");
  const navigate = useNavigate();

  const { user: authUser } = useSelector((state) => state.auth);
  const { data: profileData } = useGetUserProfileQuery(undefined, { skip: !authUser });
  const { data: categories } = useFetchCategoriesQuery();
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const user = profileData?.user || authUser;

  const [logOutUser] = useLogoutUserMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (profileData?.user) {
      // Keep Redux store in sync with fresh profile data
      dispatch(setUser({ user: profileData.user, token: localStorage.getItem('token') }));
    }
  }, [profileData, dispatch]);

  useEffect(() => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentDate(new Date().toLocaleDateString('en-US', options));

    const handleScroll = () => {
      setScrolled(window.scrollY > 150);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchInput) {
      params.set('search', searchInput);
    } else {
      params.delete('search');
    }
    setSearchParams(params);
    setIsSearchOpen(false);
    navigate(`/?${params.toString()}`);
  };

  const handleCategoryChange = (catName) => {
    const params = new URLSearchParams(searchParams);
    if (catName) {
      params.set('category', catName);
    } else {
      params.delete('category');
    }
    setSearchParams(params);
    navigate(`/?${params.toString()}`);
  };

  const hanDelLogout = async () => {
    try {
      await logOutUser().unwrap();
      dispatch(logout());
    } catch (error) {
      console.error(error);
    }
  };

  // Dynamic Navigation Logic
  const topCategories = categories?.slice(0, 4) || [];
  const moreCategories = categories?.slice(4) || [];

  return (
    <header className='w-full bg-white z-[70]'>
      {/* 1. TOP UTILITY BAR */}
      <div className='bg-gray-50 border-b border-gray-100 py-1.5 md:py-2'>
        <div className='container mx-auto px-4 md:px-6 flex justify-between items-center'>
          <div className='flex items-center gap-4 text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest'>
            <span>{currentDate}</span>
            <span className='hidden sm:inline h-3 w-[1px] bg-gray-200'></span>
            <div className='hidden sm:flex items-center gap-2 text-rose-600'>
               <span className='relative flex h-2 w-2'>
                  <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75'></span>
                  <span className='relative inline-flex rounded-full h-2 w-2 bg-rose-500'></span>
               </span>
               <span>Trending Now</span>
            </div>
          </div>
          <div className='flex items-center gap-6'>
            <div className='hidden lg:flex items-center gap-4 text-gray-400'>
              <FaFacebookF className='hover:text-blue-600 cursor-pointer transition-all text-xs' />
              <FaTwitter className='hover:text-blue-400 cursor-pointer transition-all text-xs' />
              <FaInstagram className='hover:text-pink-600 cursor-pointer transition-all text-xs' />
              <FaYoutube className='hover:text-red-600 cursor-pointer transition-all text-xs' />
            </div>
            {!user && (
              <Link to="/log-in" className='text-[10px] font-black uppercase tracking-widest text-gray-900 hover:text-orange-600 transition-colors'>
                Member Sign In
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* 2. MAIN MASTHEAD */}
      <div className='py-6 md:py-10 border-b border-gray-50'>
        <div className='container mx-auto px-4 md:px-6 flex justify-between items-center'>
          <button onClick={toggleMenu} className='lg:hidden p-2.5 bg-gray-50 rounded-xl text-gray-900'>
            <IoMenuSharp size={24} />
          </button>

          <Link to="/" className='flex flex-col items-center group' onClick={() => handleCategoryChange('')}>
            <img src="/Logo.png" alt="Logo" className='h-12 md:h-16 w-auto object-contain transition-transform duration-500 group-hover:scale-105' />
            <span className='text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-gray-400 mt-2 text-center'>Combat Sports Authority</span>
          </Link>

          {/* Search & Profile Area */}
          <div className='flex items-center gap-1 md:gap-3'>
            <div className={`flex items-center transition-all duration-500 ease-out overflow-hidden ${isSearchOpen ? 'w-[180px] sm:w-[300px] md:w-[400px] opacity-100 mr-2 md:mr-4' : 'w-0 opacity-0'}`}>
              <form onSubmit={handleSearch} className="w-full relative flex items-center">
                <input 
                  autoFocus={isSearchOpen}
                  type="text" 
                  placeholder="Search headlines..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className='w-full bg-gray-50 border border-gray-100 rounded-full px-5 py-2.5 text-xs md:text-sm font-bold text-gray-900 placeholder:text-gray-300 outline-none focus:border-orange-600 focus:ring-4 focus:ring-orange-50 transition-all'
                />
                <button type="button" onClick={() => setIsSearchOpen(false)} className="absolute right-3 text-gray-300 hover:text-gray-900 transition-colors">
                  <IoCloseSharp size={18} />
                </button>
              </form>
            </div>

            {!isSearchOpen && (
              <button onClick={() => setIsSearchOpen(true)} className='p-3 hover:bg-gray-50 rounded-full transition-all text-gray-400 hover:text-gray-900 active:scale-90'>
                <IoSearchOutline size={22} />
              </button>
            )}

            {user && (
               <div className={`relative group transition-all duration-300 ${isSearchOpen && window.innerWidth < 640 ? 'hidden' : 'block'}`}>
                  <img src={user?.profileImage || avatarImg} alt="user" className='w-10 h-10 md:w-11 md:h-11 rounded-full border-2 border-white ring-1 ring-gray-100 group-hover:ring-orange-600 transition-all cursor-pointer object-cover shadow-sm' />
                  <div className='absolute hidden group-hover:block top-full right-0 pt-3 w-52 z-[100]'>
                    <div className='bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden'>
                      <div className='px-6 py-4 bg-gray-50 border-b border-gray-100'>
                        <p className='text-[10px] font-black text-gray-900 uppercase tracking-tight'>{user.username}</p>
                        <p className='text-[8px] font-bold text-orange-600 uppercase tracking-widest mt-0.5'>{user.role}</p>
                      </div>
                      <Link to="/profile" className='block px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors'>Journalist Profile</Link>
                      {user.role === 'admin' && <Link to="/dashboard" className='block px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors border-t border-gray-50'>Admin Dashboard</Link>}
                      <button onClick={hanDelLogout} className='w-full text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition-colors border-t border-gray-50'>Sign Out</button>
                    </div>
                  </div>
               </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. STICKY CATEGORY NAV */}
      <nav className={`w-full z-[60] transition-all duration-300 border-b border-gray-100 ${scrolled ? 'fixed top-0 bg-white/95 backdrop-blur-md shadow-lg py-2' : 'relative bg-white py-0 md:py-4 hidden md:block'}`}>
        <div className='container mx-auto px-4 md:px-6 flex justify-between lg:justify-center items-center gap-6'>
          
          {scrolled && (
            <Link to="/" className='flex-shrink-0 lg:absolute lg:left-6 transition-all animate-in fade-in slide-in-from-left-2' onClick={() => handleCategoryChange('')}>
              <img src="/Logo.png" alt="Logo" className='h-7 md:h-9 w-auto' />
            </Link>
          )}

          {/* Desktop Nav Items */}
          <ul className='hidden lg:flex items-center gap-10'>
            <li>
              <button onClick={() => handleCategoryChange('')} className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 relative py-2 ${!searchParams.get('category') ? "text-orange-600 after:w-full" : "text-gray-900 hover:text-orange-600 after:w-0"} after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-orange-600 after:transition-all hover:after:w-full`}>
                News
              </button>
            </li>
            
            {topCategories.map((cat) => (
              <li key={cat._id}>
                <button 
                  onClick={() => handleCategoryChange(cat.name)} 
                  className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 relative py-2 ${searchParams.get('category') === cat.name ? "text-orange-600 after:w-full" : "text-gray-900 hover:text-orange-600 after:w-0"} after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-orange-600 after:transition-all hover:after:w-full`}
                >
                  {cat.name}
                </button>
              </li>
            ))}

            {/* MORE DROPDOWN (Overflow Categories Only) */}
            {moreCategories.length > 0 && (
               <li className='relative group'>
                  <button className={`text-[11px] font-black uppercase tracking-[0.2em] py-2 flex items-center gap-1 transition-all ${moreCategories.some(c => searchParams.get('category') === c.name) ? 'text-orange-600' : 'text-gray-900 hover:text-orange-600'}`}>
                    More
                    <svg className='w-3 h-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='3' d='M19 9l-7 7-7-7'></path></svg>
                  </button>
                  <div className='absolute hidden group-hover:block top-full left-0 pt-2 w-48 z-[80]'>
                    <div className='bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden py-2'>
                      {moreCategories.map(cat => (
                        <button key={cat._id} onClick={() => handleCategoryChange(cat.name)} className={`w-full text-left px-5 py-3 text-[10px] font-black uppercase tracking-widest transition-colors ${searchParams.get('category') === cat.name ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:bg-gray-50 hover:text-orange-600'}`}>{cat.name}</button>
                      ))}
                    </div>
                  </div>
               </li>
            )}

            <li>
              <NavLink to="/about-us" className={({ isActive }) => `text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 relative py-2 ${isActive ? "text-orange-600 after:w-full" : "text-gray-900 hover:text-orange-600 after:w-0"} after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-orange-600 after:transition-all hover:after:w-full`}>
                About
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact-us" className={({ isActive }) => `text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 relative py-2 ${isActive ? "text-orange-600 after:w-full" : "text-gray-900 hover:text-orange-600 after:w-0"} after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-orange-600 after:transition-all hover:after:w-full`}>
                Contact
              </NavLink>
            </li>
          </ul>

          {scrolled && (
            <div className='flex items-center gap-2 md:gap-4 lg:absolute lg:right-6 animate-in fade-in slide-in-from-right-2'>
              <button onClick={() => setIsSearchOpen(true)} className='p-2 md:p-2.5 text-gray-400 hover:text-orange-600 transition-colors'>
                <IoSearchOutline size={20} />
              </button>
              {user ? (
                <Link to="/profile"><img src={user?.profileImage || avatarImg} alt="user" className='w-8 h-8 rounded-full border border-gray-100 object-cover' /></Link>
              ) : (
                <Link to="/log-in" className='text-[9px] font-black uppercase tracking-widest text-gray-900 hover:text-orange-600 transition-colors'>Sign In</Link>
              )}
              <button onClick={toggleMenu} className='lg:hidden p-2 text-gray-900'><IoMenuSharp size={24} /></button>
            </div>
          )}
        </div>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      <div className={`lg:hidden fixed inset-0 z-[100] transition-all duration-500 ${isMenuOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}>
        <div className='absolute inset-0 bg-black/80 backdrop-blur-md' onClick={() => setIsMenuOpen(false)} />
        <div className={`absolute left-0 top-0 h-full w-4/5 max-sm bg-white shadow-2xl transition-transform duration-500 ease-out transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className='p-8 flex flex-col h-full overflow-y-auto'>
            <div className='flex items-center justify-between mb-12'>
              <img src="/Logo.png" alt="Logo" className='h-10 w-auto' />
              <button onClick={() => setIsMenuOpen(false)} className='p-2 bg-gray-100 rounded-full'><IoCloseSharp /></button>
            </div>

            <ul className='flex flex-col gap-8'>
               <li><button onClick={() => { handleCategoryChange(''); setIsMenuOpen(false); }} className='text-xl font-black uppercase tracking-widest text-gray-900'>News</button></li>
               {categories?.map((cat) => (
                 <li key={cat._id}><button onClick={() => { handleCategoryChange(cat.name); setIsMenuOpen(false); }} className='text-xl font-black uppercase tracking-widest text-gray-900'>{cat.name}</button></li>
               ))}
            </ul>

            <div className='mt-auto pt-10 border-t border-gray-100'>
              {user ? (
                <div className='flex flex-col gap-4'>
                  <div className='flex items-center gap-4 mb-4'>
                    <img src={user?.profileImage || avatarImg} alt="avatar" className='w-14 h-14 rounded-full border-2 border-orange-600 object-cover shadow-md' />
                    <div><p className='font-black text-gray-900 uppercase text-sm tracking-tight'>{user?.username}</p><p className='text-[10px] text-orange-600 font-bold uppercase tracking-widest'>{user?.role}</p></div>
                  </div>
                  <Link to="/profile" onClick={() => setIsMenuOpen(false)} className='w-full py-4 bg-gray-900 text-white rounded-xl font-black uppercase tracking-widest text-[10px] text-center'>View Profile</Link>
                  <button onClick={hanDelLogout} className='w-full py-4 border border-red-100 text-red-600 rounded-xl font-black uppercase tracking-widest text-[10px]'>Sign Out</button>
                </div>
              ) : (
                <Link to="/log-in" onClick={() => setIsMenuOpen(false)} className='w-full py-5 bg-orange-600 text-white rounded-xl font-black uppercase tracking-widest text-center block shadow-lg shadow-orange-100'>Member Sign In</Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
 

