// Libary Imports
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CircleIcon from '@mui/icons-material/Circle';
import Cookies from "js-cookie";
import { Button } from "@mui/material";
import Check from "@mui/icons-material/Check";
import Add from "@mui/icons-material/Add";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import ClearIcon from '@mui/icons-material/Clear';

import "./Profile.css";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';


// Component Imports
import { TextField } from "../common";
import LoggedInResponsiveAppBar from "../common/LoggedInResponsiveAppBar";


// Method Imports
import { getFriendRequests, getStatusByUsername, getAccountbyUsername, handleFriendRequest, logout, sendFriendRequest, updateAccountbyUsername, getFriendRequest, getFriendsClasses, uploadPP, getAccountbyId } from "../../APIFolder/loginApi";
import { TextAreaField } from "../common/TextAreaField";



export const Profile = (props) => {
    // Navigate Object
    const navigate = useNavigate();
    if (localStorage.getItem("currUser") === null)
        localStorage.setItem("currUser", "{}");

    // Component Variables
    const [account, setAccount] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [online, setOnline] = useState(false);
    const [reload, setReload] = useState(false);
    const [classes, setClasses] = useState([]);

    const [pp, setPP] = useState(undefined);
    const params = useParams();
    const location = useLocation();


    // Initial Load
    useEffect(() => {
        let status = 0;
        getStatusByUsername(params.username).then((status) => setOnline(!!status.logged_in));



        getAccountbyId(params.account_id).then( async loaded => {

            // get the table of friend requests
            if (loaded.username !== JSON.parse(localStorage.getItem("currUser")).username) {

                let res = await getFriendRequest(loaded.account_id)
                // convert it to an array
                if (res.requester_id === loaded.account_id) {
                    // if the friend request has not been accepted
                    if (res.status === -1) {
                        status = 2; // display accept request button
                        console.log("changing status to a 2", status);
                    }
                    // if the request has been accepted
                    else if (res.status === 1) {
                        status = 3; // display friend tag
                        console.log("changing status to a 3", status);
                    }
                    else if (res.status === 0) {
                        status = 4;
                        console.log("changing status to a 4", status);
                    }
                }
                // check if the request is from the user
                else if (res.requested_id === loaded.account_id) {
                    // if the request has not been accepted
                    if (res.status === -1) {
                        status = 1; // display disabled button
                        console.log("changing status to a 1", status);
                    }
                    // if the request has been accepted
                    else if (res.status === 1) {
                        status = 3; // display friend tag
                        console.log("changing status to a 3", status);
                    }
                    else if (res.status === 0) {
                        status = 4;
                        console.log("changing status to a 4", status);
                    }
                }



                if (account.account_id !== JSON.parse(localStorage.getItem("currUser")).account_id) {
                    console.log(status, loaded);
                    if (account.status !== status) {
                        console.log("Adding status to account");
                        setAccount({ ...loaded, status: status });
                        console.log(account);
                    }
                }

                if (status === 3) {
                    let res2 = await getFriendsClasses(loaded.account_id)
                    setClasses(...res2);

                }

            }
            else {
                console.log("profiles are the same")
                setAccount({ ...loaded, status: 3 });
            }
        })
    }, [editMode, reload]); //lol the useEffect is just here now.

    if (account.username && account.username !== params.username) {
        let status = 0;
        getStatusByUsername(params.username).then((status) => setOnline(!!status.logged_in));


        getAccountbyId(params.account_id).then( async loaded => {

            // get the table of friend requests
            if (loaded.username !== JSON.parse(localStorage.getItem("currUser")).username) {
                let res = await getFriendRequest(loaded.account_id)
                // convert it to an array
                if (res.requester_id === loaded.account_id) {
                    // if the friend request has not been accepted
                    if (res.status === -1) {
                        status = 2; // display accept request button
                        console.log("changing status to a 2", status);
                    }
                    // if the request has been accepted
                    else if (res.status === 1) {
                        status = 3; // display friend tag
                        console.log("changing status to a 3", status);
                    }
                    else if (res.status === 0) {
                        status = 4;
                        console.log("changing status to a 4", status);
                    }
                }
                // check if the request is from the user
                else if (res.requested_id === loaded.account_id) {
                    // if the request has not been accepted
                    if (res.status === -1) {
                        status = 1; // display disabled button
                        console.log("changing status to a 1", status);
                    }
                    // if the request has been accepted
                    else if (res.status === 1) {
                        status = 3; // display friend tag
                        console.log("changing status to a 3", status);
                    }
                    else if (res.status === 0) {
                        status = 4;
                        console.log("changing status to a 4", status);
                    }
                }

                if (account.account_id !== JSON.parse(localStorage.getItem("currUser")).account_id) {
                    console.log(status, loaded);
                    if (account.status !== status) {
                        console.log("Adding status to account");
                        setAccount({ ...loaded, status: status });
                        console.log(account);
                    }
                }

                if (status === 3) {
                    let res2 = await getFriendsClasses(loaded.account_id)
                    setClasses(...res2);
                }

            }
            else {
                console.log("profiles are the same")
                setAccount({ ...loaded, status: 3 });
            }
        })
    }
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
            console.log(props)
            props.setNavigated(1);
            navigate('/');
        }
    }

    // Component Methods
    const startEditing = () => {
        setEditMode(true);
        changeAccount({ ...account });
    }

    const doneEditing = () => {
        console.log(pp.name);
        console.log(pp.type);
        console.log(pp.size);
        if (account.first_name && account.last_name) {
            if (pp !== undefined) {
                uploadPP(pp).then(() => {
                    window.location.reload();
                });
                setPP(undefined);
            }
            // updateAccountbyUsername(account).then(setEditMode(false));
            // localStorage.setItem("currUser", JSON.stringify(account));
            // window.location.reload();
        }
        else {
            window.alert("Please fill out both fields");
        }
    }

    const cancel = () => {
        setEditMode(false);
    }

    const signOut = () => {
        console.log("Logging out");
        logout().then(() => {
            localStorage.setItem("currUser", "{}")
            navigate('/');
        });
    }

    const profileNav = () => {
        // setAccount(JSON.parse(localStorage.getItem("currUser")));
        navigate(`/users/${JSON.parse(localStorage.getItem("currUser")).username}`);
        // setReload(!reload);
    }

    const sendFriendRequestFunc = () => {
        console.log("sending friend request");
        sendFriendRequest(account.account_id)
        setReload(!reload)
    }

    const handleFriendRequestFunc = (bool) => {
        console.log("handling");
        handleFriendRequest(account.account_id, bool)
        setReload(!reload)
    }

    const changeAccount = delta => setAccount({ ...account, ...delta });



    const onFileChange = event => {

        // Update the state
        setPP(event.target.files[0]);

    };

    const goToClass = (clss) => {
        navigate(`/classes/${clss.course_id}`);
    }

    // Basically check if user is the same user as the loaded profile.
    // If so then allow them to edit with the edit button at the end (this edit button will update the database once done)
    // If not then display the profile without the edit buttons.

    // NOTE - IN FUTURE ADD BUTTON TO SEND FRIEND REQUEST...ONLY IF FUNCTIONALITY IS IMPLEMENTED
    if (JSON.stringify(account) !== "{}" && account.status !== undefined) {
        return <section className="userProfile">
            <LoggedInResponsiveAppBar
                pages={props.pages}
                settings={props.settings}
                signOut={() => signOut()}
                account_id={JSON.parse(localStorage.getItem("currUser")).account_id} />

            {/* Viewing own profile (EDITING) */}
            {JSON.parse(localStorage.getItem("currUser")).username === account.username && editMode === true &&
                <div className="container border-0 mt-5">
                    <div className="row bg-light pb-4">
                        {account.pfp_url !== null && <img src={`${account.pfp_url}`} className="float-start col-4 m-3 mt-5 pb-5" alt="" />}
                        {account.pfp_url === null && <img src="https://via.placeholder.com/300x300" className="float-start col-4 m-3 mt-5 pb-5" alt="" />}
                        <div className="col-7 float-start mt-5">
                            <table className='table float-start'>
                                <thead>
                                    {online && <th className="float-start mt-3 mb-1"><CircleIcon color='success' /></th>}
                                    {!online && <th className="float-start mt-3 mb-1"><CircleIcon sx={{ color: 'red' }} /></th>}
                                    <th className="float-start col-3 fs-3 mt-2 text-start"><span className="text-start p-0">{account.username}</span></th>

                                    <th className="col-1">
                                        <button type="button" className="btn btn-light" onClick={() => startEditing()}>Edit Profile</button>
                                    </th>
                                </thead>
                                <tbody>
                                    <tr className="border-0">
                                        <td className="col-3 fs-6 text-start border-0">
                                            <TextField label="First Name :" value={account.first_name} setValue={first_name => changeAccount({ first_name })} />
                                        </td>
                                    </tr>
                                    <tr className="border-0">
                                        <td className="col-3 fs-6 text-start border-0">

                                            <TextField label="Last Name :" value={account.last_name} setValue={last_name => changeAccount({ last_name })} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><TextAreaField label="Bio :" value={account.bio} setValue={bio => changeAccount({ bio })} /></td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div className="roundered">
                                                <label for="file-upload" class="custom-file-upload">
                                                    <i class="fa fa-cloud-upload"></i> Upload
                                                </label>
                                                <input id="file-upload" type="file" accept=".gif,.jpg,.jpeg,.png" onChange={(event) => onFileChange(event)} />
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="row mb-3">
                            <div className="col-6">
                                <button type="button" className="btn btn-secondary col-4 contained m-1 float-end" onClick={() => cancel()}>Cancel</button>
                            </div>
                            <div className="col-6">
                                <button type="button" className="btn btn-success col-4 contained m-1 float-start" onClick={() => doneEditing()}>Save</button>
                            </div>
                        </div>
                    </div>
                </div>}

            {/* Viewing own profile (NOT EDITING) */}
            {JSON.parse(localStorage.getItem("currUser")).username === account.username && editMode === false &&
                <div className="container border-0 mt-5">
                    <div className="row bg-light pb-4">
                        {account.pfp_url !== null && <img src={`${account.pfp_url}`} className="float-start col-4 m-3 mt-5 pb-5" alt="" />}
                        {account.pfp_url === null && <img src="https://via.placeholder.com/300x300" className="float-start col-4 m-3 mt-5 pb-5" alt="" />}
                        <div className="col-7 float-start mt-5">
                            <table className='table float-start'>
                                <thead>
                                    {online === true && <th className="float-start mt-3 mb-1"><CircleIcon color='success' /></th>}
                                    {online === false && <th className="float-start mt-3 mb-1"><CircleIcon sx={{ color: 'red' }} /></th>}
                                    <th className="float-start col-3 fs-3 mt-2 text-start">{account.username}</th>
                                    <th className="col-1">
                                        <button type="button" className="btn btn-light" onClick={() => startEditing()}>Edit Profile</button>
                                    </th>
                                </thead>
                                <tbody>
                                    <td className="col-3 fs-6 text-start">
                                        <span className="p-0 text-capitalize">{account.first_name} </span><span className="p-0 text-capitalize" >{account.last_name}</span>
                                    </td>
                                    <td>{account.bio}</td>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>}

            {/* Viewing profile besides your own */}
            {JSON.parse(localStorage.getItem("currUser")).username !== account.username &&
                <div>
                    <div className="row">
                        <div className="col-3 float-end">
                            <Button variant="contained" className="m-3" onClick={() => navigate('/users')} startIcon={<KeyboardBackspaceIcon />}>Return to Search</Button>
                        </div>
                    </div>
                    <div className="clearfix p-0"></div>
                    <div className="container border-0 mt-3">
                        <div className="row bg-light pb-4">
                            {account.pfp_url !== null && <img src={`${account.pfp_url}`} className="float-start col-4 m-3 mt-5 pb-5" alt="" />}
                            {account.pfp_url === null && <img src="https://via.placeholder.com/300x300" className="float-start col-4 m-3 mt-5 pb-5" alt="" />}
                            <div className="col-7 float-start mt-5">
                                <table className='table float-start'>
                                    <thead className="col-12">
                                        {online === true && <th className="float-start mt-3 mb-1"><CircleIcon color='success' /></th>}
                                        {online === false && <th className="float-start mt-3 mb-1"><CircleIcon sx={{ color: 'red' }} /></th>}
                                        <th className="float-start col-3 fs-3 mt-2 text-start">{account.username}</th>
                                        {account.status === 2 && <th className="col-2 pb-2">
                                            <Button variant="contained" className="bg-primary" onClick={() => { handleFriendRequestFunc(1) }} endIcon={<Add />}>Accept Request</Button>
                                            <Button variant="contained" className="bg-danger col-2" onClick={() => { handleFriendRequest(0) }}><ClearIcon /></Button>
                                        </th>}
                                        {account.status === 1 && <th className="col-2 pb-2">
                                            <Button variant="contained" disabled endIcon={<Add color='disabled' />}>Request Sent</Button>
                                        </th>}
                                        {account.status === 4 && <th className="col-2 pb-2">
                                            <Button variant="contained" disabled endIcon={<ClearIcon color='disabled' />}>Redacted</Button>
                                        </th>}
                                        {account.status === 0 && <th className="col-2 pb-2">
                                            <Button variant="contained" className="bg-success" onClick={() => sendFriendRequestFunc()} endIcon={<Add />}>Add Friend </Button>
                                        </th>}
                                        {account.status === 3 &&
                                            <div className="float-end col-2 mb-1 mt-2">
                                                <div className="clearfix p-0"></div>
                                                <th className="col-1 rounded bg-success border-0 p-1">
                                                    <div className="bg-success text-white">
                                                        Friends <Check className='mb-1 m-1 mt-0' />
                                                    </div>
                                                </th>
                                            </div>
                                        }

                                    </thead>
                                    <tbody>
                                        <td className="col-3 fs-6 text-start">
                                            <span className="p-0 text-capitalize">{account.first_name} </span><span className="p-0 text-capitalize" >{account.last_name}</span>
                                        </td>
                                        <td>{account.bio}</td>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>}

            {
                classes.length === 0 && (account.status === 3 || account.account_id === JSON.parse(localStorage.getItem("currUser")).account_id) && <div>
                    <h1>Classes</h1>
                    <p>{account.username} is not enrolled in any classes</p>
                </div>
            }
            {
                classes.length === 0 && account.status !== 3 && account.account_id !== JSON.parse(localStorage.getItem("currUser")).account_id && <div>
                    <h1>Classes</h1>
                    <p>You must be friends with {account.username} to view their classes</p>
                </div>
            }
            {classes.length !== 0 && <div>
                <h1>Classes</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Number</th>
                            <th>Days</th>
                            <th>Time</th>
                            <th> </th>
                        </tr>
                    </thead>
                    <tbody>
                        {classes.map((clss, idx) => {

                            return <tr key={idx} className="container">
                                <td>{clss.name}</td>
                                <td>{clss.number}</td>
                                <td>{clss.days}</td>
                                <td>{clss.time}</td>
                                <td>
                                    <Button variant="contained"
                                        className="btn bg-secondary"
                                        endIcon={<ArrowForwardIcon />}
                                        onClick={() => goToClass(clss)}>
                                        View Course
                                    </Button>
                                </td>

                            </tr>

                        })}
                    </tbody>
                </table>
            </div>}



            {/* {
                //satisfying the review professor
                //honestly we may be able to get away with doing the flagging be a note saying "flagged reviews are seen as false or overly critical by professor"
                account.account_type === "professor" && <ReviewList></ReviewList>
            } */}
        </section>
    }
    return <></>;
}