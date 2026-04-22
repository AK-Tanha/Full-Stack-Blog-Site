import { useState } from 'react';
import { useSelector } from 'react-redux';
import UserImg from "../../../assets/commentor.png";
import { formatDate } from '../../../utility/DateFormat';
import PostAComment from './PostAComment';
import { useUpdateCommentMutation, useDeleteCommentMutation } from '../../../redux/features/comments/commentApi';
import { useParams } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';

const CommentsCard = ({ comments }) => {
  const { id: postId } = useParams();
  const authUser = useSelector((state) => state.auth.user);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");
  
  const [updateComment] = useUpdateCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();

  const handleEditClick = (comment) => {
    setEditingId(comment._id);
    setEditContent(comment.comment);
  };

  const handleUpdate = async (commentId) => {
    try {
      await updateComment({ id: commentId, comment: editContent, postId }).unwrap();
      setEditingId(null);
    } catch (error) {
      alert("Failed to update comment");
    }
  };

  const handleDelete = async (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await deleteComment({ id: commentId, postId }).unwrap();
      } catch (error) {
        alert("Failed to delete comment");
      }
    }
  };

  return (
    <div className='my-10 bg-white p-6 md:p-10 rounded-[32px] shadow-xl shadow-gray-200/40 border border-gray-100'>
      {/* Comment List */}
      {comments && comments.length > 0 ? (
        <>
          <div className="flex items-center gap-4 mb-10">
            <h3 className="text-xl font-black uppercase tracking-tight text-gray-900 px-4 py-1.5 bg-gray-50 border-gray-900 border-l-4">
              All Comments ({comments.length})
            </h3>
            <div className="h-[1px] flex-grow bg-gray-100"></div>
          </div>

          <div className='space-y-8'>
            {comments.map((comment, index) => {
              const isOwner = authUser && (comment?.user?._id === authUser._id || comment?.user === authUser._id);
              const isAdmin = authUser?.role === 'admin';

              return (
                <div key={comment._id || index} className='group flex items-start gap-6 p-6 bg-white rounded-3xl border border-gray-100 hover:border-orange-200 hover:shadow-lg transition-all duration-300'>
                  <div className="w-14 h-14 flex-shrink-0">
                    <img
                      src={comment?.user?.profileImage || UserImg}
                      alt="User avatar"
                      className='w-full h-full rounded-2xl object-cover shadow-md ring-4 ring-gray-50'
                    />
                  </div>
                  
                  <div className='flex-1'>
                    <div className='flex items-center justify-between mb-3'>
                      <div className="space-y-0.5">
                        <p className='font-black text-gray-900 uppercase tracking-tight text-sm'>
                          {comment?.user?.username || "Anonymous Fighter"}
                        </p>
                        <p className='text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]'>
                          {formatDate(comment.createdAt)}
                        </p>
                      </div>

                      {(isOwner || isAdmin) && (
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {isOwner && (
                            <button 
                              onClick={() => handleEditClick(comment)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                            >
                              <FaEdit size={14} />
                            </button>
                          )}
                          <button 
                            onClick={() => handleDelete(comment._id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      )}
                    </div>

                    {editingId === comment._id ? (
                      <div className="mt-4 space-y-4">
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all font-medium text-sm"
                          rows="3"
                        />
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleUpdate(comment._id)}
                            className="px-4 py-2 bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-orange-200"
                          >
                            Save Changes
                          </button>
                          <button 
                            onClick={() => setEditingId(null)}
                            className="px-4 py-2 bg-gray-100 text-gray-500 text-[10px] font-black uppercase tracking-widest rounded-xl"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-700 leading-relaxed text-sm font-medium whitespace-pre-wrap">{comment.comment}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-[32px] border border-dashed border-gray-200">
           <p className='text-gray-400 font-black uppercase tracking-widest text-xs'>No combat insights yet. Be the first to share your thoughts.</p>
        </div>
      )}

      {/* Divider */}
      <div className="my-12 flex items-center gap-4">
         <div className="h-[1px] flex-grow bg-gray-100"></div>
         <span className="w-2 h-2 bg-gray-100 rounded-full"></span>
         <div className="h-[1px] flex-grow bg-gray-100"></div>
      </div>

      {/* Comment Input */}
      <PostAComment />
    </div>
  );
};

export default CommentsCard;
