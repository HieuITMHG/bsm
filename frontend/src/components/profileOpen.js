import { NavLink, useParams } from "react-router-dom"
import { useState, useEffect } from "react";
import '../styles/Home.css'

const ProfileOpen = (props) => {
    if(props.user) {
        return (
            <div className="profileOpen">
                <NavLink to={`/profile/${props.user.id}`} className="linktoprofile">
                    <div className="avatarContainer">
                        <img src={props.user.avatar.file} alt="avatar" className="avatar"/>
                    </div>
                    <div><strong>{props.user.username}</strong></div>
                </NavLink>
            </div>     
        )
    }
}

export default ProfileOpen;

