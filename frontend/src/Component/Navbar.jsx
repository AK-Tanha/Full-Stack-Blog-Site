import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { IoCloseSharp, IoMenuSharp, IoSearchOutline } from "react-icons/io5";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaChevronRight,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import avatarImg from "../assets/commentor.png";
import { useLogoutUserMutation } from "../../src/redux/features/auth/authAPI";
import { logout, setUser } from "../../src/redux/features/auth/authSlice";
import { useFetchCategoriesQuery } from "../../src/redux/features/category/categoryApi";
import { useGetUserProfileQuery } from "../../src/redux/features/auth/authAPI";
import { useFetchBlogsQuery } from "../../src/redux/features/blogs/blogsApi";
import { useTranslation } from "react-i18next";

// Mega Menu Content Component
const MegaMenuContent = ({ category, onClose }) => {
  const { t, i18n } = useTranslation();
  // Fetch blogs for the specific category
  const { data: blogs, isLoading } = useFetchBlogsQuery({
    category: category.name,
  });

  const displayBlogs = blogs?.slice(0, 4) || [];

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="flex justify-between items-end mb-8 border-b border-gray-100 pb-4">
        <div>
          <h3 className="text-2xl font-black uppercase tracking-tighter text-gray-900 mb-1">
            {i18n.language === "bn"
              ? category.name_bn || category.name
              : category.name}
          </h3>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-600">
            {t("latestHeadlines")}
          </p>
        </div>
        <Link
          to={`/?category=${category.name}`}
          onClick={onClose}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-orange-600 transition-colors group"
        >
          {t("viewAll")}
          <FaChevronRight className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-6">
        {isLoading ? (
          [1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-50 aspect-[16/9] rounded-lg mb-3" />
              <div className="h-3 bg-gray-50 rounded w-full mb-2" />
              <div className="h-3 bg-gray-50 rounded w-2/3" />
            </div>
          ))
        ) : displayBlogs.length > 0 ? (
          displayBlogs.map((blog) => (
            <Link
              key={blog._id}
              to={`/blogs/${blog._id}`}
              onClick={onClose}
              className="group block"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-lg mb-3 bg-gray-50">
                <img
                  src={blog.coverImg}
                  alt={blog.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h4 className="text-[11px] font-black uppercase leading-tight text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 tracking-tight">
                {i18n.language === "bn"
                  ? blog.title_bn || blog.title
                  : blog.title}
              </h4>
            </Link>
          ))
        ) : (
          <div className="col-span-full py-10 text-center">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-300">
              {t("noStoriesFound")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const hoverTimeoutRef = useRef(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || "",
  );
  const navigate = useNavigate();

  const { user: authUser } = useSelector((state) => state.auth);
  const { data: profileData } = useGetUserProfileQuery(undefined, {
    skip: !authUser,
  });
  const { data: categories } = useFetchCategoriesQuery();
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const user = profileData?.user || authUser;
  const [logOutUser] = useLogoutUserMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (profileData?.user) {
      dispatch(
        setUser({
          user: profileData.user,
          token: localStorage.getItem("token"),
        }),
      );
    }
  }, [profileData, dispatch]);

  useEffect(() => {
    const updateDate = () => {
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      setCurrentDate(
        new Date().toLocaleDateString(
          i18n.language === "bn" ? "bn-BD" : "en-US",
          options,
        ),
      );
    };
    updateDate();
    const handleScroll = () => setScrolled(window.scrollY > 120);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [i18n.language]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchInput) params.set("search", searchInput);
    else params.delete("search");
    setSearchParams(params);
    setIsSearchOpen(false);
    navigate(`/?${params.toString()}`);
  };

  const handleCategoryChange = (catName) => {
    const params = new URLSearchParams(searchParams);
    if (catName) params.set("category", catName);
    else params.delete("category");
    setSearchParams(params);
    setHoveredCategory(null);
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

  const handleHoverEnter = (cat) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setHoveredCategory(cat);
  };

  const handleHoverLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredCategory(null);
    }, 300);
  };

  const topCategories = categories?.slice(0, 4) || [];
  const moreCategories = categories?.slice(4) || [];

  return (
    <header className="w-full bg-white z-[100] relative">
      {/* 1. TOP BAR - Professional & Minimal */}
      <div className="bg-gray-50/50 border-b border-gray-100 py-1.5 md:py-2">
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
          <div className="flex items-center gap-3 md:gap-6">
            <div className="hidden lg:block text-[10px] font-black text-gray-500 uppercase tracking-widest border-r border-gray-200 pr-6">
              {currentDate}
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              <div className="flex items-center gap-1 px-1.5 py-0.5 md:px-2 bg-orange-600 text-white text-[8px] md:text-[9px] font-black uppercase tracking-widest rounded-sm shadow-sm">
                <span className="w-1 h-1 bg-white rounded-full animate-pulse" />
                {t("trending")}
              </div>
              <p className="text-[9px] md:text-[10px] font-bold text-gray-900 truncate max-w-[120px] xs:max-w-[180px] sm:max-w-xs md:max-w-md">
                {t("breakingNewsText")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <div className="hidden lg:flex items-center gap-5 text-gray-400">
              <a
                href="#"
                className="hover:text-gray-900 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <FaFacebookF size={12} />
              </a>
              <a
                href="#"
                className="hover:text-gray-900 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <FaTwitter size={12} />
              </a>
              <a
                href="#"
                className="hover:text-gray-900 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <FaInstagram size={12} />
              </a>
              <a
                href="#"
                className="hover:text-gray-900 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <FaYoutube size={12} />
              </a>
            </div>
            <div className="hidden lg:block h-3 w-[1px] bg-gray-200" />
            <button
              onClick={() =>
                i18n.changeLanguage(i18n.language === "en" ? "bn" : "en")
              }
              className="group flex items-center gap-1.5 md:gap-2 text-[9px] md:text-[10px] font-black uppercase tracking-wider md:tracking-[0.15em] text-gray-900 hover:text-orange-600 transition-colors"
            >
              <span className="text-gray-400 group-hover:text-orange-400 transition-colors">
                {i18n.language === "en" ? "BN" : "EN"}
              </span>
              <span className="w-0.5 h-0.5 md:w-1 md:h-1 bg-gray-300 rounded-full group-hover:bg-orange-600 transition-colors" />
              <span className="hidden xs:inline">
                {i18n.language === "en" ? "বাংলা" : "English"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. MASTHEAD - Logo Left & Toolset Right */}
      <div className="py-4 md:py-8 border-b border-gray-50">
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
          <div className="flex items-center gap-3 md:gap-6">
            <button
              onClick={toggleMenu}
              className="lg:hidden text-gray-900 hover:text-orange-600 transition-colors p-1.5 hover:bg-gray-50 rounded-lg"
            >
              <IoMenuSharp size={26} />
            </button>
            <Link
              to="/"
              className="flex flex-col group"
              onClick={() => handleCategoryChange("")}
            >
              <img
                src="/Logo.png"
                alt="Logo"
                className="h-8 md:h-14 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
              />
              <span className="hidden sm:block text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mt-1.5">
                {t("combatSportsAuthority")}
              </span>
            </Link>
          </div>


          <div className="flex items-center gap-1.5 md:gap-5">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-gray-500 hover:text-orange-600 transition-all hover:bg-gray-50 rounded-full"
            >
              <IoSearchOutline size={22} />
            </button>
            <div className="hidden sm:block h-6 w-[1px] bg-gray-100 mx-1" />
            {user ? (
              <div className="relative group">
                <img
                  src={user?.profileImage || avatarImg}
                  alt="user"
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-gray-100 cursor-pointer object-cover shadow-sm transition-transform group-hover:scale-105"
                />
                <div className="absolute hidden group-hover:block top-full right-0 pt-4 w-56 z-[110] animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden py-2 ring-1 ring-black/5">
                    <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100 mb-2">
                      <p className="text-[10px] font-black text-gray-900 uppercase tracking-tight truncate">
                        {user.username}
                      </p>
                      <p className="text-[8px] font-bold text-orange-600 uppercase tracking-widest mt-0.5">
                        {user.role}
                      </p>
                    </div>
                    <Link
                      to="/profile"
                      className="block px-6 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                    >
                      {t("journalistProfile")}
                    </Link>
                    {user.role === "admin" && (
                      <Link
                        to="/dashboard"
                        className="block px-6 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-colors border-t border-gray-50"
                      >
                        {t("adminDashboard")}
                      </Link>
                    )}
                    <button
                      onClick={hanDelLogout}
                      className="w-full text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition-colors border-t border-gray-50"
                    >
                      {t("signOut")}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                to="/log-in"
                className="text-[9px] md:text-[10px] font-black uppercase tracking-wider md:tracking-[0.15em] text-gray-900 hover:text-orange-600 bg-gray-50 hover:bg-gray-100 px-4 md:px-5 py-2 md:py-2.5 rounded-full transition-all"
              >
                {t("signIn")}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* 3. NAVIGATION - Clean & Structured */}
      <nav
        className={`w-full bg-white border-y border-gray-100 transition-all duration-300 ${
          scrolled
            ? "fixed top-0 shadow-lg py-2 z-[1001]"
            : "relative py-4 hidden lg:block"
        }`}
        onMouseLeave={handleHoverLeave}
      >
        <div className="container mx-auto px-6 flex justify-center items-center gap-12">
          {scrolled && (
            <Link
              to="/"
              className="absolute left-4 md:left-6"
              onClick={() => handleCategoryChange("")}
            >
              <img src="/Logo.png" alt="Logo" className="h-6 md:h-8 w-auto" />
            </Link>
          )}

          <ul
            className={`flex items-center ${scrolled ? "gap-6 md:gap-10" : "gap-10"}`}
          >
            <li>
              <button
                onClick={() => handleCategoryChange("")}
                onMouseEnter={() =>
                  handleHoverEnter({ name: "", name_bn: t("news") })
                }
                className={`text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] transition-all relative py-2 ${!searchParams.get("category") ? "text-orange-600" : "text-gray-900 hover:text-orange-600"}`}
              >
                {t("news")}
              </button>
            </li>
            {/* Show only top 3 on medium screens when scrolled, all on lg */}
            {(scrolled ? topCategories.slice(0, 3) : topCategories).map(
              (cat) => (
                <li key={cat._id} className={scrolled ? "hidden md:block" : ""}>
                  <button
                    onClick={() => handleCategoryChange(cat.name)}
                    onMouseEnter={() => handleHoverEnter(cat)}
                    className={`text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] transition-all relative py-2 ${searchParams.get("category") === cat.name ? "text-orange-600" : "text-gray-900 hover:text-orange-600"}`}
                  >
                    {i18n.language === "bn"
                      ? cat.name_bn || cat.name
                      : cat.name}
                  </button>
                </li>
              ),
            )}
            {moreCategories.length > 0 && (
              <li className="relative group">
                <button
                  className={`text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] py-2 flex items-center gap-1 transition-all ${moreCategories.some((c) => searchParams.get("category") === c.name) ? "text-orange-600" : "text-gray-900 hover:text-orange-600"}`}
                >
                  {t("more")} <IoCloseSharp className="rotate-45" size={12} />
                </button>
                <div className="absolute hidden group-hover:block top-full left-0 pt-2 w-48 z-[110]">
                  <div className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden py-2">
                    {moreCategories.map((cat) => (
                      <button
                        key={cat._id}
                        onClick={() => handleCategoryChange(cat.name)}
                        className={`w-full text-left px-5 py-3 text-[10px] font-black uppercase tracking-widest transition-colors ${searchParams.get("category") === cat.name ? "bg-gray-50 text-orange-600" : "text-gray-600 hover:bg-gray-50 hover:text-orange-600"}`}
                      >
                        {i18n.language === "bn"
                          ? cat.name_bn || cat.name
                          : cat.name}
                      </button>
                    ))}
                  </div>
                </div>
              </li>
            )}
          </ul>

          {scrolled && (
            <button
              onClick={() => setIsSearchOpen(true)}
              className="absolute right-4 md:right-6 text-gray-900 hover:text-orange-600 transition-colors"
            >
              <IoSearchOutline size={20} />
            </button>
          )}
        </div>

        {/* MEGA MENU OVERLAY - Keep hidden on mobile/small screens */}
        <div
          className={`absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-2xl transition-all duration-500 origin-top overflow-hidden z-[120] hidden lg:block ${hoveredCategory ? "max-h-[600px] opacity-100 visible" : "max-h-0 opacity-0 invisible"}`}
          onMouseEnter={() => {
            if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
          }}
          onMouseLeave={handleHoverLeave}
        >
          {hoveredCategory && (
            <MegaMenuContent
              category={hoveredCategory}
              onClose={() => setHoveredCategory(null)}
            />
          )}
        </div>
      </nav>

      {/* SEARCH OVERLAY */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[2000] bg-white/98 backdrop-blur-md flex flex-col p-4 md:p-10 animate-in fade-in zoom-in-95 duration-300">
          <div className="flex justify-end mb-12 md:mb-20">
            <button
              onClick={() => setIsSearchOpen(false)}
              className="p-3 md:p-4 text-gray-900 hover:rotate-90 transition-all duration-300 hover:bg-gray-50 rounded-full"
            >
              <IoCloseSharp size={32} className="md:w-10 md:h-10" />
            </button>
          </div>
          <div className="container mx-auto max-w-4xl">
            <form onSubmit={handleSearch} className="relative group">
              <input
                autoFocus
                type="text"
                placeholder={t("search")}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full bg-transparent border-b-2 md:border-b-4 border-gray-900 py-4 md:py-6 text-2xl md:text-6xl font-black text-gray-900 placeholder:text-gray-100 outline-none transition-all focus:placeholder:opacity-0"
              />
              <button
                type="submit"
                className="absolute right-0 bottom-4 md:bottom-6 text-gray-400 group-focus-within:text-orange-600 transition-colors"
              >
                <IoSearchOutline size={32} className="md:w-10 md:h-10" />
              </button>
            </form>
            <div className="mt-8 flex flex-wrap gap-3 md:gap-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 w-full mb-1">
                {t("trendingSearches") || "Trending Searches"}
              </p>
              {["Boxing", "UFC", "MMA", "Wrestling"].map((term) => (
                <button
                  key={term}
                  onClick={() => setSearchInput(term)}
                  className="px-4 py-1.5 bg-gray-50 hover:bg-orange-50 text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-orange-600 rounded-full transition-all border border-gray-100"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MOBILE MENU */}
      <div
        className={`lg:hidden fixed inset-0 z-[2000] transition-all duration-500 ${isMenuOpen ? "visible" : "invisible"}`}
      >
        <div
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-500 ${isMenuOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setIsMenuOpen(false)}
        />
        <div
          className={`absolute left-0 top-0 h-full w-[85%] max-w-sm bg-white shadow-2xl transition-transform duration-500 ease-out transform ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex flex-col h-full">
            {/* Drawer Header */}
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
              <img src="/Logo.png" alt="Logo" className="h-8 w-auto" />
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-900 transition-colors"
              >
                <IoCloseSharp size={24} />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6">
                {t("navigation")}
              </p>
              <nav className="flex flex-col gap-1">
                <button
                  onClick={() => {
                    handleCategoryChange("");
                    setIsMenuOpen(false);
                  }}
                  className={`w-full text-left py-4 px-4 rounded-xl text-lg font-black uppercase transition-all ${
                    !searchParams.get("category")
                      ? "bg-orange-50 text-orange-600"
                      : "text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {t("news")}
                </button>
                {categories?.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => {
                      handleCategoryChange(cat.name);
                      setIsMenuOpen(false);
                    }}
                    className={`w-full text-left py-4 px-4 rounded-xl text-lg font-black uppercase transition-all ${
                      searchParams.get("category") === cat.name
                        ? "bg-orange-50 text-orange-600"
                        : "text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    {i18n.language === "bn"
                      ? cat.name_bn || cat.name
                      : cat.name}
                  </button>
                ))}
              </nav>

              <div className="mt-10 border-t border-gray-50 pt-8">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6">
                  {t("followUs")}
                </p>
                <div className="flex gap-5 text-gray-400">
                  <FaFacebookF
                    size={18}
                    className="hover:text-orange-600 transition-colors"
                  />
                  <FaTwitter
                    size={18}
                    className="hover:text-orange-600 transition-colors"
                  />
                  <FaInstagram
                    size={18}
                    className="hover:text-orange-600 transition-colors"
                  />
                  <FaYoutube
                    size={18}
                    className="hover:text-orange-600 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-6 bg-gray-50 flex flex-col gap-3">
              {!user ? (
                <Link
                  to="/log-in"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full py-4 bg-gray-900 text-white text-center rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-black/10 active:scale-[0.98] transition-transform"
                >
                  {t("signIn")}
                </Link>
              ) : (
                <div className="flex items-center gap-4 p-3 bg-white rounded-xl shadow-sm mb-2">
                  <img
                    src={user?.profileImage || avatarImg}
                    className="w-10 h-10 rounded-full border border-gray-100"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black text-gray-900 uppercase truncate">
                      {user.username}
                    </p>
                    <p className="text-[8px] font-bold text-orange-600 uppercase tracking-widest">
                      {user.role}
                    </p>
                  </div>
                </div>
              )}
              <button
                onClick={() => {
                  i18n.changeLanguage(i18n.language === "en" ? "bn" : "en");
                  setIsMenuOpen(false);
                }}
                className="w-full py-4 border border-gray-200 bg-white text-gray-900 rounded-xl font-black uppercase text-[10px] tracking-widest hover:border-orange-200 transition-colors"
              >
                {i18n.language === "en" ? "বাংলা সংস্করণ" : "English Version"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
