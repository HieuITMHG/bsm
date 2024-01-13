import Avatar from 'react-avatar-edit';
import '../styles/Home.css';
import { useState, useEffect } from 'react';

const UploadAvatar = (props) => {

    

    const [preview, setPreview] = useState(null);
    const [src, setSrc] = useState(null);

    const onClose = () => {
        setPreview(null);
    }

    const onCrop = view =>{
        setPreview(view);
    }


    const handleUpdateAvatar = (e) => {
        const token = localStorage.getItem('access_token')
     
        e.preventDefault();
        fetch('/api/updateavatar/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                code: preview
            }) 
        })
        .then(response => response.json()) 
        .then(data => {
       
            props.func();
        })
        .catch(error => console.error('Error:', error));
    }

    return (
        <div className='cropAvatarContainer x'>  
            <div className='cropForm'>
                <div className="closePostForm x">
                    <span className="material-symbols-outlined x">close</span>
                </div>
                <div className="custom-avatar-edit" ><Avatar src={src} height={300} width={300} onClose={onClose} onCrop={onCrop}/></div>
                <button onClick={handleUpdateAvatar}>Submit</button>
            </div>   
        </div>
        
    )
}

export default UploadAvatar;