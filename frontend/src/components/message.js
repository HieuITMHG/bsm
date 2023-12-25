import { useEffect, useState } from "react";

const Message = (props) => {
    const [isLoading, setIsLoading] = useState(true)
    const [isUser, setIsUser] = useState(null)

    useEffect(() => {
        if(props.user.id == props.message.sender.id) {
            setIsUser(true)
        }else {
            setIsUser(false)
        }

        setIsLoading(false)
    },[])

    if(isLoading) {
        return (
            <div className="spinner-border"></div>
        )
    }else {
        return (
            <div className={isUser ? 'messageContainer mright' : 'messageContainer mleft'}>
                {!isUser && (
                    <div className="avatarContainer profileAvatar ">
                        <img src={props.message.sender.avatar.file} alt="avatar" className="avatar"/>
                    </div>
                )}
                
                <div className="contentContainer">
                    <p>{props.message.content}</p>
                </div>

            </div>
        )
    }
}

export default Message;