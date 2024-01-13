import { useState, useEffect } from "react";

const FollowButton = ({ user }) => {
  const [userId, setUserId] = useState("");
  const accessToken = localStorage.getItem("access_token");
  const [action, setAction] = useState(null); // Initialize action as null
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const access_token = localStorage.getItem("access_token");

    if (access_token) {
      fetch("http://127.0.0.1:8000/api/user/", {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setUserId(data.id);
          setLoading(false);

          // Check if the user is followed by the logged-in user
          const isUserFollowed = user.followed_by.includes(data.id);
          setAction(isUserFollowed);
        })
        .catch((error) => console.error("Error:", error));
    }
  }, [user]);

  const handleFollow = (e) => {
    e.preventDefault();
    fetch("http://127.0.0.1:8000/api/follow/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ id: user.id }),
    })
      .then((response) => response.json())
      .then((data) => {
      
        setAction(true); // User is now followed
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleUnfollow = (e) => {
    e.preventDefault();
    fetch("http://127.0.0.1:8000/api/unfollow/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ id: user.id }),
    })
      .then((response) => response.json())
      .then((data) => {
      
        setAction(false); // User is now unfollowed
      })
      .catch((error) => console.error("Error:", error));
  };

  if (!loading) {
    return (
      <div className="followButton">
        {(action) !== null && ( // Render button only when action is not null
          <button
            onClick={action ? handleUnfollow : handleFollow}
            className={`follow_btn ${action  ? "unfollow" : "follow"}`}
          >
            {(action) ? "Unfollow" : "Follow"}
          </button>
        )}
      </div>
    );
  }
  return null;
};

export default FollowButton;