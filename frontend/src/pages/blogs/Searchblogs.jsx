import React from 'react';

const Searchblogs = ({ search, handleSearchChange, handleSearch }) => {

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
