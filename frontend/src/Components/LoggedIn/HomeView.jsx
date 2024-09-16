// Library Imports
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Button } from "@mui/material";


// Component Imports
import { LoggedInResponsiveAppBar } from "../common/LoggedInResponsiveAppBar";

// Method Imports
import { deleteNotification, getAccountbyId, getNotifications, logout } from "../../APIFolder/loginApi";

import ClearIcon from '@mui/icons-material/Clear';

export const HomeView = (props) => {
    // Navigate Object
    const navigate = useNavigate();
    if (localStorage.getItem("currUser") === null)
        localStorage.setItem("currUser", "{}");

    // Component Variables
    const [account, setAccount] = useState({});
    const [notifications, setNotifications] = useState([]);

    // Initial Load
    useEffect(() => {
        if (JSON.stringify(account) === "{}")
            setAccount(JSON.parse(localStorage.getItem("currUser")));

        // scedule?
        getNotifications(account.account_id).then(res => { setNotifications(res) })
        console.log("Loading HomeView...");
    }, [account]);

    console.log(account);

    // Conditions
    if (JSON.stringify(account) === "{}") {
        let account_id = Cookies.get("account_id");
        if (account_id) {
            getAccountbyId(account_id)
                .then(account => {
                    if (account) {
                        localStorage.setItem("currUser", JSON.stringify(account));
                        setAccount(account);
                    }
                    else {
                        console.log("User is null after request");
                    }
                });
        }
        else {
            navigate('/');
        }
    }

    // Component Methods
    const signOut = () => {
        console.log("Logging out");
        logout().then(() => {
            localStorage.setItem("currUser", "{}")
            navigate('/');
        });
    }

    const removeNotification = (id) => {
        let notifications2 = notifications
        for (const idx in notifications2) {
            if (notifications2[idx].notification_id === id) {
                notifications2.splice(idx, 1);
                setNotifications({ ...notifications2 });
                deleteNotification(id);
            }
        }
    }
    const removeAllNotification = () => {
        for(const i in notifications)
        {
            removeNotification(notifications[i].notification_id);
        }
    }

    // HTML
    return <div>
        <LoggedInResponsiveAppBar
            pages={props.loggedInPages}
            settings={props.settings}
            signOut={() => signOut()}
            account_id={account.account_id} />
        <div className="col-6 p-0"><div className="col-1 p-0"></div><h1 className="col-6 mt-4 fs-2">Welcome {account.firstName}</h1></div>
        <div className="clearfix p-0"></div>
        <div className="row mt-5 m-3">
            <div className="col-6 border p-5">
                Add Classes Here
            </div>
            <div className="col-6 border p-5">

                {/* Need to add api routes to clear notifications */}
                <table className="overflow-hidden">
                    <thead>
                        <tr>
                            <th>Notifications</th>
                            {notifications.length !== 0 && <th>
                                <Button onClick={() => { removeAllNotification(account.account_id) }}>Clear All</Button>
                            </th>}
                        </tr>
                    </thead>
                    <tbody>
                        {notifications.length !== 0 && notifications.map((notification, idx) => {
                            return <div>
                                <tr className="row">
                                    <h1 className="col-9">{notification.title}</h1>
                                    <Button className="col-1" onClick={() => removeNotification(notification.id)}><ClearIcon /></Button>
                                    <div className="p-0 m-0 border"></div>
                                    <p>{notification.body}</p>
                                </tr>
                            </div>
                        })}
                        {
                            notifications.length === 0 && <tr>
                                <td>No Notifications</td>
                            </tr>
                    }
                    </tbody>
                </table>
            </div>
        </div>
    </div>
}