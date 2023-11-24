import { useEffect, useState } from "react";
import FollowButton from "./followButton";
import UploadAvatar from "./uploadAvatar";
import AutoLink from "./autoLink";

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
            fetch(`/api/users/${props.userid}`,{
                headers: {
                    'Content-Type': 'application/json', 
                }
            })
                .then(response => response.json())
                .then(data => {
                    setUser(data);
                    setBio(data.aboutme)
                })
                .catch(error => console.error('Error:', error));


                
  
                if (access_token) {
                    fetch(`/api/user/`, {
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
                    console.log("close")
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
                    fetch('/api/bio/', {
                        method: "POST",
                        headers: {
                            'Authorization': `Bearer ${access_token}`,
                            'Content-Type': 'application/json'
                        },
                        body :  JSON.stringify({bio : bio})
                    })
                    .then(response => response.json())
                    .then(data => {
                        setHihi(false)
                        console.log(data)
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
        console.log(hihi)
    }

    if (loading) {
        return <div>Loading...</div>;
        }else {
        return (
            
            <div className="profileContainer">
                    {toggleForm && <UploadAvatar func = {func}/>}
                    <div className="infoBox">
                        <div className="avatarContainer profileAvatar " onClick={func}>
                            <img src={user.avatar.file} alt="avatar" className="avatar"/>
                        </div>
                        <div className="detailContainer">
                            <div><h2>{user.username}</h2></div>
                            {(!loading && user.id != cuser.id)  && <FollowButton user={user} />}
                        </div>
                    </div>
                    <div className="aboutMeContainer t" >  
                        {
                        (user.id == cuser.id) ? ( 
                            <div className="triggerContainer t" onClick={handleHihi}>{hihi ? (<textarea onChange={handleBioChange} className="t" value={bio}/> ) :
                                <div className="t trigger">{bio}</div>
                            }</div>
                        ) :
                            (<div className="triggerContainer"> {bio} </div>) 
                        }                                             
                    </div>
            </div>
        )
        }
        
    
}

export default UserInfo
