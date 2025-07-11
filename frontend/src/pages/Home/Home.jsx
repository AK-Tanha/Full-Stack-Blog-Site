import Hero from "./Hero"
import Blogs from "../blogs/Blogs"
const Home = () => {
  return (
    <div className="bg-white text-primary container mx-auto mt-8 p-8">
      <div>
        <Hero/>
        <hr/>
        <Blogs/>
      </div>
      
    </div>
  )
}

export default Home

