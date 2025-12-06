import { useFetchCategoriesQuery } from '../../redux/features/category/categoryApi';

const Searchblogs = ({ search, handleSearchChange, handleSearch, category, handleCategoryChange }) => {
  const { data: categories } = useFetchCategoriesQuery();

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-6 px-3">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <input
          value={search}
          onChange={handleSearchChange}
          onKeyPress={handleKeyPress}
          type="text"
          placeholder="Search blogs..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <select
            value={category}
            onChange={handleCategoryChange}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        >
            <option value="">All Categories</option>
            {categories && categories.map((cat) => (
                <option key={cat._id} value={cat.name}>{cat.name}</option>
            ))}
        </select>
        <button
          onClick={handleSearch}
          type="submit"
          className="w-full sm:w-auto bg-[#1e73be] text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200">
          Search
        </button>
      </div>
    </div>
  );
};

export default Searchblogs;
