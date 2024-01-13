const Notification = (props) => {
    const access_token = localStorage.getItem('access_token')
    var timestampString = props.notification.timestamp
    var timestamp = new Date(timestampString);

// Format the timestamp as "hour-minute dd/mm/yyyy"
    var formattedTimestamp = timestamp.toLocaleString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
    });

    const handleChange = () => {
        fetch(`chat/is_seen/${props.notification.id}`, {
            headers : {
                Authorization: `Bearer ${access_token}`
            }
        })
        .then(response => response.json())
        .then(data => {
 
        })
    }

    return (
        <div className={props.notification.is_seen ? "notificationContainer isseen": "notificationContainer isnotseen"} onClick={handleChange}>
            <div className="avatarContainer">
              <img src={props.notification.sender.avatar.file} alt="avatar" className="avatar"/>
            </div>
            <div>{props.notification.content}</div>
            <div>{formattedTimestamp}</div>
        </div>
    )
}

export default Notification;