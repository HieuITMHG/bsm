import { useEffect, useState } from "react";
import FollowButton from "./followButton";
import UploadAvatar from "./uploadAvatar";
import AddFriendButton from "./addfriendbutton";
import AutoLink from "./autoLink";
import { NavLink } from "react-router-dom";
import defaultAvatar from '../assets/defaultAvatar.png';

const UserInfo = (props) => {
    const [user, setUser] = useState({});
    const [cuser, setCuser] = useState({})
    const [loading, setLoading] = useState(true)
    const [toggleForm, settoggleForm] = useState(false)
    const [bio, setBio] = useState("")
    const [hihi, setHihi] = useState(false)
    const access_token = localStorage.getItem('access_token');

    const func = () => {
        settoggleForm(!toggleForm)
    }


    useEffect(() => {
            fetch(`http://localhost:8000/api/users/${props.userid}`,{
                headers: {
                    'Content-Type': 'application/json', 
                }
            })
                .then(response => response.json())
                .then(data => {
                    setUser(data);
                    console.log(data)
                    setBio(data.aboutme)
                })
                .catch(error => console.error('Error:', error));


                
  
                if (access_token) {
                    fetch(`http://localhost:8000/api/user/`, {
                        headers: {
                            'Authorization': `Bearer ${access_token}`
                        }
                    })
                        .then(response => response.json())
                        .then(data => {
                            setCuser(data);
                            setLoading(false)
                        })
                        .catch(error => console.error('Error:', error));
                }

                
        

        }, [props.userid]);

        useEffect(() => {
            let handler = (e) => {
                if (toggleForm && e.target.classList.contains('x')) {
                    settoggleForm(false);
           
                }
            }
            
            document.addEventListener('mousedown', handler);
        
            return () => {
                document.removeEventListener('mousedown', handler);
            }
        },[toggleForm])


        useEffect(() => {
            let handle = (e) => {
                if(!e.target.classList.contains('t') && hihi) {
                    fetch('http://localhost:8000/api/bio/', {
                        method: "POST",
                        headers: {
                            'Authorization': `Bearer ${access_token}`,
                            'Content-Type': 'application/json'
                        },
                        body :  JSON.stringify({bio : bio})
                    })
                    .then(response => response.json())
                    .then(data => {
                        
                        const alert = document.querySelector('.updatedAlert')
                        alert.textContent = data[0]
                        if(data[0]=="updated") {
                            setHihi(false)
                        }
                        alert.style.display = 'block'
                        setTimeout(() => {
                            alert.style.display = 'none'
                        }, 2000);
                    })
                }
            }

            document.addEventListener('mousedown', handle);

            return () => {
                document.removeEventListener('mousedown', handle);
            }
        })

    const handleBioChange = (e) => {
        setBio(e.target.value)
    }

    const handleHihi = () => {
        setHihi(true);
    
    }

    if (loading) {
        return <div>Loading...</div>;
        }else {
        return (
            
            <div className="profileContainer">
                    {
                        user.id == cuser.id && 
                        <>
                            {toggleForm && <UploadAvatar func = {func}/>}
                        </>
                    }
                    
                    <div className="infoBox">
                        <div className="avatarContainer profileAvatar " onClick={func}>
                            {
                                user.avatar == null ?<img src={defaultAvatar} alt="avatar" className="avatar"/> :
                                <img src={user.avatar.file} alt="avatar" className="avatar"/>
                            }
                            
                        </div>
                        <div className="detailContainer">
                            <div><h2>{user.username}</h2></div>
                            {(!loading && user.id != cuser.id)  && <FollowButton user={user} />}
                            {(!loading && user.id != cuser.id)  && <AddFriendButton user={user} />}

                            <NavLink to={`/followings/${props.userid}`}>
                                <div><p>Following: {user.follow.length}</p></div>
                            </NavLink>

                            <NavLink to={`/followers/${props.userid}`}>
                                <div><p>Follower: {user.followed_by.length}</p></div>
                            </NavLink>
                            
                            
                        </div>
                    </div>
                    <div className="aboutMeContainer t" >  
                        {
                        (user.id == cuser.id) ? ( 
                            <div className="triggerContainer t" onClick={handleHihi}>{hihi ? (<textarea onChange={handleBioChange} className="t" value={bio}/> ) :
                                <div className="t trigger"><p><AutoLink text={bio}/></p></div>
                            }</div>
                        ) :
                            (<div className="triggerContainer"> {bio} </div>) 
                        }         
                        <p className="updatedAlert" style={{display : 'none'}}></p>                                    
                    </div>
            </div>
        )
        }
        
    
}

export default UserInfo
