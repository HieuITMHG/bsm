import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../styles/navBar.css'
import ProfileOpen from './profileOpen';
import NotificationList from './notificationlist';
import Chatapp from './chatapp';


const Navbar = (props) => {
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [Loading, setLoading] = useState(true)
  const [open, setOpen] =  useState(false)
  const [num, setNum] = useState(0)
  const [chat, setChat] = useState(false)
  const [windowWidth, setWindowWidth] = useState(0)





  useEffect(() => {
    // Update the state when the window is resized
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Run this effect only once on mount

  useEffect(() => {
    // Conditionally update setOpenChat based on window width
    if (windowWidth > 1060) {
      setChat(false);
    }
  }, [windowWidth, setChat]); 





    useEffect(() => {
        const access_token = localStorage.getItem('access_token');


  
        if (access_token) {
            fetch(`http://localhost:8000/api/user/`, {
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
      fetch(`http://localhost:8000/chat/notification/`, {
          headers: {
              Authorization: `Bearer ${access_token}`,
              'Content-Type': 'application/json',
          }
      })
      .then(response => response.json())
      .then(data => {
       
          setNotifications(data);
          let haha = 0;
          if(data['code' != "user_not_found"]) {
          data.map(not => {
            if(not.is_seen == false) {
              haha = haha+1;
           
            }
          })
        }
          setNum(haha)
      });
  }, [props.reNo]);

  const handleChat = () => {
    setChat(!chat)
  }

  if(!Loading && notifications != null) {
    return (
      <>
        <nav className='navBarContainer'>
        <ul>
          <li className='navItem' onClick={ToggleNotification}>
         
                <span className="material-symbols-outlined ww">notifications</span> 
                <div className='countNotification'>{num}</div>
           
          </li>
          <li className='navItem'>
            <ProfileOpen user = {user} socket={props.socket}/>
          </li>
          <li className='navItem'>
            <NavLink to="/" >
               <span className="material-symbols-outlined ww">home</span>       
            </NavLink>
          </li>
          <li className='navItem'>
            <NavLink to="/following"><span>Following</span></NavLink>
          </li>
          <li className='navItem'>
            <a href="#" onClick={handleLogout}>
              <span className="material-symbols-outlined ww">logout</span>
            </a>
          </li>
          <li className='navItem'>
            <NavLink to="/people" >
                <span className="material-symbols-outlined ww">group</span>
            </NavLink>
          </li>
            <li className='navItem chatli' onClick={handleChat}>     
              <span className="material-symbols-outlined toggleMessage" >mail</span> 
              {chat && <Chatapp socket={props.socket} cuser = {user} reNo = {props.reNo} setReNo = {props.setReNo} />}    
            </li>
        </ul>
      </nav>

      {open && <NotificationList notifications = {notifications}/>}
      </>
      
    );
  }

  
};

export default Navbar;