import { FaUserCircle, FaClock, FaStar, FaRegStar } from "react-icons/fa";
import { formatDate } from "../../../utility/DateFormat";


const SingleBlogCard = ({ blog }) => {
  const { title, description, content, coverImg, category, rating, author, createdAt } = blog || {};

  return (
    <div className='bg-white'>
      {/* Article Cover Image */}
      <div className="w-full overflow-hidden rounded-[32px] shadow-sm mb-6">
        <img src={coverImg} alt={title} className="w-full h-auto object-cover max-h-[700px]" />
      </div>

      <div className="px-6 md:px-12">
        {/* Article Header Info - Tightened Spacing */}
        <div className="max-w-4xl mb-8">
          {category && (
            <span className="bg-orange-600 text-white text-[10px] font-black uppercase tracking-[0.2em] px-5 py-2 rounded-full mb-4 inline-block shadow-lg">
              {category}
            </span>
          )}
          <h1 className='text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-[1.1] tracking-tight'>
            {title}
          </h1>
          
          <div className='flex flex-wrap items-center gap-6 text-gray-500 text-xs font-bold uppercase tracking-widest border-y border-gray-100 py-5'>
            <div className="flex items-center gap-2">
              <FaUserCircle className="text-orange-600 w-4 h-4" />
              <span className="text-gray-900">By {author?.username || "Combat Staff"}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaClock className="text-gray-400 w-4 h-4" />
              <span>{formatDate(createdAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-orange-600 rounded-full" />
              <span>12 Min Read</span>
            </div>
          </div>
        </div>

        {/* Blog Content - Directly rendering HTML from Quill */}
        <div className='max-w-4xl mx-auto pb-16'>
          <div 
            dangerouslySetInnerHTML={{ __html: content }} 
            className='prose prose-lg md:prose-xl max-w-none text-gray-800 leading-relaxed font-medium space-y-4 quill-content' 
          />
          
          {/* Article Footer / Rating */}
          <div className='mt-16 pt-10 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8'>
            <div className='flex items-center gap-4 bg-gray-50 px-6 py-4 rounded-2xl'>
              <div className="flex gap-1 text-orange-500">
                {[...Array(5)].map((_, i) => (
                  i < Math.floor(rating || 0) ? <FaStar key={i} /> : <FaRegStar key={i} />
                ))}
              </div>
              <div className="h-6 w-[1px] bg-gray-200" />
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-gray-900">{rating || "4.8"}</span>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Article Impact</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-black uppercase tracking-widest text-gray-400">Share This Story:</span>
              <div className="flex gap-2">
                {['FB', 'TW', 'IN'].map(social => (
                  <button key={social} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-black hover:bg-orange-600 hover:text-white transition-all shadow-sm">
                    {social}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .quill-content img { border-radius: 20px; box-shadow: 0 10px 30px -10px rgba(0,0,0,0.1); }
        .quill-content h1, .quill-content h2, .quill-content h3 { font-weight: 800; text-transform: uppercase; letter-spacing: -0.02em; }
        .quill-content blockquote { border-left: 8px solid #ea580c; background: #fff7ed; padding: 1.5rem 2rem; border-radius: 0 20px 20px 0; font-style: normal; font-weight: 700; color: #9a3412; }
      `}} />
    </div>
  );
};

export default SingleBlogCard;
