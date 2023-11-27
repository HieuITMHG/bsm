import { useState, useEffect } from 'react';

const UpdateCollapse = (props) => {

    const [isOpenE, setIsOpenE] = useState(false);
    const [isOpenD, setIsOpenD] = useState(false);
    const access_token = localStorage.getItem('access_token')

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
            // Successful deletion, no content returned
            setIsOpenD(false);
            // Optionally handle success message or additional logic
            console.log("Post deleted successfully");
        } else {
            // Handle non-successful response (e.g., error messages)
            // Parse JSON content if available
            return response.json().then((data) => {
                // Handle error data if needed
                console.error('Error deleting post:', data);
            });
        }
    })
    .catch((error) => {
        console.error('Error deleting post:', error);
    });
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
            {isOpenE && (<div>Edit</div>)}


            <div className="updateItem option" onClick={handleToggleE}>Edit</div>
            <div className="updateItem option" onClick={handleToggleD}>Delete</div>
        </div>
    )
}

export default UpdateCollapse;