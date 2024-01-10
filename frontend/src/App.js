import React, { useEffect, useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import LoginView from './pages/loginAndregisterView';
import Home from './pages/home';
import People from './pages/peopleView';
import Profile from './pages/profile';
import SinglePost from './pages/singlePost';
import FollowingPosts from './pages/followingPosts';
import UploadAvatar from './components/uploadAvatar';
import 'bootstrap/dist/css/bootstrap.min.css';
import FollowingsView from './pages/followingsView';
import FollowersView from './pages/followersView';
import MyComponent from './components/lkalfk';

<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />

function App() {
  const navigate = useNavigate();
  const socketRef = useRef(null)
  const [trigger, setTrigger] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const checkTokenValidity = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
      try {
          const refreshResponse = await fetch('/api/token/refresh/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${refreshToken}`
            },
            body: JSON.stringify({ refresh: refreshToken })
          });

          if (refreshResponse.ok) {
            console.log("new access token");
            const newData = await refreshResponse.json();
            localStorage.setItem('access_token', newData.access);
            
          } else {
            navigate('/login');
          }
      } catch (error) {
        console.error('Error:', error);
      }

};

const websocketconnect = () => {
  // Kiểm tra nếu WebSocket chưa được khởi tạo
  console.log("execute websocket")
  const access_token = localStorage.getItem('access_token')

    const newSocket = new WebSocket(`ws://localhost:8000/ws/chat/?token=${encodeURIComponent(access_token)}`);
    
    newSocket.onopen = () => {
      console.log(`WebSocket connected`);
    };

    newSocket.onclose = () => {
      console.log("disconnected")
    }
    socketRef.current = newSocket

  return () => {
    if (socketRef.current) {
      socketRef.current.close();
      console.log(`WebSocket disconnected`);
    }
  };
}

useEffect(() => {
  console.log(trigger);
  
  const fetchData = async () => {
    await checkTokenValidity();
    websocketconnect();
    setIsLoading(false);
    setInterval(checkTokenValidity, 780000);
  };

  fetchData();

  return () => {
    clearInterval(checkTokenValidity);
  };
}, [trigger]);

  if(isLoading) {
    return (
      <div>Loading...</div>
    )
  }
  else {
    return (
      <div className="App">
          <Routes>
            <Route path='/' element={<Home socket = {socketRef.current}/>} />
            <Route path="/login" element={<LoginView trigger = {trigger} setTrigger = {setTrigger}/>} />
            <Route path="/people" element={<People socket = {socketRef.current} />} />
            <Route path='/profile/:userid' element={<Profile socket = {socketRef.current}/>} />
            <Route path='/following' element={<FollowingPosts socket = {socketRef.current}/>} />
            <Route path='hehe' element={<UploadAvatar />} />
            <Route path='/post/:postid' element={<SinglePost />} />
            <Route path='/followings/:userid' element={<FollowingsView />} />
            <Route path='/followers/:userid' element = {<FollowersView />} />
            <Route path='/test/' element = {<MyComponent />} />
          </Routes>
      </div>
    );
  }
  
}

export default App;