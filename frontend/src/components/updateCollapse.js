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
    
    const handleDelete = () => {
       
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