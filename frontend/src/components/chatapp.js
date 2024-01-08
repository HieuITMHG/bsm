import { useEffect, useState,useRef } from "react";
import ChatBox from "./chatbox";

const Chatapp = (props) => {
    console.log("render chat app")
    const [isLoading, setIsLoading] = useState(true)
    const [groups, setGroups] = useState([])
    const [message, setMessage] = useState({})
    const [onlines, setOnlines] = useState([])
    const [deletedMessages, setDeletedMessages] = useState([])
      
    useEffect(() => {
      const socket = props.socket;

      const handleMessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "chat_message") {
            setMessage(data.content)
            console.log(data.content)
        }else if (data.type === "online_status") {
          console.log(`online_status of ${data.onliner_id}: ${data.online_status}`)
            if (data.online_status == true){
              setOnlines(preOnlines => [...preOnlines, data.onliner_id])
            }else{
              const updatedItems = onlines.filter(item => item !== data.onliner_id);
              setOnlines(updatedItems)
            }
            
        }else if(data.type  === "delete") {
          setDeletedMessages(predele => [...predele, data.message_id])
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
            })
            .catch((error) => console.error("Error:", error));

            props.cuser.friends.map(friend => {
              if(friend.online_status == true) {
                  setOnlines(preOnlines => [...preOnlines, friend.id])
              }
            })

            setIsLoading(false)
          }
      }, []);

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
                      <ChatBox sender = {props.cuser} receiver={group.participants[0]} socket = {props.socket} group = {group} mes = {message} onlines = {onlines} deletedMessages = {deletedMessages}/>:
                      <ChatBox sender = {props.cuser} receiver={group.participants[1]} socket = {props.socket} group = {group} mes = {message} onlines = {onlines} deletedMessages = {deletedMessages}/>
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