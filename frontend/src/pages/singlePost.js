import { useParams, useNavigate,} from "react-router-dom";
import { useEffect, useState } from "react";
import ProfileOpen from "../components/profileOpen";
import CreateComment from "../components/createComment";
import Post from "../components/post";
import '../styles/singlePost.css'

const SinglePost = (props) => {
    const { postid } = useParams();
    const [post, setPost] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const [isLike, setIsLike] = useState(null);
    const [count, setCount] = useState(0)
    const access_token = localStorage.getItem("access_token");
    const [signal, setSignal] = useState(false)
    var [index, setIndex] = useState(0);
    const [notFound, setNotFound] = useState(false)
    const [user, setUser] = useState({})

    const getData = () => {
        Promise.all([
            fetch(`/api/post/${postid}`).then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch post: ${response.status}`);
                }
                return response.json();
            }),
            fetch("http://127.0.0.1:8000/api/user/", {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            }).then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch user: ${response.status}`);
                }
                return response.json();
            })
        ])
        .then(([postResponse, userResponse]) => {
            setPost(postResponse);
            setUser(userResponse)
            const is_liked = postResponse.liker.includes(userResponse.id)
            setIsLike(is_liked);
            setCount(postResponse.liker.length)
            setIsLoading(false)
            console.log("render")
        })
        .catch(error => {
            if (error.message.includes('404')) {
                setNotFound(true);
                setIsLoading(false)
                console.log("not found");
            }
        });
    }

    useEffect(() => {
        const intervalId = setInterval(getData, 3000);
    
        return () => {
            clearInterval(intervalId);
        };
    }, []);

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

    const handleNext = () => {
        console.log(index)
        if(index == post.media.length-1) {
            setIndex(0)
            console.log("lên đầu")
        }else {
            let a = index+1;
            setIndex(a)
            console.log("next")
        }
    }

    const handleBack = () => {
        console.log(index)
        if(index == 0) {
            setIndex(post.media.length-1)
            console.log("về cuối")
        }else {
            let a = index-1;
            setIndex(a)
            console.log("back")
        }
    }

    if (isLoading) {
        return <p>Loading...</p>;
    }
    else if (notFound) {
        return <h1>Post not found</h1>;
    }
    else {
    return (
    
        <div className="singlePostContainer">
            <span className="material-symbols-outlined arrow" onClick={handleBack} >arrow_left</span>
            <div className="pictureContainer">
                    <span className="material-symbols-outlined xi" onClick={() => {navigate(-1)}}>close</span>
                        {post.media.length !== 0 ? (
                        post.media[0].file.endsWith('.mp4') || post.media[0].file.endsWith('.webm') || post.media[0].file.endsWith('mov') ? (
                        <video src={post.media[index].file} controls alt='video' className="picture" />
                        ) : (
                        <img src={post.media[index].file} alt='image' className="picture" />)
                        ) : (<div className="captionhehe"><h1>{post.caption}</h1></div>)}
                        
            </div>
            <span className="material-symbols-outlined arrow" onClick={handleNext} >arrow_right</span>
            
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
                        <Post post={comment} key={comment.id} signal = {signal} setSignal = {setSignal} cuser = {user} socket = {props.socket}/>
                    ))}
            </div>
            
            </div>
        </div>
            
    </div>
    );}
};

export default SinglePost;



