import React, { useState, useEffect } from "react";
import '../styles/Home.css';

const CreateComment = (props) => {
    const [hehe, sethehe] = useState(false);
    const [formData, setFormData] = useState({
        'caption': '',
        'media': []
    });

    useEffect(() => {
        if (hehe !== false) {
          const handleMouseDown = (e) => {
            if (hehe && !e.target.classList.contains('x')) {
              sethehe(false);
            }
          };
    
          document.addEventListener('mousedown', handleMouseDown);
    
          return () => {
            document.removeEventListener('mousedown', handleMouseDown);
          };
        }
      }, [hehe]);
	

    const togglehehe = () => {
        sethehe(!hehe);
        setFormData({'caption': '', 'media' : []})
    };

    const handleChange = (e) => {
        const cap = e.target.textContent;
        setFormData({
            ...formData,
            caption: cap
        });
    };

    const handleFileInputChange = (e) => {
        const files = e.target.files;
        const filesArray = Array.from(files);

        setFormData(prevFormData => ({
            ...prevFormData,
            media: filesArray
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const token = localStorage.getItem('access_token');
        const formdata = new FormData();

        // Add caption and media to the FormData
        formdata.append('parent_id', props.post.id);
        formdata.append('caption', formData.caption);
        formData.media.forEach(file => {
            formdata.append('media', file);
        });

        fetch('http://localhost:8000/api/comment/', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formdata
        })
        .then(response => response.json())
        .then(data => {
            sethehe(!hehe);
            props.setSignal(!props.signal)
        })
        .catch(error => console.error('Error:', error));
    };

    const handleCancelMedia = (mediaItem) => {
        const updatedMedia = formData.media.filter(item => item !== mediaItem);
        setFormData(prevFormData => ({
          ...prevFormData,
          media: updatedMedia
        }));
      };

    return (
        <div className="commentCreator x" >
            <div className="triggerComment x" onClick={togglehehe}>
                Comment
            </div>
            {hehe ?
                <div className="overLay">
                    <div className="createFormContainer x">
                        <div className="closePostForm">
                            <span className="material-symbols-outlined">close</span>
                        </div>
                        <div className='ToSo c'>
                                <div className='to c'>
                                    <div className='userInfo'>
                                        <div className="avatarContainer c">
                                            <img src={props.post.creater.avatar.file} alt="avatar" className="avatar c"/>
                                        </div>
                                        <div className='c'>{props.post.creater.username}</div>
                                    </div>
                                    
                                    <div className='c'>{props.post.caption}</div>
                                </div>
                            </div>
                        <span onInput={handleChange} role="textbox" className="caption x" rows={1} contentEditable autoFocus></span>
                        <div>
                            {formData.media.map((media, index) => (
                            <div key={`kdlkdj_${index}`} className="uuu">
                            <span className="material-symbols-outlined x" onClick={() => handleCancelMedia(media)}>close</span>
                            {media.type.startsWith('image/') ? (
                                <img className="x"
                                src={URL.createObjectURL(media)}
                                alt={`selected-image-${index}`}
                                style={{ maxWidth: '100px', maxHeight: '100px', margin: '5px' }}
                                />
                            ) : media.type.startsWith('video/') || media.type.endsWith('.mp4') ? (
                                <video className="x"
                                src={URL.createObjectURL(media)}
                                alt={`selected-video-${index}`}
                                style={{ maxWidth: '100px', maxHeight: '100px', margin: '5px' }}
                                controls
                                />
                            ) : (
                                <p>Unsupported media type</p>
                            )}
                            </div>
                        ))}
                            
                        </div>
                        <div className="controller x">
                            <div className="x">
                                <input type="file" id="photo_library" style={{ display: 'none' }} multiple onChange={handleFileInputChange} className="x" accept="image/*, video/*"/>
                                <label htmlFor="photo_library">
                                    <span className="material-symbols-outlined x">photo_library</span>
                                </label>
                            </div>
                            <button onClick={handleSubmit} className="x postBtn">Reply</button>
                        </div>
                    </div>
                </div>
                : null }
        </div>
    );
};

export default CreateComment;