import React, { useState, useEffect } from 'react';

function ChatBox(props) {
  const [message, setMessage] = useState('');
  const [receivedMessages, setReceivedMessages] = useState([]);

  let socket = new WebSocket(`ws://localhost:8000/ws/chat/${props.senderId}/${props.receiverId}/`);

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
    console.log(receivedMessages)
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
        <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatBox;