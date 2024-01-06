import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import CreatePost from '../components/createPost';
import Post from '../components/post';
import '../styles/Home.css'
import Chatapp from '../components/chatapp';
import { BrowserRouter, useNavigate } from 'react-router-dom';


const Home = () => {
    
    const [posts, setPosts] = useState([]);
    const [Loading, setLoading] = useState(true);
    const [signal, setSignal] = useState(false);
    const [socket, setSocket] = useState(null)

     
  const navigate = useNavigate();
 
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


  useEffect(() => {
    checkTokenValidity();
    setInterval(checkTokenValidity, 780000);

    return () => {
        clearInterval(checkTokenValidity);
    }
  },[])

    useEffect(() => {
        // Kiểm tra nếu WebSocket chưa được khởi tạo
        const access_token = localStorage.getItem('access_token')
        if (!socket) {
          const newSocket = new WebSocket(`ws://localhost:8000/ws/chat/?token=${encodeURIComponent(access_token)}`);
          
          newSocket.onopen = () => {
            console.log(`WebSocket connected`);
          };

          newSocket.onclose = () => {
            console.log("disconnected")
          }
          setSocket(newSocket); 
        }
    
        return () => {
          if (socket) {
            socket.close();
            console.log(`WebSocket disconnected`);
          }
        };
      }, []);
    
    useEffect(() => {
        const fet = () => {
            fetch('/api/posts/')
            .then(response => response.json())
            .then(data => {
                setPosts(data);
                setLoading(false);
            })
            .catch(error => console.error('Error:', error));
        }   
        fet();
      },[signal]);

      if(Loading) {
        return (
            <div className="spinner-border"></div>
        )
      }else {
        return (
            <div className='homeContainer'>
                <Navbar socket = {socket}/>

                <div className='mainView'>     
                    <CreatePost posts = {posts} setPosts = {setPosts}/>

                    <div className='postsView'>
                        <ul className="postList">
                            {posts.map(post => (
                                    <Post post={post} key={post.id} setSignal = {setSignal} signal = {signal}/>
                            ))}
                        </ul>
                    </div> 

                    
                </div>

                <Chatapp socket={socket} />

            </div>
        );
      }
    
};

export default Home;