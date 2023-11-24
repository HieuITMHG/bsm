import { useActionData } from "react-router-dom"
import Navbar from "../components/Navbar"
import Post from "../components/post"
import { useState, useEffect } from "react"
import '../styles/Home.css'

const FollowingPosts = () => {
    const accessToken = localStorage.getItem('access_token');
    const [posts, setPosts] = useState([])

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
    }, [])

    return (
        <div>
            <Navbar />
            <div className="mainView">
            
            <div className='postsView'>
                <ul className="postList">
                    {posts.map(post => (
                            <Post post={post} key={post.id}/>
                    ))}
                </ul>
            </div>
            </div>
        </div> 
    )
}

export default FollowingPosts;