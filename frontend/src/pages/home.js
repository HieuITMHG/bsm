import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import CreatePost from '../components/createPost';
import Post from '../components/post';
import '../styles/Home.css'


const Home = () => {
    
    const [posts, setPosts] = useState([]);
    const [Loading, setLoading] = useState(true);
    const [signal, setSignal] = useState(false)
    
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
        console.log("jjjj")
        fet();
      },[signal]);

      if(Loading) {
        return (
            <div>Loading...</div>
        )
      }else {
        return (
            <div className='homeContainer'>
                <Navbar />
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

            </div>
        );
      }
    
};

export default Home;