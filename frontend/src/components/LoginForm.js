import '../styles/LoginForm.css';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const LoginForm = (props) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({username : "", password : ""});
    const [data, SetData]  = useState("");

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name] : value
        });
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('/api/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify(formData), 
        })
        .then(response => response.json()) 
        .then(data => {
            if (data.access && data.refresh) {
                localStorage.setItem('access_token', data.access);
                localStorage.setItem('refresh_token', data.refresh);
                props.setTrigger(!props.trigger)
                navigate('/');
            } else {
                const key = Object.keys(data)[0]
                const err = data[key]
                console.log(err)

                const alert = document.querySelector('.errorAlert')
                alert.style.display = 'block'
                alert.textContent = err
                setTimeout(()=> {
                    alert.style.display = 'none'
                }, 2000)
            }
        })
        .catch(error => console.error('Error:', error));}

    return (
        <div className="loginFormContainer">
            <div class="alert alert-warning errorAlert" style={{display: 'none'}}><strong>Warning!</strong></div>
            <h1>Login</h1>
            <form>
                <input autoFocus placeholder="Username" name="username" onChange={handleChange} />
                <input autoFocus placeholder="Password" name="password" onChange={handleChange} />
                <button onClick={handleSubmit} >Login</button>
                <Link onClick={props.toggleForm}>Create New Accout</Link>
            </form>
        </div>
    )
};

export default LoginForm;