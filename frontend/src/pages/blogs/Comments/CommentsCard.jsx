import { useSelector } from 'react-redux';
import UserImg from "../../../assets/commentor.png";
import { formatDate } from '../../../utility/DateFormat';
import PostAComment from './PostAComment';

const CommentsCard = ({ comments }) => {
  const user = useSelector((state) => state.auth.user);

  console.log("Rendering CommentsCard with:", comments);

  return (
    <div className='my-10 bg-white p-6 md:p-8 rounded-md shadow-sm border'>
      {/* Comment List */}
      {comments.length > 0 ? (
        <>
          <h3 className='text-2xl font-bold text-gray-900 mb-6'>All Comments ({comments.length})</h3>
          <div className='space-y-6'>
            {comments.map((comment, index) => (
              <div key={index} className='flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100'>
                <img
                  src={UserImg}
                  alt="User avatar"
                  className='w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-sm'
                />
                <div className='flex-1'>
                  <div className='flex items-center justify-between mb-2'>
                    <p className='font-semibold text-gray-900'>
                      {comment?.user?.username || "Anonymous"}
                    </p>
                    <p className='text-xs text-gray-500'>
                      {formatDate(comment.createdAt)}
                    </p>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-sm md:text-base">{comment.comment}</p>
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
