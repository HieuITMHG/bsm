import { NavLink } from "react-router-dom"
import '../styles/Home.css'
import ProfileOpen from './profileOpen';
import { useState, useEffect } from 'react';
import CreateComment from "./createComment";
import UpdateCollapse from "./updateCollapse";

const Post = (props) => {
    const [isLike, setIsLike] = useState(null);
    const [isLoading, setIsLoading] = useState(true)
    const [count, setCount] = useState(0)
    const [more, setMore] = useState(false)
    const [morec, setMorec] = useState(false)
    const access_token = localStorage.getItem("access_token");

    const handleMore = () => {
        setMore(!more)
    }

    
    const handleMorec = () => {
        setMorec(!morec)
      }

    useEffect(() => {
        const countLikes = () => {
            const is_liked = props.post.liker.includes(props.cuser.id)
            setIsLike(is_liked)
            setCount(props.post.liker.length)
            setIsLoading(false)
        }

        countLikes()
        
      }, []);

    const squares = document.querySelectorAll('.mediaContainer');
    squares.forEach(square => {
        const width = square.offsetWidth;
        square.style.height = width + 'px';
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
                {post_id : props.post.id}
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
                {post_id : props.post.id}
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

    

    useEffect(() => {
        props.setSignal(!props.signal)
    },[more])
    

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
            <div className="postsContainer" id={props.post.id}>
                {props.cuser.id === props.post.creater.id && <span className="material-symbols-outlined more" onClick={handleMore}>more_horiz</span>}
                
                {more && <UpdateCollapse post = {props.post} setMore = {setMore}/>}
                <div className="userInfo">
                    <ProfileOpen user = {props.post.creater}/>
                </div>
                
                <div className='displayCaption'>
                    {
                        props.post.caption.length < 125 ? (<NavLink to={`/post/${props.post.id}`}>{props.post.caption}</NavLink>) :
                        <>
                            {morec ?
                            <>
                                <NavLink to={`/post/${props.post.id}`}>{props.post.caption}</NavLink>
                                <p style={{color : 'gray',fontSize:'15px'}} onClick={handleMorec}>hide</p>
                            </> :
                            <>
                                <NavLink to={`/post/${props.post.id}`}>{props.post.caption.substring(0,125)}</NavLink>             
                                <p style={{color : 'gray', fontSize:'15px'}} onClick={handleMorec}>more</p>
                            </> 
                             }
                        </>
                    }
                </div>
                
                {props.post.media.length != 0 && 
                    (
                        <NavLink to={`/post/${props.post.id}`} className='mediaContainer'>
                        {
                            props.post.media.map(medi => (
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
                    <CreateComment post= {props.post} signal = {props.signal} setSignal = {props.setSignal}/>
                    <div style={{display : 'flex', alignItems : 'center', position : 'relative'}}>
                        <span style={{position:'absolute', left: '6px', top : '-2px' }}>{props.post.comments.length}</span>
                        <span className="material-symbols-outlined" style={{fontSize:'35px'}}>chat_bubble</span>
                    </div>
                    
                </div>
            </div>
        )
    }else {
        return (<div>Loading...</div>)
    }

}

export default Post;

