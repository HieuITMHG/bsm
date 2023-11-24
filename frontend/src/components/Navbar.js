import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../styles/navBar.css'
import ProfileOpen from './profileOpen';

const Navbar = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [Loading, setLoading] = useState(true)

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
      navigate('/login');
  }

  if(!Loading) {
    return (
      <nav className='navBarContainer'>
        <ul>
          <li className='navItem'>
            <ProfileOpen user = {user}/>
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
    );
  }

  
};

export default Navbar;