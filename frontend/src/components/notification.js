const Notification = (props) => {
    return (
        <div className="notificationContainer">
            <div className="avatarContainer">
              <img src={props.notification.sender.avatar.file} alt="avatar" className="avatar"/>
            </div>
            {props.notification.content}
        </div>
    )
}

export default Notification;