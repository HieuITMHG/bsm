import React, { useEffect, useState, useRef} from 'react';
import Navbar from '../components/Navbar';
import CreatePost from '../components/createPost';
import Post from '../components/post';
import '../styles/Home.css'
import Chatapp from '../components/chatapp';
import { BrowserRouter, useNavigate } from 'react-router-dom';


const Home = () => {

    const [posts, setPosts] = useState([]);
    const loadingRef = useRef(true)
    const cuserRef = useRef({})
    const [signal, setSignal] = useState(false);
    const socketRef = useRef(null)

     
  const navigate = useNavigate();

  const getUser = () => {
      const access_token = localStorage.getItem("access_token");
        
      if (access_token) {
        fetch("/api/user/", {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            cuserRef.current = data
          })
          .catch((error) => console.error("Error:", error));
    }
  }
 
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
    websocketconnect();
    getUser();
    setInterval(checkTokenValidity, 780000);

    return () => {
        clearInterval(checkTokenValidity);
    }
  },[])

   const websocketconnect = () => {
        // Kiểm tra nếu WebSocket chưa được khởi tạo
        const access_token = localStorage.getItem('access_token')
        if (!socketRef.current) {
          const newSocket = new WebSocket(`ws://localhost:8000/ws/chat/?token=${encodeURIComponent(access_token)}`);
          
          newSocket.onopen = () => {
            console.log(`WebSocket connected`);
          };

          newSocket.onclose = () => {
            console.log("disconnected")
          }
          socketRef.current = newSocket
        }
    
        return () => {
          if (socketRef.current) {
            socketRef.current.close();
            console.log(`WebSocket disconnected`);
          }
        };
      }
    
    useEffect(() => {
        const fet = () => {
            fetch('/api/posts/')
            .then(response => response.json())
            .then(data => {
                setPosts(data);
            })
            .catch(error => console.error('Error:', error));
        }   
        fet();
        
        loadingRef.current = false
      },[signal]);

      if(loadingRef.current) {
        return (
            <div className="spinner-border"></div>
        )
      }else {
        return (
            <div className='homeContainer'>
                <Navbar socket = {socketRef.current}/>

                <div className='mainView'>     
                    <CreatePost posts = {posts} setPosts = {setPosts}/>

                    <div className='postsView'>
                        <ul className="postList">
                            {posts.map(post => (
                                    <Post post={post} key={post.id} setSignal = {setSignal} signal = {signal} cuser = {cuserRef.current}/>
                            ))}
                        </ul>
                    </div> 

                    
                </div>

                <Chatapp socket={socketRef.current} cuser = {cuserRef.current}/>

            </div>
        );
      }
    
};

export default Home;