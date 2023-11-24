import {useState, useEffect} from 'react'
import '../styles/Home.css'
import ProfileOpen from './profileOpen';
import FollowButton from './followButton';

const UserCard = ({user}) => {

    return (
        <div className="userCard" key={user.id}>
            <ProfileOpen user = {user} />
            <div className="card_body">
                <FollowButton user={user} />
            </div>
        </div>
        )
}

export default UserCard;

