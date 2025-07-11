import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { IoCloseSharp, IoMenuSharp } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import avatarImg from "../assets/commentor.png"
import { useLogoutUserMutation } from '../../src/redux/features/auth/authAPI';
import { logout } from '../../src/redux/features/auth/authSlice'

const navLists = [
  { name: "Home", path: "/" },
  { name: "About us", path: "/about-us" },
  { name: "Privacy Policy", path: "/privacy-policy" },
  { name: "Contact us", path: "/contact-us" },
]

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const [logOutUser] = useLogoutUserMutation();
  const dispatch = useDispatch();

  const hanDelLogout = async () => {
    try {
      await logOutUser().unwrap();
      dispatch(logout());
    } catch (error) {
      // error handling
    }
  };

  return (
    <header className='bg-white border-b shadow-sm z-50'>
      <nav className='container mx-auto flex justify-between items-center px-5 py-4'>

        {/* Logo */}
        <Link to="/">
          <img src="/Logo.png" alt="Logo" className="h-10" />
        </Link>

        {/* Desktop Menu */}
        <ul className='hidden sm:flex items-center gap-6'>
          {navLists.map((list, index) => (
            <li key={index}>
              <NavLink
                to={list.path}
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-600 font-semibold"
                    : "text-gray-700 hover:text-blue-500 transition"
                }>
                {list.name}
              </NavLink>
            </li>
          ))}

          {user?.role === "user" && (
            <li className='flex items-center gap-2'>
              <img src={avatarImg} alt="avatar" className='w-8 h-8 rounded-full' />
              <button
                onClick={hanDelLogout}
                className='bg-blue-700 text-white px-4 py-1.5 rounded hover:bg-blue-800 transition'>
                Log Out
              </button>
            </li>
          )}

          {!user && (
            <li>
              <NavLink
                to="/log-in"
                className='text-gray-700 hover:text-blue-500 transition'>
                Log In
              </NavLink>
            </li>
          )}

          {user?.role === "admin" && (
            <li className='flex items-center gap-2'>
              <img src={avatarImg} alt="avatar" className='w-8 h-8 rounded-full' />
              <Link to="/dashboard">
                <button className='bg-[#1E73BE] text-white px-4 py-1.5 rounded hover:bg-blue-800 transition'>
                  Dashboard
                </button>
              </Link>
            </li>
          )}
        </ul>

        {/* Toggle Menu Button */}
        <div className='sm:hidden'>
          <button
            onClick={toggleMenu}
            className='text-gray-600 p-2 rounded hover:text-gray-800 transition'>
            {isMenuOpen ? <IoCloseSharp className='w-6 h-6' /> : <IoMenuSharp className='w-6 h-6' />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <ul className='sm:hidden flex flex-col gap-4 px-5 py-6 bg-white border-t shadow-md'>
          {navLists.map((list, index) => (
            <li key={index}>
              <NavLink
                to={list.path}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-600 font-semibold"
                    : "text-gray-800 hover:text-blue-500 transition"
                }>
                {list.name}
              </NavLink>
            </li>
          ))}

          {user?.role === "user" && (
            <li className='flex items-center gap-3'>
              <img src={avatarImg} alt="avatar" className='w-8 h-8 rounded-full' />
              <button
                onClick={() => {
                  hanDelLogout();
                  setIsMenuOpen(false);
                }}
                className='bg-blue-700 text-white px-4 py-1.5 rounded hover:bg-blue-800 transition'>
                Log Out
              </button>
            </li>
          )}

          {!user && (
            <li>
              <NavLink
                to="/log-in"
                onClick={() => setIsMenuOpen(false)}
                className='text-gray-700 hover:text-blue-500 transition'>
                Log In
              </NavLink>
            </li>
          )}

          {user?.role === "admin" && (
            <li className='flex items-center gap-3'>
              <img src={avatarImg} alt="avatar" className='w-8 h-8 rounded-full' />
              <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                <button className='bg-[#1E73BE] text-white px-4 py-1.5 rounded hover:bg-blue-800 transition'>
                  Dashboard
                </button>
              </Link>
            </li>
          )}
        </ul>
      )}
    </header>
  );
};

export default Navbar;
