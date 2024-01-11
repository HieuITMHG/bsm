import { useEffect, useState } from "react";

const Message = (props) => {
    const [isLoading, setIsLoading] = useState(true)
    const [isUser, setIsUser] = useState(null)
    const [isOpen, setIsOpen] = useState(false)


    useEffect(() => {
        console.log(props.message)
        if(props.user.id == props.message.sender.id) {
            setIsUser(true)
        }else {
            setIsUser(false)
        }

        setIsLoading(false)
    },[])

    const handleDelete = () => {
        const data = {
            type : 'delete',
            message_id : props.message.id,
            a : props.message.receiver[0].id
        }
        props.socket.send(JSON.stringify(data))
        setIsOpen(false)
    }

    const handeCancel = () => {
        setIsOpen(!isOpen)
    }

    if(isLoading) {
        return (
            <div className="spinner-border"></div>
        )
    }else {
        return (
            <div className={isUser ? 'messageContainer mright' : 'messageContainer mleft'}>

                <div className="imgContainer">
                    {props.message.messageMedia.length != 0 &&
                        <>
                            {
                                props.message.messageMedia.map(media => (
                                    <div className="messageMediaContainer" key={`message_media_${media.id}`}>
                                
                                    {media.file.endsWith('.mp4') || media.file.endsWith('.webm') || media.file.endsWith('mov')? 
                                        <video src={media.file} controls alt='video' className='media' />
                                        :
                                        <img src={media.file} alt='image' className='media' />
                                    }
                            
                                    </div>
                                ))
                            }
                        </>
                    }
                </div>

                <div className="textContentContainer">
                    {isOpen &&
                        <div className="deleteMessageOptionBoardOverlay">
                            <div className="deleteMessageOptionBoard">
                                <button onClick={handeCancel}>Cancel</button>
                                <button onClick={handleDelete}>Delete</button>
                            </div>
                        </div>
                    }
                    {isUser && <span className="material-symbols-outlined delete-message-btn" onClick={handeCancel}>delete</span>}
                    {!isUser && (
                        <div className="avatarContainer profileAvatar ">
                            <img src={props.message.sender.avatar.file} alt="avatar" className="avatar"/>
                        </div>
                    )}
                    
                    {props.message.content != "" &&
                    <div className="contentContainer">
                        <p>{props.message.content}</p>
                    </div>}
                    
                </div> 
            </div>
        )
    }
}

export default Message;