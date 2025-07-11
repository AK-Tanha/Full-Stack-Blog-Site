import { useFetchBlogsByIDQuery } from '../../../redux/features/blogs/blogsApi';
import { usePostCommentMutation } from '../../../redux/features/comments/commentApi';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

const PostAComment = () => {
  const { id } = useParams();
  const [comment, setComment] = useState('');
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const { refetch } = useFetchBlogsByIDQuery(id, { skip: !id });
  const [postComment] = usePostCommentMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to comment on this post.');
      navigate("/log-in");
      return;
    }

    const newComment = {
      comment: comment,
      user: user?._id,
      postId: id
    };

    try {
      const response = await postComment(newComment).unwrap();
      console.log(response);
      alert('Comment created successfully!');
      setComment('');
      refetch();
    } catch (error) {
      alert('An error occurred while posting the comment.');
    }
  };

  return (
    <div className="mt-10">
      <h3 className='text-xl font-semibold mb-4 text-gray-800'>Leave a Comment</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          name='text'
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows="6"
          placeholder='Share your opinion about this post...'
          className='w-full p-4 text-gray-800 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none'
        />
        <button
          type='submit'
          className='w-full bg-[#1E73BE] hover:bg-blue-700 transition duration-200 text-white font-medium py-2.5 rounded-md'
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default PostAComment;
