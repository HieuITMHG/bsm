import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/registerForm.css'

const RegisterForm = ({toggleForm}) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({username : "", password : "", email : ""});

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name] : value
        });
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('http://localhost:8000/api/register/', {
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
                toggleForm();
            } else {
                const key = Object.keys(data)[0]
                const err = data[key][0]

                const alert = document.querySelector('.errorAlert')
                alert.style.display = 'block'
                alert.textContent = err
                setTimeout(()=> {
                    alert.style.display = 'none'
                }, 2000)
            }
        })
        .catch(error => console.error('Error:', error));}


    return(
        <div className='registerContainer'>
            <div class="alert alert-warning errorAlert" style={{display: 'none'}}><strong>Warning!</strong></div>
            <h1>Register</h1>
            <form>
                <input autoFocus placeholder="Username" name='username' onChange={handleChange} />
                <input autoFocus placeholder="Email" name='email' onChange={handleChange} />
                <input autoFocus placeholder="Password" name='password'onChange={handleChange} />
                <button onClick={handleSubmit}>Register</button>
            </form>
            <Link onClick={toggleForm}>Have an account</Link>
        </div>
    )
}

export default RegisterForm;