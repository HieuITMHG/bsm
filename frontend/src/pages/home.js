import React, { useEffect, useState, useRef} from 'react';
import Navbar from '../components/Navbar';
import CreatePost from '../components/createPost';
import Post from '../components/post';
import '../styles/Home.css'
import Chatapp from '../components/chatapp';
import { BrowserRouter, useNavigate } from 'react-router-dom';


const Home = (props) => {
    const [posts, setPosts] = useState([]);
    const loadingRef = useRef(true)
    const cuserRef = useRef({})
    const [signal, setSignal] = useState(false);
    const [reNo, setReNo] = useState(false)


    // useEffect(() => {
    //   const socket = props.socket;

    //   const handleMessage = (event) => {
    //     const data = JSON.parse(event.data);
    //     console.log("ok!!")
    //     if (data.type == "notification") {
    //         console.log("khung dien")
    //         console.log(data)
    //     }
    //   };
    
    //   socket.onmessage = handleMessage;
    
    //   return () => {
    //     // Clean up the event listener when the component unmounts or when socket changes
    //     socket.onmessage = null;
    //   };
    // }, []);

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


  useEffect(() => {
    getUser();
  },[])

  useEffect(() => {
      console.log("it changed")
  }, [reNo])

  
    
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
                <Navbar socket = {props.socket} reNo = {reNo} />

                <div className='mainView'>     
                    <CreatePost posts = {posts} setPosts = {setPosts} socket = {props.socket}/>

                    <div className='postsView'>
                        <ul className="postList">
                            {posts.map(post => (
                                    <Post post={post} key={post.id} setSignal = {setSignal} signal = {signal} cuser = {cuserRef.current} socket = {props.socket}/>
                            ))}
                        </ul>
                    </div> 

                    
                </div>

                <Chatapp socket={props.socket} cuser = {cuserRef.current} reNo = {reNo} setReNo = {setReNo}/>

            </div>
        );
      }
    
};

export default Home;