import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSubscribedChannels, toggleSubscription } from "../store/subscriptionSlice";

const Subscription = () => {
  const dispatch = useDispatch();
  const { subscriptions, loading, error } = useSelector((state) => state.subscription);

  useEffect(() => {
    dispatch(fetchSubscribedChannels());
  }, [dispatch]);

  const handleSubscribeToggle = (channelId) => {
    dispatch(toggleSubscription(channelId));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h2 className="text-3xl font-bold text-cyan-400 mb-6">Subscribed Channels</h2>

      {loading && <p className="text-center text-lg">Loading subscriptions...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      
      {subscriptions.length === 0 ? (
        <p className="text-center text-gray-400">You have not subscribed to any channels yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {subscriptions.map((sub) => (
            <div key={sub._id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
              <h3 className="text-lg font-bold">{sub.channel.username}</h3>
              <p className="text-gray-400">{sub.channel.email}</p>
              <button
                onClick={() => handleSubscribeToggle(sub.channel._id)}
                className="mt-3 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
              >
                Unsubscribe
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Subscription;
