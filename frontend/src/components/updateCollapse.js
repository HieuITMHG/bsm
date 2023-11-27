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

    console.log(props.post.id)
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
            console.log("Post deleted successfully");
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


    const handleChange = (e, d) => {
        console.log(e.target.value)
        setNewCaption(e.target.value);
    }

    const handleEdit = (e) => {
        e.preventDefault();
        fetch(`api/posts/${props.post.id}`, {
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
            console.log(data)
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
                    <textarea value={newCaption} className='updateItem'  onChange={handleChange}></textarea>
                    <button className='updateItem' onClick={handleEdit}>Save</button>
                </div>
            </div>)}


            <div className="updateItem option" onClick={handleToggleE}>Edit</div>
            <div className="updateItem option" onClick={handleToggleD}>Delete</div>
        </div>
    )
}

export default UpdateCollapse;