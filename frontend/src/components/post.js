import { NavLink } from "react-router-dom"
import '../styles/Home.css'
import ProfileOpen from './profileOpen';
import { useState, useEffect } from 'react';
import CreateComment from "./createComment";
import UpdateCollapse from "./updateCollapse";

const Post = ({post}) => {
    const [isLike, setIsLike] = useState(null);
    const [isLoading, setIsLoading] = useState(true)
    const [count, setCount] = useState(0)
    const [more, setMore] = useState(false)
    const access_token = localStorage.getItem("access_token");


    useEffect(() => {
        if (access_token) {
          fetch("http://127.0.0.1:8000/api/user/", {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          })
            .then((response) => response.json())
            .then((data) => {
                const is_liked = post.liker.includes(data.id)
                setIsLike(is_liked);
                setCount(post.liker.length)
                setIsLoading(false)
            })
            .catch((error) => console.error("Error:", error));
        }
        
      }, []);


      useEffect(() => {
        const squares = document.querySelectorAll('.postsContainer');
        squares.forEach(square => {
          const width = square.offsetWidth;
          console.log(width)
          square.style.height = width + 'px';
        });
      });


    const style1 = {
        color : 'red'
    }

    const style2 = {
        color : 'black'
    }

    const handleLike = (e) => {
        e.preventDefault();
        fetch("/api/like/", {
            method : "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_token}`,
            },
            body: JSON.stringify(
                {post_id : post.id}
            )
        })
        .then((response) => response.json())
        .then((data) => {
            setCount(data.liker.length)
            console.log(data)
            setIsLike(true)
        })
    }

    const handleUnlike = (e) => {
        e.preventDefault();
        fetch("/api/unlike/", {
            method : "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_token}`,
            },
            body: JSON.stringify(
                {post_id : post.id}
            )
        })
        .then((response) => response.json())
        .then((data) => {
            setCount(data.liker.length)
            console.log(data)
            setIsLike(false)
        })
    }

    // comment

    //update and delete

    const handleMore = () => {
        setMore(!more)
    }

    

    useEffect(() => {

          const handleMouseDown = (e) => {
            if (!e.target.classList.contains('updateItem')) {
              setMore(false);
            }
          };
    
          document.addEventListener('mousedown', handleMouseDown);
    
          return () => {
            document.removeEventListener('mousedown', handleMouseDown);
          };
        
      }, []);
	

    //end update and delete

    if(!isLoading) {
        return (
            <div className="postsContainer" id={post.id}>
                <span class="material-symbols-outlined more" onClick={handleMore}>more_horiz</span>
                {more && <UpdateCollapse post = {post}/>}
                <div className="userInfo">
                    <ProfileOpen user = {post.creater}/>
                </div>
                
                <NavLink className='displayCaption' to={`/post/${post.id}`}>
                    <div>{post.caption}</div>
                </NavLink>
                
                {post.media.length != 0 && 
                    (
                        <NavLink to={`/post/${post.id}`} className='mediaContainer'>
                        {
                            post.media.map(medi => (
                                <div key={`${medi.id}i`} className='mediaCraper'>
                                {medi.file.endsWith('.mp4') || medi.file.endsWith('.webm') || medi.file.endsWith('mov')? 
                                        <video src={medi.file} controls alt='video' className='media' />
                                        :
                                        <img src={medi.file} alt='image' className='media' />
                                    }
                                </div>         
                            ))
                        }
                </NavLink>
                    )
                }
                
                
    
                <div className="interactSection">
                    {isLike !== null && (
                        <div className="love" onClick={isLike ? handleUnlike : handleLike} ><span className="material-symbols-outlined" style={isLike ? style1 : style2} >favorite</span></div>
                    )} 
                    <div>{count}</div>
                    <CreateComment post= {post} />
                    <div style={{display : 'flex', alignItems : 'center', position : 'relative'}}>
                        <span style={{position:'absolute', left: '6px', top : '-2px' }}>{post.comments.length}</span>
                        <span class="material-symbols-outlined" style={{fontSize:'35px'}}>chat_bubble</span>
                    </div>
                    
                </div>
            </div>
        )
    }else {
        return (<div>Loading...</div>)
    }

}

export default Post;

