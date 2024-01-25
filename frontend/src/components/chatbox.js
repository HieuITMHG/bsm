import React, { useState, useEffect, useDebugValue } from 'react';
import ProfileOpen from './profileOpen';
import Message from './message';

function ChatBox(props) {
  const [message, setMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false)
  const [group, setGroup] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [media, setMedia] = useState([])

  const handleSendMessage = (e) => {
        e.preventDefault();

        const token = localStorage.getItem('access_token');
        const formdata = new FormData();

        // Add caption and media to the FormData
        media.forEach(file => {
            formdata.append('media', file);
        });

        formdata.append(`receiver_id`, props.receiver.id)
        formdata.append('content', message)

        fetch('http://localhost:8000/chat/message/', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formdata
        })
        .then(response => response.json())
        .then(data => {
            setMessage('');
            setIsOpen(true)
            setMedia([])
            const mes = document.querySelector('.caption')
            mes.textContent = ""
        })
        .catch(error => console.error('Error:', error));

  }

  // const sendMessage = () => {
  //   const data = {
  //     receiver_id : props.receiver.id,
  //     content: message,
  //     type: 'chat_message'
  //   };
  //   props.socket.send(JSON.stringify(data));
  //   setMessage('');
  //   setIsOpen(true)
  // };

  const handleOpen = () => {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    const access_token = localStorage.getItem("access_token")
    fetch(`http://localhost:8000/chat/singlegroupchat/${props.group.groupName}/`, {
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

  const handlemediachange = (e) => {
      const files = e.target.files
      const Arraymedia = Array.from(files)
      setMedia(Arraymedia)
  }

  const handleCancelMedia = (medi) => {
      const updatedItems = media.filter(item => item !== medi);
      setMedia(updatedItems)
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
            <span className="material-symbols-outlined" style={props.onlines.includes(props.receiver.id) ? onlineStyle : null}>fiber_manual_record</span>
          </div>
          {/* end header */}
  
          {/* message area */}
          {/* end message area */}
              <div className='messageFieldContainer'>
                  {group.messages.map(mes => (
                    <div key={`mv_${mes.id}`}>
                      {!props.deletedMessages.includes(mes.id) && <Message message = {mes} user = {props.sender} socket = {props.socket}  />}
                    </div>
                    
                  ))}
              </div>
          {/* enter message */}
          <div className='imgBoard'>
  {media.map((media, index) => (
    <div className='uuu'  key={`kdlkdj_${index}`}>
      <span className="material-symbols-outlined" onClick={() => handleCancelMedia(media)}>close</span>
      {media.type.startsWith('image/') ? (
        <img
          src={URL.createObjectURL(media)}
          alt={`selected-image-${index}`}
          style={{ maxWidth: '100px', maxHeight: '100px', margin: '5px' }}
        />
      ) : media.type.startsWith('video/') ? (
        <video
          src={URL.createObjectURL(media)}
          alt={`selected-video-${index}`}
          style={{ maxWidth: '100px', maxHeight: '100px', margin: '5px' }}
          controls
        />
      ) : (
        <p>Unsupported media type</p>
      )}
    </div>
  ))}
</div>
          <div className='sendMessageContainer'>
            <input id='message-media' style={{display : 'none'}} type='file' multiple onChange={handlemediachange} accept="image/*, video/*" />
            <label htmlFor='message-media' >
              <span className="material-symbols-outlined ttt">attach_file</span>
            </label>
            <span onInput={(e) => setMessage(e.target.textContent)} role="textbox" className="caption x" rows={1} contentEditable autoFocus></span>       
            
            {(media == [] && message == '') ?
              <>
                  <button style={{ display: 'none' }} id='sendMessageBtn'>Send</button>
                  <label htmlFor='sendMessageBtn' style={{display: 'flex', alignItems:'center', cursor:'pointer'}}>
                    <span className="material-symbols-outlined">send</span>
                  </label>
              </>
               :
               <>
                  <button onClick={handleSendMessage} style={{ display: 'none' }} id='sendMessageBtn'>Send</button>
                  <label htmlFor='sendMessageBtn' style={{display: 'flex', alignItems:'center', cursor:'pointer'}}>
                      <span className="material-symbols-outlined ttt">send</span>
                  </label>
               </>
            }
            
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

