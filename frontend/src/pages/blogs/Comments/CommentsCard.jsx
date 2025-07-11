import { formatDate } from '../../../utility/DateFormat';
import React from 'react';
import PostAComment from './PostAComment';
import { useSelector } from 'react-redux';
import UserImg from "../../../assets/commentor.png";

const CommentsCard = ({ comments }) => {
  const user = useSelector((state) => state.auth.user);

  console.log("Rendering CommentsCard with:", comments);

  return (
    <div className='my-10 bg-white p-6 md:p-8 rounded-md shadow-sm border'>
      {/* Comment List */}
      {comments.length > 0 ? (
        <>
          <h3 className='text-xl font-semibold text-gray-800 mb-4'>All Comments</h3>
          <div className='space-y-6'>
            {comments.map((comment, index) => (
              <div key={index} className='flex items-start gap-4'>
                <img
                  src={UserImg}
                  alt="User avatar"
                  className='w-12 h-12 rounded-full object-cover'
                />
                <div>
                  <p className='text-blue-600 font-medium capitalize underline underline-offset-4'>
                    {comment?.user?.username || "Anonymous"}
                  </p>
                  <p className="mt-1 text-gray-700">{comment.comment}</p>
                  <p className='text-xs text-gray-500 mt-1 italic'>
                    {formatDate(comment.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className='text-gray-600 text-base'>No comments found.</p>
      )}

      {/* Divider */}
      <hr className='my-6' />

      {/* Comment Input */}
      <PostAComment />
    </div>
  );
};

export default CommentsCard;
