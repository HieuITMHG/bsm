import { useEffect, useState } from "react";
import ChatBox from "./chatbox";

const Chatapp = (props) => {
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState({});
    const [friends, setFriends] = useState([])
    const [searchKey, setSearchKey] = useState("")
    const [filteredFriends, setFilteredFriends] = useState([])

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
              setUser(data)
              setFriends(data.friends)
              setFilteredFriends(data.friends)
              setLoading(false)
            })
            .catch((error) => console.error("Error:", error));
        }
      }, []);

      const handleChange = (e) => { 
        const searchTerm = e.target.value;

        setSearchKey(searchTerm)
    
        const filteredItems = friends.filter((friend) =>
          friend.username.toLowerCase().includes(searchTerm.toLowerCase())
        );
    
        setFilteredFriends(filteredItems);
      }
    

    if(loading) {
        return (
            <div>loading</div>
        )
    }else {
        return (
            <div className="chatAppContainer">

              <div className="searchFriend">

                <input onChange={handleChange}></input>
                <div className="searchBtn"><span className="material-symbols-outlined">search</span></div>
                
              </div>

              {
                filteredFriends.map(friend => (           
                  <ChatBox receiver = {friend} sender = {user} key={`chatbox_${friend.username}`} socket =  {props.socket} />                                                
                ))
              }
              <div className="message_input"></div>
            </div>
            
        )
    }
    
}   

export default Chatapp;