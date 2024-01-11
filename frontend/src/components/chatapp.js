import { useEffect, useState,useRef } from "react";
import ChatBox from "./chatbox";

const Chatapp = (props) => {
    const [isLoading, setIsLoading] = useState(true)
    const [groups, setGroups] = useState([])
    const [message, setMessage] = useState({})
    const [onlines, setOnlines] = useState([])
    const [deletedMessages, setDeletedMessages] = useState([])
    const [filteredGroups, setFilteredGroups] = useState([])

    useEffect(() => {
      const socket = props.socket;

      const handleMessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("chat app received")
        if (data.type === "chat_message") {
            setMessage(data.content)
            console.log(data.content)
        }else if (data.type === "online_status") {
            if (data.online_status == true){
              setOnlines(preOnlines => [...preOnlines, data.onliner_id])
            }else{
              const updatedItems = onlines.filter(item => item !== data.onliner_id);
              setOnlines(updatedItems)
            }
            
        }else if(data.type  === "delete") {
          setDeletedMessages(predele => [...predele, data.message_id])
        }
        else if (data.type === "notification"){
          console.log(data)
          if(data.notification.sender.id != props.cuser.id) {
            props.setReNo(!props.reNo)
              alert = document.querySelector('.notification-alert')
              alert.style.display='flex'
              alert.innerText = data.notification.content
              setTimeout(() => {
                alert.style.display = 'none'
              }, 2000);
          }
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
              setFilteredGroups(data)
              console.log(data)
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

      const handleChange = (e) => { 
        const searchTerm = e.target.value;

        if(searchTerm == ""){
          setFilteredGroups(groups)
          return;
        }
    
        const filteredItems = groups.filter((group) => {
          let friend = {};
          if(group.participants[0].id != props.cuser.id) {
            friend = group.participants[0]
          }else {
            friend = group.participants[1]
          }

          return friend.username.toLowerCase().includes(searchTerm.toLowerCase())
        }
          
        );

        console.log(filteredItems)
    
        setFilteredGroups(filteredItems);
      }

    if(isLoading) {
        return (
            <div>loading</div>
        )
    }else {
        return (
            <div className="chatAppContainer">
              <div className="notification-alert"  style={{display:'none'}}></div>

              <div className="searchFriend">

                <input onChange={handleChange}></input>
                <div className="searchBtn"><span className="material-symbols-outlined">search</span></div>
                
              </div>

              {
                filteredGroups.map(group => (
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