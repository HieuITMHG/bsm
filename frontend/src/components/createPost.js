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
        console.log(modal);
      }, [modal]);
	

    const toggleModal = () => {
        setModal(!modal);
        setFormData({'caption': '', 'media' : []})
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
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
                        <textarea onChange={handleChange} name="caption" id="caption" className="caption x" autoFocus rows={1}/>
                        <div>
                            {formData.media.map((media, index) => (
                                <img
                                    key={index}
                                    src={URL.createObjectURL(media)}
                                    alt={`selected-image-${index}`}
                                    style={{ maxWidth: '100px', maxHeight: '100px', margin: '5px' }}
                                />
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