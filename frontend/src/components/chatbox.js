import React, { useState, useEffect } from 'react';

function ChatBox(props) {
  const [message, setMessage] = useState('');
  const [receivedMessages, setReceivedMessages] = useState([]);

  let a,b;

  if(Number(props.receiverId) < Number(props.senderId) ) {
    a = props.receiverId;
    b = props.senderId;
    console.log(`${a} : ${b}`)
  }else {
    a = props.senderId;
    b = props.receiverId;
    console.log(`${a} : ${b}`)
  }


  let socket = new WebSocket(`ws://localhost:8000/ws/chat/${a}/${b}/`);

  useEffect(() => {
    socket.onopen = () => {
      console.log('WebSocket connected');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data)
      const newMessage = { message: data.content, sender: data.sender, timestamp: data.timestamp };
      setReceivedMessages(prevMessages => [...prevMessages, newMessage]);
      const te = document.querySelector('.vcl');
      te.value += data.content + "\n";
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

  return (
    <div>
      <div>
        {receivedMessages.map((msg, index) => (
          <div key={index}>
            <p>{msg.sender}: {msg.message}</p>
          </div>
        ))}
      </div>
      <div>
        <textarea className="vcl"/>
        <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatBox;