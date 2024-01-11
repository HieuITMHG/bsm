import { useState, useEffect } from "react";
import Notification from "./notification";
import { NavLink } from "react-router-dom";

const NotificationList = (props) => {
    console.log(props.notifications)

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
                            <NavLink to={`/post/${noti.post_id}`} key = {`notification_${noti.id}`}>
                                <Notification  notification = {noti}/>
                            </NavLink>  
                        ))
                    }    
                </div>
            </div>
        );
    }
};

export default NotificationList;