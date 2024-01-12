import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import React, { useState, useEffect } from 'react';
import "../styles/loginAndRegisterView.css";

const LoginView = (props) => {
    const [showLogin, setShowLogin] = useState(true);

    const toggleForm = () => {
        setShowLogin(!showLogin);
    };

    return (
        
        <div className="container">
            {showLogin ? <LoginForm toggleForm = {toggleForm} trigger = {props.trigger} setTrigger = {props.setTrigger}/> : <RegisterForm toggleForm = {toggleForm} />}
        </div>
    );
}

export default LoginView;