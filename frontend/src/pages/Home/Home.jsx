import { useState } from "react"
import Blogs from "../blogs/Blogs"
import Searchblogs from "../blogs/Searchblogs"

const Home = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [query, setQuery] = useState({ search: "", category: "" });

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSearch = () => {
    setQuery({ search, category });
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setQuery({ ...query, category: e.target.value });
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen text-gray-900">
      {/* Breaking News Ticker */}
      <div className="bg-white border-b border-gray-200 py-3 mb-6">
        <div className="container mx-auto px-4 flex items-center gap-4">
          <span className="bg-red-600 text-white px-3 py-1 rounded text-xs font-bold uppercase whitespace-nowrap animate-pulse">
            Breaking News
          </span>
          <div className="overflow-hidden whitespace-nowrap">
            <p className="inline-block animate-marquee hover:pause-marquee cursor-pointer text-sm font-medium">
              • New MMA gym opens in Dhaka with international coaches • Bangladesh Boxing Federation announces national trials • Fighter "The Tiger" secures contract with global promotion • Upcoming Combat Night tickets now on sale!
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12">
        {/* Sleek Search Bar - Now Full Width Above Content */}
        <Searchblogs 
          search={search}
          handleSearchChange={handleSearchChange}
          handleSearch={handleSearch}
          category={category}
          handleCategoryChange={handleCategoryChange}
        />

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content Area */}
          <div className="lg:w-3/4">
            <Blogs query={query} />
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="sticky top-24">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                <h4 className="text-xl font-bold mb-6 border-b-2 border-gray-100 pb-2">Trending Topics</h4>
                <ul className="space-y-4">
                  {[
                    { tag: "#MMA_Bangladesh", count: "1.2k posts" },
                    { tag: "#DhakaFights", count: "850 posts" },
                    { tag: "#BoxingNational", count: "2.1k posts" },
                    { tag: "#MuayThaiDhaka", count: "500 posts" },
                    { tag: "#CombatCorner", count: "3.4k posts" }
                  ].map((item, index) => (
                    <li key={index} className="group cursor-pointer">
                      <p className="font-bold text-blue-600 group-hover:underline">{item.tag}</p>
                      <p className="text-xs text-gray-500">{item.count}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-blue-900 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                <h4 className="text-2xl font-black mb-4 relative z-10">Join the Community</h4>
                <p className="text-blue-100 mb-6 relative z-10">Get the latest updates and exclusive content delivered to your inbox.</p>
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder:text-white/60 mb-4 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <button className="w-full py-3 bg-white text-blue-900 font-bold rounded-lg hover:bg-blue-50 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 30s linear infinite;
        }
        .pause-marquee:hover {
          animation-play-state: paused;
        }
      `}} />
    </div>
  )
}

export default Home

