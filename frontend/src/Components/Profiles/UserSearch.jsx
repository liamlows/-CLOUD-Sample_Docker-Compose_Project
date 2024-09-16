// Library Imports
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Add from "@mui/icons-material/Add";
import Cookies from "js-cookie";
import ClearIcon from '@mui/icons-material/Clear';

// Component Imports
import LoggedInResponsiveAppBar from "../common/LoggedInResponsiveAppBar";
import { TextField } from "../common";

// Method Imports

import {getAccountbyId, getFriendRequests, getProfiles, getStudents, handleFriendRequest, logout, sendFriendRequest } from "../../APIFolder/loginApi"



export const UserSearch = ({ pages, settings, setNavigated }) => {
    // Navigate Object
    const navigate = useNavigate();
    if (localStorage.getItem("currUser") === null)
        localStorage.setItem("currUser", "{}");

    // Component Variables
    const [account, setAccount] = useState({});
    const [profiles, setProfiles] = useState([]);
    const [username, setUsername] = useState('');
    const [dummy, setDummy] = useState(0);

    useEffect(() => {
        console.log("running");
        // setProfiles(false);
        getStudents().then(res => {
            console.log("Getting requests")
            getFriendRequests().then(frRes => {
                // convert it to an array
                let frReq = [...frRes.incoming, ...frRes.outgoing];
                let status = [];
                // loop through each request
                for (const profile in res) {
                    status[profile] = 0;
                    for (const req in frReq) {
                        // check if the request is to the current user
                        if (frReq[req].requester_id === res[profile].account_id) {
                            // if the friend request has not been accepted
                            if (frReq[req].status === -1) {
                                status[profile] = 2; // display accept request button
                                console.log("changing status to a 2", status);
                            }
                            // if the request has been accepted
                            else if (frReq[req].status === 1) {
                                status[profile] = 3; // display friend tag
                                console.log("changing status to a 3", status);
                            }
                            else if(frReq[req].status === 0){
                                status[profile] = 4; 
                                console.log("changing status to a 4", status);
                            }
                        }
                        // check if the request is from the user
                        else if (frReq[req].requested_id === res[profile].account_id) {
                            // if the request has not been accepted
                            if (frReq[req].status === -1 || frReq[req].status === 0) {
                                status[profile] = 1; // display disabled button
                                console.log("changing status to a 1", status);
                            }
                            // if the request has been accepted
                            else if (frReq[req].status === 1) {
                                status[profile] = 3; // display friend tag
                                console.log("changing status to a 3", status);
                            }
                            else if(frReq[req].status === 0){
                                status[profile] = 4; 
                                console.log("changing status to a 4", status);
                            }
                        }
                    }
                }
                addStatusToProfiles(res, status);
            });
        });
    }, [dummy]);

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
            setNavigated(true);
            navigate('/');
        }
    }

    // Component Methods
    const goToProfile = profile => {
        navigate(`/users/${profile.username}`);
    }

    const goToFriendsList = () => {
        navigate(`/users/${account.username}/friends`);
    }

    const addStatusToProfiles = (dummy, statuses) => {
        console.log("Adding status to profile")
        let profiles2 = [];
        for (const profile in dummy) {
            profiles2.push({ ...dummy[profile], status: statuses[profile] });
        }
        setProfiles(profiles2);
    }


    const signOut = () => {
        console.log("Logging out");
        logout().then(() => {
            localStorage.setItem("currUser", "{}");
            navigate('/');
        });
    }

    const displayUser = (profile) => {
        if (profile.status === 3) {
            console.log("already friends");
            return false;
        }
        if (profile.account_id === account.account_id) {
            return false;
        }
        return true;

    }

    const readyToDisplay = () => {
        console.log("profiles", profiles);
        if (profiles !== undefined && profiles[0] !== undefined && profiles[0].status !== undefined) {
            return true;
        }
        return false;
    }
    const find = (profile) =>
    {
        if(profile.username.indexOf(username) !== -1)
        {
            return true;
        }
        return false
    }

    // HTML
    if (readyToDisplay()) {
        return <div>
            <LoggedInResponsiveAppBar
                pages={pages}
                settings={settings}
                signOut={() => signOut()}
                account_id={account.account_id} />

            <div className="container border-0 mt-3">
                <button type="button" className="float-end btn btn-success mt-3" onClick={goToFriendsList}>Friends List</button>
                <div className="container border-0 col-3 float-start">
                    <TextField label="Search by Username (Case Sensitive)" value={username} setValue={setUsername} />
                </div>
                <div className="clearfix"></div>
            </div>

            {/* TODO: Want to implement virtulized table eventually but regular table for now */}
            <table className="table">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th className="col-2"></th>
                    </tr>
                </thead>
                <tbody>
                    {console.log("RENDER", typeof (profiles))}
                    {profiles.map((profile, idx) => {
                        return (displayUser(profile) && find(profile) && <tr key={idx} className="container">

                            <td>{profile.username}</td>
                            <td>{profile.first_name}</td>
                            <td>{profile.last_name}</td>

                            <td className="col-3 pb-2">
                                {profile.status === 2 &&
                                    <Button variant="contained" className="bg-primary col-7 m-1 mt-0 mb-0" onClick={() => { handleFriendRequest(profile.account_id, 1).then(setDummy(dummy + 1)) }} endIcon={<Add />}>Accept Request</Button>
                                }
                                {profile.status === 2 &&
                                    <Button variant="contained" className="bg-danger col-2" onClick={() => { handleFriendRequest(profile.account_id, 0).then(setDummy(dummy + 1)) }}><ClearIcon /></Button>
                                }
                                {profile.status === 1 &&
                                    <Button variant="contained" disabled endIcon={<Add color='disabled' />}>Sent Request</Button>
                                }
                                {profile.status === 0 &&
                                    <Button variant="contained" className="bg-success" onClick={() => { sendFriendRequest(profile.account_id).then(setDummy(dummy + 1)) }} endIcon={<Add />}>Add Friend </Button>
                                }
                                {profile.status === 4 &&
                                    <Button variant="contained" disabled endIcon={<ClearIcon color='disabled' />}>Redacted</Button>
                                }
                            </td>
                            <td>
                                <Button variant="contained"
                                    className="btn bg-secondary"
                                    endIcon={<ArrowForwardIcon />}
                                    onClick={() => goToProfile(profile)}>
                                    View Profile
                                </Button>
                            </td>

                        </tr>)
                    })}
                </tbody>
            </table>
        </div>

    }
    else {
        return <>Loading...</>
    }
}