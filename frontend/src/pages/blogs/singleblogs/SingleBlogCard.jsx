import { formatDate } from '../../../utility/DateFormat';
import React from 'react';
import EditorJsHtml from "editorjs-html";

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
    <div className='bg-white p-8'>
      {/* blog Header */}
      <div>
        <h1 className='md:text-3xl text-4xl font-medium mb-4'>{title}</h1>
        <p className='mb-6'>
          {formatDate(createdAt)} by 
          <span className='text-blue-400 cursor-pointer'> Admin 1</span>
        </p>
      </div>

      {/* blog Image */}
      <div>
        <img src={coverImg} alt="Cover Image" className='w-full md:h-[520px] bg-cover' />
      </div>

      {/* blog Content */}
      <div className='mt-8 space-y-4'>
        <div dangerouslySetInnerHTML={{ __html: htmlContent }}  className='space-y-3 editorJsdiv'/>
      </div>

      {/* blog ratings */}
      <div>
        <span className='text-lg font-medium'>Rating: </span>
        <span>{rating}(Based on 2300 Reviews)</span>
      </div>



    </div>
  );
};

export default SingleBlogCard;
