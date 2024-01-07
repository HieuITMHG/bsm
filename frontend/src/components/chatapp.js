import { useEffect, useState,useRef } from "react";
import ChatBox from "./chatbox";

const Chatapp = (props) => {
    console.log("render chat app")
    const [isLoading, setIsLoading] = useState(true)
    const [groups, setGroups] = useState([])
    const [message, setMessage] = useState({})
    const [onlines, setOnlines] = useState([])
      
    useEffect(() => {
      const socket = props.socket;
      
      const handleMessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "chat_message") {
            setMessage(data.content)
            console.log(data.content)
        }else if (data.type === "online_status") {
            setOnlines(preOnlines => [...preOnlines, data.onliner_id])
        }
      };
    
      socket.onmessage = handleMessage;
    
      return () => {
        // Clean up the event listener when the component unmounts or when socket changes
        socket.onmessage = null;
      };
    }, []);

    useEffect(() => {
        const access_token = localStorage.getItem("access_token");
    
        if (access_token) {
          fetch("/chat/groupchats/", {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          })
            .then((response) => response.json())
            .then((data) => {
              setGroups(data)
              setIsLoading(false)
            })
            .catch((error) => console.error("Error:", error));
        }
      }, []);

      useEffect(()=> {
          console.log(groups)
      },[groups])

    if(isLoading) {
        return (
            <div>loading</div>
        )
    }else {
        return (
            <div className="chatAppContainer">

              <div className="searchFriend">

                <input></input>
                <div className="searchBtn"><span className="material-symbols-outlined">search</span></div>
                
              </div>

              {
                groups.map(group => (
                  <div key={`chatbox_${group.id}`} >
                    {props.cuser.id != group.participants[0].id ? 
                      <ChatBox sender = {props.cuser} receiver={group.participants[0]} socket = {props.socket} group = {group} mes = {message} onlines = {onlines}/>:
                      <ChatBox sender = {props.cuser} receiver={group.participants[1]} socket = {props.socket} group = {group} mes = {message} onlines = {onlines}/>
                    }
                  </div>
                                                                
                ))
              }
              <div className="message_input"></div>
            </div>
            
        )
    }
    
}   

export default Chatapp;