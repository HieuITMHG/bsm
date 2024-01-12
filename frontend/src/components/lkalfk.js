import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../styles/navBar.css'
import ProfileOpen from './profileOpen';
import NotificationList from './notificationlist';
import '../styles/test.css'
const MyComponent = () => {
    return (
      <div className='humContainer'>
        <nav className='navBarContainer'>
        <ul>
          <li className='navItem'>
         
                <span className="material-symbols-outlined">notifications</span> 
                <div className='countNotification'>5</div>
           
          </li>
          <li className='navItem'>
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
            <a href="#">
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
      {/* post đồ nè */}
      <div className='fifai'>

      </div>

      {/* chát app đồ nè */}
      <div className='chatchit'>


      </div>
      </div>  
    );
 
};

export default MyComponent;