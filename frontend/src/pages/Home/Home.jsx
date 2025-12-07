import Blogs from "../blogs/Blogs"
import Hero from "./Hero"
const Home = () => {
  return (
    <div className="bg-white text-primary container mx-auto mt-8 p-8">
      <Hero/>
      
      <div className="mt-20"> {/* Increased top margin for separation */}
        <h3 className="text-2xl font-semibold mb-8 border-b-2 border-gray-200 pb-2">Latest Articles</h3> {/* Section Header */}
        <Blogs/>
      </div>
    </div>
  )
}

export default Home

