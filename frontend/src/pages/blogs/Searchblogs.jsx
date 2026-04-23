import { useFetchCategoriesQuery } from '../../redux/features/category/categoryApi';
import { FiSearch, FiFilter } from "react-icons/fi";

const Searchblogs = ({ search, handleSearchChange, handleSearch, category, handleCategoryChange }) => {
  const { data: categories } = useFetchCategoriesQuery();

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="w-full bg-white border border-gray-200 rounded-2xl md:rounded-3xl shadow-sm mb-8 md:mb-12 overflow-hidden">
      <div className="flex flex-col md:flex-row items-stretch">
        {/* Search Input Section */}
        <div className="flex-grow flex items-center px-5 md:px-6 py-4 border-b md:border-b-0 md:border-r border-gray-100 group">
          <FiSearch className="text-gray-400 group-focus-within:text-orange-600 transition-colors w-5 h-5 flex-shrink-0" />
          <input
            value={search}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
            type="text"
            placeholder="Search news, fighters..."
            className="w-full px-4 bg-transparent text-gray-800 placeholder:text-gray-400 focus:outline-none font-medium text-sm md:text-base"
          />
        </div>
        
        {/* Category Select Section */}
        <div className="flex items-center px-5 md:px-6 py-4 border-b md:border-b-0 md:border-r border-gray-100 bg-gray-50/50">
          <FiFilter className="text-gray-400 mr-3 w-4 h-4" />
          <select
            value={category}
            onChange={handleCategoryChange}
            className="w-full bg-transparent text-gray-700 font-outfit font-black text-[10px] md:text-sm uppercase tracking-widest focus:outline-none appearance-none cursor-pointer pr-8"
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%236b7280\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0 center', backgroundSize: '1rem' }}
          >
            <option value="">Categories</option>
            {categories && categories.map((cat) => (
              <option key={cat._id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Action Button */}
        <button
          onClick={handleSearch}
          className="bg-orange-600 hover:bg-orange-700 text-white font-outfit font-black uppercase tracking-widest px-8 md:px-10 py-5 md:py-4 transition-all active:scale-95 text-xs md:text-sm"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default Searchblogs;
