import React, { useState, useEffect } from "react";
import '../styles/Home.css';

const CreatePost = (props) => {
    const [modal, setModal] = useState(false);
    const [formData, setFormData] = useState({
        'caption': '',
        'media': []
    });

    useEffect(() => {
        if (modal !== false) {
          const handleMouseDown = (e) => {
            if (modal && !e.target.classList.contains('x')) {
              setModal(false);
            }
          };
    
          document.addEventListener('mousedown', handleMouseDown);
    
          return () => {
            document.removeEventListener('mousedown', handleMouseDown);
          };
        }
      }, [modal]);
    
      useEffect(() => {
      }, [modal]);
	

    const toggleModal = () => {
        setModal(!modal);
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
            media: [...prevFormData.media, ...filesArray]
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const token = localStorage.getItem('access_token');
        const formdata = new FormData();

        // Add caption and media to the FormData
        formdata.append('caption', formData.caption);
        formData.media.forEach(file => {
            formdata.append('media', file);
        });

        fetch('/api/posts/', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formdata
        })
        .then(response => response.json())
        .then(data => {
            setModal(!modal);
            props.setPosts(prevPosts => [data, ...prevPosts]);
        })
        .catch(error => console.error('Error:', error));

        // props.socket.send(JSON.stringify({
        //     type : "notification"
        // }))
    };
    const handleCancelMedia = (mediaItem) => {
        const updatedMedia = formData.media.filter(item => item !== mediaItem);
        setFormData(prevFormData => ({
          ...prevFormData,
          media: updatedMedia
        }));
      };

    return (
        <div className="createPostContainer">
            <div className="triggerForm">
                <button onClick={toggleModal} id="openButton" className="x">How do you feel today</button>
            </div>
            {modal ?
                <div className="overLay">
                    <div className="createFormContainer x">
                        <div className="closePostForm">
                            <span className="material-symbols-outlined">close</span>
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
                        <div className="controller">
                            <div className="x">
                                <input type="file" id="photo_library" style={{ display: 'none' }} multiple onChange={handleFileInputChange} className="x" accept="image/*, video/*"/>
                                <label htmlFor="photo_library">
                                    <span className="material-symbols-outlined x">photo_library</span>
                                </label>
                            </div>
                            <button onClick={handleSubmit} className="x postBtn">Post</button>
                        </div>
                    </div>
                </div>
                : null }
        </div>
    );
};

export default CreatePost;