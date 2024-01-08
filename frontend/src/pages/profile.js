import Navbar from "../components/Navbar";
import UserInfo from "../components/userInfo";
import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Post from "../components/post";
import Chatapp from "../components/chatapp";


const Profile = (props) => {
    const {userid} = useParams();
    const [posts, setPosts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [signal, setSignal] = useState(false)
    const cuserRef = useRef({})

    useEffect(() => {
        fetch(`/api/ppost/${userid}`)
        .then(response => response.json())
        .then(data => {
            setPosts(data);
        })
        .catch(error => console.error('Error:', error));


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
            setIsLoading(false);
          })
          .catch((error) => console.error("Error:", error));
    }
        
    },[userid, signal])

    if(isLoading) {
        return (
            <div>Loading...</div>
        )
    }else {
        return (
            <>
                <Navbar socket = {props.socket}/>
                {!isLoading && 
                    <div className='mainView'>    
                        <UserInfo userid = {userid}/> 
                        <div className='postsView'>
                            <ul className="postList">
                                {posts.map(post => (
                                        <Post post={post} key={post.id} setSignal = {setSignal} signal = {signal} cuser = {cuserRef.current}/>
                                ))}
                            </ul>
                        </div> 
                    </div>
                }
                <Chatapp socket={props.socket} cuser = {cuserRef.current}/>
            </>
        )
    }

    
}

export default Profile;