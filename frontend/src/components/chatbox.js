import React, { useState, useEffect, useDebugValue } from 'react';
import ProfileOpen from './profileOpen';
import Message from './message';

function ChatBox(props) {
  const [message, setMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false)
  const [group, setGroup] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  const sendMessage = () => {
    const data = {
      receiver_id : props.receiver.id,
      content: message,
      type: 'chat_message'
    };
    props.socket.send(JSON.stringify(data));
    setMessage('');
    setIsOpen(true)
  };

  const handleOpen = () => {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    const access_token = localStorage.getItem("access_token")
    fetch(`/chat/singlegroupchat/${props.group.groupName}/`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`
      }
      })
      .then(respone => respone.json())
      .then(data => {
        setGroup(data)
        setIsLoading(false)
    })
  },[props.mes])

  const onlineStyle = {
    color : 'green'
  }

  if(isLoading) {
    return (
      <div>Loading...</div>
    )
  }else {
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
                  {group.messages.map(mes => (
                    <Message message = {mes} user = {props.sender} socket = {props.socket} key={`mv_${mes.id}`} />
                  ))}
              </div>
          {/* enter message */}
          <div className='sendMessageContainer'>
            <span className="material-symbols-outlined">attach_file</span>
            <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} className='message_input'/>         
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
          </div>

          <span className="material-symbols-outlined" style={props.onlines.includes(props.receiver.id) ? onlineStyle : null}>fiber_manual_record</span>

        </div>  
        )}
      </>
      
    );
  }}
  


export default ChatBox;

