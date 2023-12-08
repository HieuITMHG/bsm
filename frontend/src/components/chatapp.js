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
              <div className="receiverContainer" style={{height:'50px'}}></div>
              {
                user.friends.map(friend => (           
                  <ChatBox receiver = {friend} sender = {user} key={friend.username}/>                                                
                ))
              }
            </div>
        )
    }
    
}   

export default Chatapp;