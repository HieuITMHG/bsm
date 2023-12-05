import { useEffect, useState } from "react";
import ChatBox from "./chatbox";

const Chatapp = () => {
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState({});

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
              console.log(data)
              setUser(data)
              setLoading(false)
            })
            .catch((error) => console.error("Error:", error));
        }
      }, []);

    if(loading) {
        return (
            <div>loading</div>
        )
    }else {
        return (
            <div className="chatAppContainer">
                <input></input>
                <ul>
                    {
                        user.friends.map(friend => (      
                          <li key={friend.username}>{friend.username}
                              <ChatBox receiverId = {friend.id} senderId = {user.id} />
                          </li>                                                  
                        ))
                    }
                </ul>
            </div>
        )
    }
    
}   

export default Chatapp;