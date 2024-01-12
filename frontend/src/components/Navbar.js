import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../styles/navBar.css'
import ProfileOpen from './profileOpen';
import NotificationList from './notificationlist';

const Navbar = (props) => {
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [Loading, setLoading] = useState(true)
  const [open, setOpen] =  useState(false)
  const [num, setNum] = useState(0)

    useEffect(() => {
        const access_token = localStorage.getItem('access_token');
  
        if (access_token) {
            fetch(`/api/user/`, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })
                .then(response => response.json())
                .then(data => {
                    setUser(data);
                    setLoading(false)
                })
                .catch(error => console.error('Error:', error));
        }
    }, []);
 
  const handleLogout = () => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      props.socket.close()
      navigate('/login');
  }

  const ToggleNotification = () => {
    setOpen(!open)
  }

  const [notifications, setNotifications] = useState(null); 

  useEffect(()=> {
      const access_token = localStorage.getItem('access_token');
      fetch(`/chat/notification/`, {
          headers: {
              Authorization: `Bearer ${access_token}`,
              'Content-Type': 'application/json',
          }
      })
      .then(response => response.json())
      .then(data => {
        console.log(data)
          setNotifications(data);
          let haha = 0;
          data.map(not => {
            if(not.is_seen == false) {
              haha = haha+1;
              console.log(haha)
            }
          })
          setNum(haha)
      });
  }, [props.reNo]);

  if(!Loading && notifications != null) {
    return (
      <>
        <nav className='navBarContainer'>
        <ul>
          <li className='navItem' onClick={ToggleNotification}>
         
                <span className="material-symbols-outlined">notifications</span> 
                <div className='countNotification'>{num}</div>
           
          </li>
          <li className='navItem'>
            <ProfileOpen user = {user} socket={props.socket}/>
          </li>
          <li className='navItem'>
            <NavLink to="/" >
               <span className="material-symbols-outlined">home</span>       
            </NavLink>
          </li>
          <li className='navItem'>
            <NavLink to="/following">Following</NavLink>
          </li>
          <li className='navItem'>
            <a href="#" onClick={handleLogout}>
              <span className="material-symbols-outlined">logout</span>
            </a>
          </li>
          <li className='navItem'>
            <NavLink to="/people" >
              <span className="material-symbols-outlined">group</span>
            </NavLink>
          </li>
        </ul>
      </nav>

      {open && <NotificationList notifications = {notifications}/>}
      </>
      
    );
  }

  
};

export default Navbar;