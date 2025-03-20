import { useDispatch, useSelector } from "react-redux";
import { toggleVideoLike, toggleCommentLike } from "../store/likeSlice";
import { ThumbsUp } from "lucide-react";

const LikeButton = ({ videoId, commentId, isLiked, likeCount }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const handleLike = () => {
    if (!user) {
      alert("You must be logged in to like this.");
      return;
    }

    if (videoId) {
      dispatch(toggleVideoLike(videoId));
    } else if (commentId) {
      dispatch(toggleCommentLike(commentId));
    }
  };

  return (
    <button
      onClick={handleLike}
      className={`flex items-center gap-1 px-3 py-2 rounded-md transition ${
        isLiked ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-300"
      }`}
    >
      <ThumbsUp size={18} />
      <span>{likeCount}</span>
    </button>
  );
};

export default LikeButton;
