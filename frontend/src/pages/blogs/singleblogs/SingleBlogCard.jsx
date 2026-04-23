import { FaUserCircle, FaClock, FaStar, FaRegStar,FaFacebook,FaTwitter,FaInstagram } from "react-icons/fa";
import { formatDate } from "../../../utility/DateFormat";


const socialICONS= [
  {
    name: "Facebook",
    icon: <FaFacebook />,
    color: "hover:bg-[#1877F2] hover:shadow-[#1877F2]/30"
  },
  {
    name: "Twitter",
    icon: <FaTwitter />,
    color: "hover:bg-[#1DA1F2] hover:shadow-[#1DA1F2]/30"
  },
  {
    name: "Instagram",
    icon: <FaInstagram />,
    color: "hover:bg-[#E4405F] hover:shadow-[#E4405F]/30"
  },
]

const SingleBlogCard = ({ blog }) => {
  const { title, description, content, coverImg, category, rating, author, createdAt } = blog || {};

  return (
    <div className='bg-white'>
      {/* Article Cover Image */}
      <div className="w-full overflow-hidden rounded-2xl md:rounded-[32px] shadow-sm mb-6">
        <img src={coverImg} alt={title} className="w-full h-auto object-cover max-h-[700px]" />
      </div>

      <div className="px-4 md:px-12">
        {/* Article Header Info - Tightened Spacing */}
        <div className="max-w-4xl mb-8">
          {category && (
            <span className="bg-orange-600 text-white text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] px-4 md:px-5 py-2 rounded-full mb-4 inline-block shadow-lg">
              {category}
            </span>
          )}
          <h1 className='text-2xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4 md:mb-6 leading-[1.1] tracking-tight'>
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
          {description && (
            <div className="mb-12 p-8 bg-orange-50/50 rounded-[32px] border-l-8 border-orange-600 shadow-sm">
              <p className="text-xl md:text-2xl text-gray-800 font-extrabold italic leading-relaxed">
                {description}
              </p>
            </div>
          )}

          <div 
            dangerouslySetInnerHTML={{ 
              __html: String(content || "")
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&amp;/g, '&')
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'")
                .replace(/&nbsp;/g, ' ')
                // Super Cleanup: Strip wrapper paragraphs even with whitespace/nbsp
                .replace(/<p>\s*<(h1|h2|h3|h4|h5|h6|ul|ol|li|blockquote|hr|p|iframe|video)/g, '<$1')
                .replace(/<\/(h1|h2|h3|h4|h5|h6|ul|ol|li|blockquote|hr|p|iframe|video)>\s*<\/p>/g, '</$1>')
                // Remove any remaining empty paragraphs
                .replace(/<p>\s*<\/p>/g, '')
            }} 
            className='quill-content ql-editor prose prose-lg md:prose-xl max-w-none text-gray-800 leading-relaxed' 
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
                <span className="text-2xl font-black text-gray-900">{rating || "0.0"}</span>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Article Impact</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Share Story</span>
              <div className="flex gap-3">
                {socialICONS.map(social => (
                  <button 
                    key={social.name} 
                    onClick={() => {
                      const url = window.location.href;
                      navigator.clipboard.writeText(url);
                      alert("Link copied to clipboard!");
                    }}
                    className={`w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-xl text-gray-400 hover:text-white transition-all duration-300 shadow-sm hover:-translate-y-1 active:scale-90 ${social.color}`}
                    title={`Copy link for ${social.name}`}
                  >
                    {social.icon}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      

    </div>
  );
};

export default SingleBlogCard;
