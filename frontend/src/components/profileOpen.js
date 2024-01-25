import { NavLink } from "react-router-dom"
import '../styles/Home.css'
import defaultAvatar from '../assets/defaultAvatar.png';

const ProfileOpen = (props) => {
    if(props.user) {
        return (
            <div className="profileOpen">
                <NavLink to={`/profile/${props.user.id}`} className="linktoprofile">
                    <div className="avatarContainer">
                        <img src={defaultAvatar} alt="avatar" className="avatar"/>
                    </div>
                    <div><strong>{props.user.username}</strong></div>
                </NavLink>
            </div>     
        )
    }
}

export default ProfileOpen;

