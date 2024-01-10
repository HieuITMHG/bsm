import { useState, useEffect } from "react";
import Notification from "./notification";

const NotificationList = (props) => {
   

    if (props.notifications === null) { 
        return (
            <div>Loading...</div>
        );
    } else {
        return (
            <div className="NotificationAppContainer">
                <div className="insider">
                    {
                        props.notifications.map(noti => (
                            <Notification key = {`notification_${noti.id}`} notification = {noti}/>
                        ))
                    }    
                </div>
            </div>
        );
    }
};

export default NotificationList;