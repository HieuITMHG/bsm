import React, { useState, useEffect } from 'react';
import ProfileOpen from './profileOpen';

function ChatBox(props) {
  const [message, setMessage] = useState('');
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false)


  let socket = new WebSocket(`ws://localhost:8000/ws/chat/${props.sender.id}/${props.receiver.id}/`);

  useEffect(() => {
    socket.onopen = () => {
      console.log('WebSocket connected');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data)
      const newMessage = { message: data.content, sender: data.sender, timestamp: data.timestamp };
      setReceivedMessages(prevMessages => [...prevMessages, newMessage]);
    };

    return () => {
      socket.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendMessage = () => {
    const data = {
      content: message,
    };
    socket.send(JSON.stringify(data));
    setMessage('');
  };

  const handleOpen = () => {
    setIsOpen(!isOpen)
  }

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

            </div>
        {/* enter message */}
        <div className='sendMessageContainer'>
          <span className="material-symbols-outlined">attach_file</span>
          <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />         
          <button onClick={sendMessage} style={{ display: 'none' }} id='sendMessageBtn'>Send</button>
          <label htmlFor='sendMessageBtn' style={{display: 'flex', alignItems:'center', cursor:'pointer'}}>
            <span class="material-symbols-outlined">send</span>
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
          <div className='lastMes'>this is the latest message...</div>
        </div>

      </div>  
      )}
    </>
    
  );
}

export default ChatBox;