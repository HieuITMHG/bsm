import Navbar from "../components/Navbar"
import Post from "../components/post"
import { useState, useEffect, useRef } from "react"
import Chatapp from "../components/chatapp"
import '../styles/Home.css'

const FollowingPosts = (props) => {
    const accessToken = localStorage.getItem('access_token');
    const [posts, setPosts] = useState([])
    const [signal, setSignal] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const cuserRef = useRef({})
    const [reNo, setReNo] = useState([])

    useEffect(() => {
        fetch('/api/following/', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
        .then(response => response.json())
        .then(data => {
            setPosts(data)
        })
        .catch(error => console.error('Error:', error));
    }, [signal])

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
              setIsLoading(false)
            })
            .catch((error) => console.error("Error:", error));
      }
    }

    useEffect(()=> {
        getUser()
        
    },[])
    if(isLoading) {
        return (
            <div>Loading...
</div>
        )
    }else {
    return (
        <div>
            <Navbar socket = {props.socket}/>
            <div className="mainView">
            
                <div className='postsView'>
                    <ul className="postList">
                        {posts.map(post => (
                            <Post post={post} key={post.id} setSignal = {setSignal} signal = {signal} socket= {props.socket} cuser = {cuserRef.current}/>
                        ))}
                    </ul>
                </div>

            </div>
            <Chatapp socket={props.socket} cuser = {cuserRef.current} reNo = {reNo} setReNo = {setReNo}/>
        </div> 
    )}
}

export default FollowingPosts;