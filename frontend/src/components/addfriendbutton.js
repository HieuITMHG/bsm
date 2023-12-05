import { useState, useEffect } from "react";

const AddFriendButton = ({ user }) => {
  const [userId, setUserId] = useState("");
  const accessToken = localStorage.getItem("access_token");
  const [action, setAction] = useState(null); 
  const [ketket, setKetket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const access_token = localStorage.getItem("access_token");

    if (access_token) {
      fetch("/api/user/", {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setUserId(data.id);
          setLoading(false);
            console.log(data)
          // Check if the user is followed by the logged-in user
          const isUserFollowed = user.addfriend_by.includes(data.id);
          const isketket = data.addfriend_by.includes(user.id);
          setKetket(isketket);
          setAction(isUserFollowed);
        })
        .catch((error) => console.error("Error:", error));
    }
  }, [user]);

  const handleFollow = (e) => {
    e.preventDefault();
    fetch("/api/addfriend/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ aims_id: user.id }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setAction(true); // User is now followed
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleUnfollow = (e) => {
    e.preventDefault();
    fetch("http://127.0.0.1:8000/api/unfriend/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ aims_id: user.id }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setAction(false); // User is now unfollowed
        setKetket(data.ketket)
      })
      .catch((error) => console.error("Error:", error));
  };

  if (!loading) {
    return (
      <div className="followButton">
        {(action!== null ) && (
          <button
            onClick={action ? handleUnfollow : handleFollow}
            className={`follow_btn ${action  ? "unfollow" : "follow"}`}
          >
            {(action && !ketket) && "Cancel"}
            {(action && ketket) && "Unfriend"}
            {(!action && !ketket) && "Add friend"}
            {(!action && ketket) && "Accept"}

          </button>
        )}
      </div>
    );
  }
  return null;
};

export default AddFriendButton;