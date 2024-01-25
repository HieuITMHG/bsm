import { useEffect, useState } from "react"
import UserCard from "../components/userCard"
import { useParams, useNavigate } from "react-router-dom"

const FollowersView = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [users, setUsers] = useState([])
    const { userid } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:8000/api/follower/${userid}/`, {
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then(response => response.json())
        .then(data => {
            setUsers(data)
            setIsLoading(false)
        })
    },[])

    if(isLoading) {
        return (
            <div>Loading...</div>
        )
    }else {
        return (
            
            <div>
                <span className="material-symbols-outlined xi" onClick={() => navigate(-1)}>close</span>
                {users.map(user => (
                    <UserCard user={user} />
                ))}
            </div>
        )
    }
}

export default FollowersView;