import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import LoginView from './pages/loginAndregisterView';
import Home from './pages/home';
import People from './pages/peopleView';
import Profile from './pages/profile';
import SinglePost from './pages/singlePost';
import FollowingPosts from './pages/followingPosts';
import UploadAvatar from './components/uploadAvatar';
import 'bootstrap/dist/css/bootstrap.min.css';
import FollowingsView from './pages/followingsView';
import FollowersView from './pages/followersView';
import MyComponent from './components/lkalfk';

<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />

function App() {

  return (
    <div className="App">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path="/login" element={<LoginView />} />
          <Route path="/people" element={<People />} />
          <Route path='/profile/:userid' element={<Profile />} />
          <Route path='/following' element={<FollowingPosts />} />
          <Route path='hehe' element={<UploadAvatar />} />
          <Route path='/post/:postid' element={<SinglePost />} />
          <Route path='/followings/:userid' element={<FollowingsView />} />
          <Route path='/followers/:userid' element = {<FollowersView />} />
          <Route path='/test/' element = {<MyComponent />} />
        </Routes>
    </div>
  );
}

export default App;