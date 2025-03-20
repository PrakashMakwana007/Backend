import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchVideoComments, addComment, updateComment, deleteComment } from "../store/commentSlice";

const Comment = ({ videoId }) => {
  const dispatch = useDispatch();
  const { comments, loading, error } = useSelector((state) => state.comment);
  const { user } = useSelector((state) => state.user);
  const [newComment, setNewComment] = useState("");
  const [editMode, setEditMode] = useState(null);
  const [editedComment, setEditedComment] = useState("");

  useEffect(() => {
    dispatch(fetchVideoComments(videoId));
  }, [dispatch, videoId]);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (newComment.trim() === "") return;
    dispatch(addComment({ videoId, content: newComment }));
    setNewComment("");
  };

  const handleEditComment = (commentId, content) => {
    setEditMode(commentId);
    setEditedComment(content);
  };

  const handleUpdateComment = (commentId) => {
    if (editedComment.trim() === "") return;
    dispatch(updateComment({ commentId, content: editedComment }));
    setEditMode(null);
  };

  const handleDeleteComment = (commentId) => {
    dispatch(deleteComment(commentId));
  };

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg">
      <h3 className="text-xl font-bold text-cyan-400">Comments</h3>

      {user && (
        <form onSubmit={handleAddComment} className="mt-4 flex gap-2">
          <input
            type="text"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <button type="submit" className="bg-cyan-500 text-white px-4 py-2 rounded-md hover:bg-cyan-400 transition">
            Add
          </button>
        </form>
      )}

      {loading && <p className="text-gray-400 mt-4">Loading comments...</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}

      <div className="mt-4 space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-400">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="bg-gray-800 p-4 rounded-md shadow-md">
              <p className="text-sm text-gray-400">By {comment.owner.username}</p>

              {editMode === comment._id ? (
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={editedComment}
                    onChange={(e) => setEditedComment(e.target.value)}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  />
                  <button
                    onClick={() => handleUpdateComment(comment._id)}
                    className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-400 transition"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <p className="text-lg mt-2">{comment.content}</p>
              )}

              {user && user._id === comment.owner._id && (
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleEditComment(comment._id, comment.content)}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Comment;
