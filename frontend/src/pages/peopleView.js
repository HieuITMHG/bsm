import { useEffect, useState } from "react";
import UserCard from "../components/userCard";
import Navbar from "../components/Navbar";
import '../styles/Home.css'

const People = () => {

    const [users, setUsers] = useState([])
    const accessToken = localStorage.getItem('access_token');
    

    useEffect(() => {
        fetch('/api/users/', {
            headers : {
                'Authorization': `Bearer ${accessToken}`
            }
        })
          .then(response => response.json()) 
          .then(data => {
            setUsers(data);
          })
          .catch(error => console.error('Error:', error));
      }, []);


    return (
        <>
        <Navbar />
            <div className="userListContaier">
                    {users.map(user => (           
                            <UserCard user = {user} key={user.id}/>
                    ))}
            </div>
        </>            
    )
}

export default People;