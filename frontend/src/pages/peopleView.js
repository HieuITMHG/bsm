import { useEffect, useState } from "react";
import UserCard from "../components/userCard";
import Navbar from "../components/Navbar";
import '../styles/Home.css'

const People = (props) => {

    const [users, setUsers] = useState([])
    const accessToken = localStorage.getItem('access_token');
    const [reNo, setReNo] = useState([])
    

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
        <div className="peopleContainer">
        <Navbar socket = {props.socket}/>
            <div className="userListContaier">
                    {users.map(user => (           
                            <UserCard user = {user} key={user.id}/>
                    ))}
            </div>
        </div>            
    )
}

export default People;