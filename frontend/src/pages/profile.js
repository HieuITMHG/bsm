import Navbar from "../components/Navbar";
import UserInfo from "../components/userInfo";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Post from "../components/post";
import Chatapp from "../components/chatapp";


const Profile = () => {
    const {userid} = useParams();
    const [posts, setPosts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [signal, setSignal] = useState(false)

    useEffect(() => {
        fetch(`/api/ppost/${userid}`)
        .then(response => response.json())
        .then(data => {
            setPosts(data);
        })
        .catch(error => console.error('Error:', error));
        setIsLoading(false);
    },[userid, signal])

    if(isLoading) {
        return (
            <div>Loading...</div>
        )
    }else {
        return (
            <>
                <Navbar />
                {!isLoading && 
                    <div className='mainView'>    
                        <UserInfo userid = {userid}/> 
                        <div className='postsView'>
                            <ul className="postList">
                                {posts.map(post => (
                                        <Post post={post} key={post.id} setSignal = {setSignal} signal = {signal}/>
                                ))}
                            </ul>
                        </div> 
                    </div>
                }
            </>
        )
    }

    
}

export default Profile;