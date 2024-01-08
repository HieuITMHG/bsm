import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import React, { useState, useEffect } from 'react';
import "../styles/loginAndRegisterView.css";

const LoginView = (props) => {
    const [showLogin, setShowLogin] = useState(true);

    useEffect(() => {
        document.querySelector('.alert-warning').style.display = 'none';
    }, []);

    const toggleForm = () => {
        setShowLogin(!showLogin);
    };

    return (
        
        <div className="container">
            <div className="alert alert-warning">
                <strong>Warning!</strong> This alert box could indicate a warning that might need attention.
            </div>
            {showLogin ? <LoginForm toggleForm = {toggleForm} trigger = {props.trigger} setTrigger = {props.setTrigger}/> : <RegisterForm toggleForm = {toggleForm} />}
        </div>
    );
}

export default LoginView;