import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useFetchBlogsByIDQuery } from '../../../redux/features/blogs/blogsApi';
import { usePostCommentMutation } from '../../../redux/features/comments/commentApi';

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
    <div className="mt-8">
      <h3 className='text-xl font-bold mb-4 text-gray-900'>Leave a Comment</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          name='text'
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows="5"
          placeholder='Share your thoughts...'
          className='w-full p-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors duration-200 text-gray-700 resize-none'
        />
        <div className='flex justify-end'>
            <button
            type='submit'
            className='px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform active:scale-95'
            >
            Post Comment
            </button>
        </div>
      </form>
    </div>
  );
};

export default PostAComment;
