import { useParams, useNavigate,} from "react-router-dom";
import { useEffect, useState } from "react";
import ProfileOpen from "../components/profileOpen";
import CreateComment from "../components/createComment";
import Post from "../components/post";
import '../styles/singlePost.css'

const SinglePost = () => {
    const { postid } = useParams();
    const [post, setPost] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const [isLike, setIsLike] = useState(null);
    const [count, setCount] = useState(0)
    const access_token = localStorage.getItem("access_token");
    const [signal, setSignal] = useState(false)

    useEffect(() => {
        Promise.all([
            fetch(`/api/post/${postid}`)
                .then(response => response.json()),
            fetch("http://127.0.0.1:8000/api/user/", {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            })
                .then(response => response.json())
        ])
        .then(([postResponse, userResponse]) => {
            setPost(postResponse);
            const is_liked = postResponse.liker.includes(userResponse.id)
            setIsLike(is_liked);
            setCount(postResponse.liker.length)
            setIsLoading(false)
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }, [postid, access_token, signal]);


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

    if (isLoading) {
        
        return <div>Loading...</div>;
    } else {
        console.log(post)
        return (
            
            <div className="singlePostContainer">

                <div className="pictureContainer">
                        <span className="material-symbols-outlined xi" onClick={() => navigate(-1)}>close</span>
                            {post.media.length !== 0 ? (
                            post.media[0].file.endsWith('.mp4') || post.media[0].file.endsWith('.webm') || post.media[0].file.endsWith('mov') ? (
                            <video src={post.media[0].file} controls alt='video' className="picture" />
                            ) : (
                            <img src={post.media[0].file} alt='image' className="picture" />)
                            ) : (<div className="captionhehe"><h1>{post.caption}</h1></div>)}
</div>
                    
                
                <div className="commentSide">
                    <div className="scrollable">
                    <div className="postInfo">
                        <ProfileOpen user = {post.creater}/>
                        <div className="displayCaption">{post.caption}</div>
                        <div className="interactSection">
                            {isLike !== null && (
                                <div className="love" onClick={isLike ? handleUnlike : handleLike} ><span className="material-symbols-outlined" style={isLike ? style1 : style2} >favorite</span></div>
                            )} 
                            <div>{count}</div>
                            <CreateComment post = {post} signal = {signal} setSignal = {setSignal}/>
                        </div>
                    </div>

                 <div className="commentView">
                        {post.comments.map(comment => (
                            <Post post={comment} key={comment.id} signal = {signal} setSignal = {setSignal}/>
                        ))}
                </div>
              
                </div>
            </div>
                
        </div>
        );
    }
};

export default SinglePost;



