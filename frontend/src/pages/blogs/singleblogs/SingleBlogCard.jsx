import EditorJsHtml from "editorjs-html";
import { formatDate } from '../../../utility/DateFormat';

const parser = EditorJsHtml();

const SingleBlogCard = ({ blog }) => {
  const { title, description, content, coverImg, category, rating, author, createdAt } = blog || {};

  let htmlContent = '';
  try {
    if (content && typeof content === 'object' && Array.isArray(content.blocks)) {
      const parsed = parser.parse(content); // returns { paragraph: [...], header: [...], list: [...] }
      htmlContent = Object.values(parsed).flat().join('');
    }
  } catch (err) {
    console.error("EditorJS parsing error:", err);
  }

  return (
    <div className='bg-white p-8 rounded-lg shadow-md'>
      {/* Blog Header */}
      <div>
        {category && (
            <span className="text-sm text-blue-600 font-semibold uppercase tracking-wider mb-2 inline-block">
                {category}
            </span>
        )}
        <h1 className='text-3xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight'>
            {title}
        </h1>
        <div className='flex items-center gap-2 text-gray-500 mb-8 text-sm'>
            <span>{formatDate(createdAt)}</span>
            <span>•</span>
            <span className='font-medium text-blue-600 cursor-pointer'>Admin</span>
        </div>
      </div>

      {/* Blog Image */}
      <div className='mb-8'>
        <img src={coverImg} alt="Cover Image" className='w-full h-auto rounded-xl shadow-sm' />
      </div>

      {/* Blog Content */}
      <div className='space-y-6 text-gray-700 text-lg leading-relaxed'>
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} className='space-y-4 editorJsdiv' />
      </div>

      {/* Blog Ratings */}
      <div className='mt-8 pt-6 border-t border-gray-100 flex items-center justify-between'>
        <div className='flex items-center gap-2'>
            <span className='text-lg font-bold text-gray-900'>Rating:</span>
            <span className='bg-yellow-100 text-yellow-800 md:text-xs text-2xs font-semibold px-2.5 py-0.5 rounded'>
                {rating} / 5
            </span>
            <span className='text-xs md:text-sm  text-gray-500'>(Based on 2300 Reviews)</span>
        </div>
      </div>
    </div>
  );
};

export default SingleBlogCard;
