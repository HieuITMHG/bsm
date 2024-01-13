import { useState, useEffect } from 'react';

const UpdateCollapse = (props) => {

    const [isOpenE, setIsOpenE] = useState(false);
    const [isOpenD, setIsOpenD] = useState(false);
    const [newCaption, setNewCaption] = useState(props.post.caption);
    const access_token = localStorage.getItem('access_token');

   

    const handleToggleE = () => {
        setIsOpenE(!isOpenE)
        setIsOpenD(false)
    }

    const handleToggleD = () => {
        setIsOpenE(false)
        setIsOpenD(!isOpenD)
    }

 
    const handleDelete = () => {
       fetch(`/api/posts/${props.post.id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${access_token}`
        }
       })
       .then((response) => {
        if (response.ok) {
            props.setMore(false)
        } else {
            return response.json().then((data) => {
                console.error('Error deleting post:', data);
            });
        }
    })
    .catch((error) => {
        console.error('Error deleting post:', error);
    });
    }


    const handleChange = (e) => {
     
        setNewCaption(e.target.textContent);
    }

    const handleEdit = (e) => {
        e.preventDefault();
        fetch(`api/posts/${props.post.id}/`, {
            method: 'PATCH', 
            headers:{
                Authorization: `Bearer ${access_token}`,
                'Content-Type': 'application/json',
                'Accept' : 'application/json',
            },
            body:JSON.stringify(
                {caption: newCaption}
            )
        })
        .then(response => response.json())
        .then(data =>{
          
            props.setMore(false)
        })
    }

    return (
        <div className="updateContainer">

            {isOpenD && (
            <div className='deleteConfirmationContainer'>
                <div className='confirForm updateItem'>
                    <div className='updateItem'>Are you sure</div> 
                    <button className='updateItem' onClick={handleDelete}>Delete</button>
                </div>                
            </div>)}
            {isOpenE && (<div className='deleteConfirmationContainer'>
                <div className='confirForm updateItem'>
                    <span onInput={handleChange} role="textbox" className="caption updateItem" rows={1} contentEditable autoFocus></span>
                    <button className='updateItem updateBtn' onClick={handleEdit}>Save</button>
                </div>
            </div>)}


            <span className="material-symbols-outlined updateItem option" onClick={handleToggleE}>edit</span>
            <span className="material-symbols-outlined updateItem option" onClick={handleToggleD}>delete</span>
        </div>
    )
}

export default UpdateCollapse;

