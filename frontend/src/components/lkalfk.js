import React, { useState } from 'react';

function MyComponent() {
  const handleChange = (e) => {
    console.log("run");
}


  return (
    <div>
     <span onInput={handleChange} role="textbox" className="caption updateItem" rows={1} contentEditable autoFocus></span>
    </div>
  );
}

export default MyComponent;


  // useEffect(() => {
  //   // Kiểm tra nếu WebSocket chưa được khởi tạo
  //   if (!socket) {
  //     let newSocket = new WebSocket(`ws://localhost:8000/ws/chat/${props.sender.id}/${props.receiver.id}/`);
      
  //     newSocket.onopen = () => {
  //       console.log(`WebSocket connected: ${props.receiver.id}`);
  //     };

  //     newSocket.onmessage = (event) => {
  //       const data = JSON.parse(event.data);
  //       if(data.type == "update") {
  //         if((data.typing_status == true) && (data.who == props.receiver.id)) {
  //             setDi(true)        
  //         }else if ((data.typing_status == false) && (data.who == props.receiver.id)) {
  //             setDi(false)                
  //         }
  //       }
  //       else if(data.type == "chat_message") {
  //         setReceivedMessages(prevMessages => [...prevMessages, data.content]);
  //         setDi(false);
  //       }else if(data.type == "online_status") {
  //         if(data.online_status == true && data.onliner_id == props.receiver.id) {
  //             setIsOnline(true);
  //         }else if(data.online_status ==false && data.onliner_id == props.receiver.id) {
  //             setIsOnline(false)
  //         }
  //       }else if (data.type == "delete") {
  //           setDeletedMessages(prevDeletedMessages => [...prevDeletedMessages, data.message_id])
  //       }
  //   }

  //     setSocket(newSocket); // Lưu WebSocket vào state
  //   }

  //   return () => {
  //     if (socket) {
  //       socket.close();
  //       console.log(`WebSocket disconnected: ${props.receiver.id}`);
  //     }
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [socket, props.sender.id, props.receiver.id]);
  
  
  // const handleInputChange = (e) => {

  //   const val = e.target.value;
  //   if(val.length != 0) {
  //     if(!isSend) {
  //       console.log("on");
  //       socket.send(JSON.stringify({type : 'update', typing_status: true, who : props.sender.id}));
  //       setIsSend(true) 
  //     } 
  //   }else {
  //       console.log("off");
  //       socket.send(JSON.stringify({type : 'update', typing_status: false, who: props.sender.id }))
  //       setIsSend(false)
      
  //   }
    
  // }













  // import { useEffect, useState,useRef } from "react";
// import ChatBox from "./chatbox";

// const Chatapp = (props) => {

//     const loadingRef = useRef(true)
//     const userRef = useRef({})
//     const friendsRef =  useRef([])
//     const [message, setMessage] = useState({})
//     const [filteredFriends, setFilteredFriends] = useState([])

      
//     useEffect(() => {
//       const socket = props.socket;
      
//       const handleMessage = (event) => {
//         const data = JSON.parse(event.data);
//         if (data.type === "chat_message") {
//             console.log(data)
//             setMessage(data.content)
//         }
//       };
    
//       socket.onmessage = handleMessage;
    
//       return () => {
//         // Clean up the event listener when the component unmounts or when socket changes
//         socket.onmessage = null;
//       };
//     }, []);

//     useEffect(() => {
//         const access_token = localStorage.getItem("access_token");
    
//         if (access_token) {
//           fetch("/api/user/", {
//             headers: {
//               Authorization: `Bearer ${access_token}`,
//             },
//           })
//             .then((response) => response.json())
//             .then((data) => {
//               userRef.current = data
//               friendsRef.current = data.friends
//               setFilteredFriends(data.friends)
//               loadingRef.current = false
//             })
//             .catch((error) => console.error("Error:", error));
//         }
//       }, []);

      // const handleChange = (e) => { 
      //   const searchTerm = e.target.value;
    
      //   const filteredItems = friendsRef.current.filter((friend) =>
      //     friend.username.toLowerCase().includes(searchTerm.toLowerCase())
      //   );
    
      //   setFilteredFriends(filteredItems);
      // }
    

//     if(loadingRef.current) {
//         return (
//             <div>loading</div>
//         )
//     }else {
//         return (
//             <div className="chatAppContainer">

//               <div className="searchFriend">

//                 <input onChange={handleChange}></input>
//                 <div className="searchBtn"><span className="material-symbols-outlined">search</span></div>
                
//               </div>

//               {
//                 filteredFriends.map(friend => (           
//                   <ChatBox receiver = {friend} sender = {userRef.current} key={`chatbox_${friend.username}`} socket =  {props.socket} />                                                
//                 ))
//               }
//               <div className="message_input"></div>
//             </div>
            
//         )
//     }
    
// }   

// export default Chatapp;


















// import React, { useState, useEffect } from 'react';
// import ProfileOpen from './profileOpen';
// import Message from './message';

// function ChatBox(props) {
//   const [message, setMessage] = useState('');
//   const [receivedMessages, setReceivedMessages] = useState([]);
//   const [isOpen, setIsOpen] = useState(false)
//   const [messages, setMessages] =  useState([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [di, setDi] = useState(false)
//   const [isSend, setIsSend] = useState(false)
//   const [socket, setSocket] = useState(null);
//   const [isOnline, setIsOnline] = useState(props.receiver.online_status)
//   const [deletedMessages, setDeletedMessages] = useState([])

//   const sendMessage = () => {
//     const data = {
//       receiver_id : props.receiver.id,
//       content: message,
//       type: 'chat_message'
//     };
//     props.socket.send(JSON.stringify(data));
//     setMessage('');
//     setIsOpen(true)
//   };

//   const handleOpen = () => {
//     setIsOpen(!isOpen)
//   }


//   if(!isLoading) {
    
//     return (
//       <>
//         {isOpen ? (
//         <div className='chatBoxContainer'>
//           {/* headfer */}
//           <div className='headerChat'>
//             <span className="material-symbols-outlined" onClick={handleOpen}>arrow_back_ios</span>
//             <ProfileOpen user = {props.receiver}/>
//           </div>
//           {/* end header */}
  
//           {/* message area */}
//           {/* end message area */}
//               <div className='messageFieldContainer'>
//                   {props.group.messages.map(mes => {
//                     <Message message = {mes} user = {props.sender} socket = {props.socket} key={`mv_${mes.id}`}/>
//                   })}
//               </div>
//           {/* enter message */}
//           <div className='sendMessageContainer'>
//             <span className="material-symbols-outlined">attach_file</span>
//             <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} className='message_input'/>         
//             <button onClick={sendMessage} style={{ display: 'none' }} id='sendMessageBtn'>Send</button>
//             <label htmlFor='sendMessageBtn' style={{display: 'flex', alignItems:'center', cursor:'pointer'}}>
//               <span className="material-symbols-outlined">send</span>
//             </label>
//           </div>
//           {/* end enter message */}
//         </div>
//         ) : (
          
//         <div className='receiverContainer' onClick={handleOpen}>
  
//           <div className="avatarContainer">
//               <img src={props.receiver.avatar.file} alt="avatar" className="avatar"/>
//           </div>
  
//           <div className='nameames'>
//             <div className='name'><strong>{props.receiver.username}</strong></div>
//           </div>
//         </div>  
//         )}
//       </>
      
//     );
//   }
  
// }

// export default ChatBox;

