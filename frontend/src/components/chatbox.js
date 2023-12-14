import React, { useState, useEffect } from 'react';
import ProfileOpen from './profileOpen';
import Message from './message';
import { json } from 'react-router-dom';

function ChatBox(props) {
  const [message, setMessage] = useState('');
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] =  useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [di, setDi] = useState(false)
  const [isSend, setIsSend] = useState(false)

  let socket = new WebSocket(`ws://localhost:8000/ws/chat/${props.sender.id}/${props.receiver.id}/`);

  const handleInputChange = (e) => {
    const val = e.target.value;
    console.log(val)
    if(val.length != 0) {
      if(!isSend) {
        socket.send(JSON.stringify({type : 'update', typing_status: true, who : props.sender.id}));
        setIsSend(true)
      }
      
    }else {
      socket.send(JSON.stringify({type : 'update', typing_status: false, who: props.sender.id }))
      setIsSend(false)
    }
    
  }

  useEffect(() => {
    socket.onopen = () => {
      console.log('WebSocket connected');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data)
      if(data.type == "update") {
        if((data.typing_status == true) && (data.who == props.receiver.id)) {
            setDi(true)        
        }else if ((data.typing_status == false) && (data.who == props.receiver.id)) {
            setDi(false)                
        }
      }
      else if(data.type == "chat_message") {
        setReceivedMessages(prevMessages => [...prevMessages, data.content]);
      }
      

    };

    return () => {
      socket.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const access_token = localStorage.getItem("access_token");

    if (access_token) {
      fetch(`/chat/messages/${props.receiver.id}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setMessages(data);
          setIsLoading(false)
        })
        .catch((error) => console.error("Error:", error));
    }
  }, []);

  const sendMessage = () => {
    const data = {
      content: message,
      type: 'chat_message'
    };
    socket.send(JSON.stringify(data));
    setMessage('');
  };

  const handleOpen = () => {
    setIsOpen(!isOpen)
  }

  if(!isLoading) {
    
    return (
      <>
        {isOpen ? (
        <div className='chatBoxContainer'>
          {/* headfer */}
          <div className='headerChat'>
            <span className="material-symbols-outlined" onClick={handleOpen}>arrow_back_ios</span>
            <ProfileOpen user = {props.receiver}/>
          </div>
          {/* end header */}
  
          {/* message area */}
          {/* end message area */}
              <div className='messageFieldContainer'>
                  {messages.map(mes => (
                    <Message message = {mes} key={`m_${mes.id}`} user = {props.sender}/>
                  ))}
                  {receivedMessages.map(mes => (
                    <Message message = {mes} key={`m_${mes.id}`} user = {props.sender}/>
                  ))}
                  {di && <div className='typing_indicator'>ooo</div> }
              </div>
          {/* enter message */}
          <div className='sendMessageContainer'>
            <span className="material-symbols-outlined">attach_file</span>
            <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} className='message_input' onInput={handleInputChange}/>         
            <button onClick={sendMessage} style={{ display: 'none' }} id='sendMessageBtn'>Send</button>
            <label htmlFor='sendMessageBtn' style={{display: 'flex', alignItems:'center', cursor:'pointer'}}>
              <span className="material-symbols-outlined">send</span>
            </label>
          </div>
          {/* end enter message */}
        </div>
        ) : (
          
        <div className='receiverContainer' onClick={handleOpen}>
  
          <div className="avatarContainer">
              <img src={props.receiver.avatar.file} alt="avatar" className="avatar"/>
          </div>
  
          <div className='nameames'>
            <div className='name'><strong>{props.receiver.username}</strong></div>
            <div className='lastMes'  style={{color:'gray'}}>{(messages.length != 0) ? messages[messages.length-1].content : ""}</div>
          </div>
  
        </div>  
        )}
      </>
      
    );
  }
  
}

export default ChatBox;

