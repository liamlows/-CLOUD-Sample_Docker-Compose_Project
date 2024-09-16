// Libary Imports
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CircleIcon from '@mui/icons-material/Circle';
import Cookies from "js-cookie";
import { Button, stepButtonClasses } from "@mui/material";
import Check from "@mui/icons-material/Check";
import Add from "@mui/icons-material/Add";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import ClearIcon from '@mui/icons-material/Clear';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import "./ClassProfile.css";


// Component Imports
import { TextField } from "../common";
import LoggedInResponsiveAppBar from "../common/LoggedInResponsiveAppBar";


// Method Imports

import { getAccountbyUsername, logout, sendEnrollmentRequest, updateAccountbyUsername, getAccountbyId, getCourseById, getCourseRequest, getCoursebyId, updateCoursebyId, getEnrollmentStatus, sendNotification, dropCourse } from "../../APIFolder/loginApi";
import { TextAreaField } from "../common/TextAreaField";


export const ClassProfile = (props) => {
    // Navigate Object
    const navigate = useNavigate();
    const location = useLocation();
    if (localStorage.getItem("currUser") === null)
        localStorage.setItem("currUser", "{}");

    // Component Variables
    const [editMode, setEditMode] = useState(false);
    const [reload, setReload] = useState(false);
    const [course, setCourse] = useState({
        // course_name: "Algorithms",
        // course_number: "CS 3353",
        // course_description: "Insert course description here",
        // course_id: 1
    });
    const [professor, setProfessor] = useState({
        first_name: "Wes",
        last_name: "Anderson",
        username: "wes",
        account_id: 1
    });
    const [tas, setTAs] = useState([
        // { first_name: "first1", last_name: "last1", account_id: 10 },

        // { first_name: "first2", last_name: "last2", account_id: 20 }
    ]);
    const [account, setAccount] = useState({})
    const [messageMode, setMessageMode] = useState(false);
    const [message, setMessage] = useState("")

    const params = useParams();

    // Initial Load
    useEffect(() => {
        let status = 0;

        // if (JSON.stringify(account) === "{}")
        //     setAccount(JSON.parse(localStorage.getItem("currUser")));
        console.log(params.course_id)
        getCoursebyId(params.course_id).then(async loaded => {
            console.log(loaded);

            // let prof = await getAccountbyId(course.professor_id)
            // setProfessor(prof));
            setTAs([]);
            let newTas = []
            if (course.tas !== undefined) {
                for (const ta in course.tas) {
                    let person = await getAccountbyId(course.tas[ta])
                    newTas.push(person)
                }
            }
            setTAs(newTas);
            setCourse(loaded)
            // get the table of friend requests
            if (account.account_type === "student") {
                let status = await getEnrollmentStatus(course.course_id)
                console.log("Adding status to course", status);
                changeCourse(status);
                console.log("YUH")
                console.log(course);
            }
        })
    }, [editMode, reload]);


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
            props.setNavigated(1);
            navigate('/');
        }
    }

    // Component Methods
    const startEditing = () => {
        setEditMode(true);
        changeCourse({ ...course });
    }

    const doneEditing = () => {
        if (course.course_name && course.course_number && course.description) {
            updateCoursebyId(course).then(setEditMode(false));
            localStorage.setItem("currUser", JSON.stringify(account));//dont think this ever gets hit or matters in the slightest
        }
        else {
            window.alert("Please fill out all fields");
        }
    }

    const goToProfile = profile => {
        navigate(`/users/${profile.username}`);
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

    const sendEnrollmentRequestFunc = () => {
        sendEnrollmentRequest()
        setReload(!reload)
    }

    const sendMessage = () => {
        sendNotification(message)
        setMessageMode(false)
        setReload(!reload)
    }

    const canEdit = () => {
        //check if listed as professor or ta for the class
        if (account.account_type === "admin") {
            console.log("user is an admin")
            return true;
        }
        if (account.account_id === professor.account_id) {
            console.log("user is the professor")
            return true;
        }
        for (const ta in tas) {
            if (account.account_id === tas[ta].account_id) {
                console.log("user is a ta")
                return true;
            }
        }
        return false;
    }

    const changeCourse = delta => setCourse({ ...account, ...delta });

    // Basically check if user is the same user as the loaded profile.
    // If so then allow them to edit with the edit button at the end (this edit button will update the database once done)
    // If not then display the profile without the edit buttons.

    console.log("Account before if statement", account);
    // NOTE - IN FUTURE ADD BUTTON TO SEND FRIEND REQUEST...ONLY IF FUNCTIONALITY IS IMPLEMENTED
    if (JSON.stringify(account) !== "{}") {
        return <section className="classProfile">
            <LoggedInResponsiveAppBar
                pages={props.pages}
                settings={props.settings}
                signOut={() => signOut()}
                account_id={account.account_id} />

            {/* Viewing editable class (EDITING) */}
            {canEdit() === true && editMode === true &&
                <div className="container border-0 mt-5">
                    <div className="row bg-light p-4">
                        <div className="col-7 float-start mt-1">
                            <table className='table float-start'>
                                <thead>
                                    <th className="float-start col-11 fs-3 mt-2 text-start"><span className="text-start p-0">{course.course_name} ({course.course_number})</span></th>

                                    <th className="col-1">
                                        <button type="button" className="btn btn-light" onClick={() => startEditing()}>Edit Course</button>
                                    </th>
                                </thead>
                                <tbody>
                                    <tr className="border-0">
                                        <td className="col-3 fs-6 text-start border-0">
                                            <TextField label="Course Name :" value={course.course_name} setValue={course_name => changeCourse({ course_name })} />
                                        </td>
                                    </tr>
                                    <tr className="border-0">
                                        <td className="col-3 fs-6 text-start border-0">
                                            <TextField label="Course Department :" value={course.department} setValue={department => changeCourse({ department })} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="col-4 text-start">Teaching Assistants</td>
                                    </tr>
                                    {
                                        tas.map((profile, idx) => {

                                            return <tr key={idx} className="container">
                                                <td>
                                                    <span className="p-0 text-capitalize">{profile.first_name} </span><span className="p-0 text-capitalize" >{profile.last_name}</span>
                                                </td>
                                                <td>
                                                    <Button variant="contained"
                                                        className="btn bg-secondary"
                                                        endIcon={<ArrowForwardIcon />}
                                                        onClick={() => goToProfile(profile)}>
                                                        View Profile
                                                    </Button>
                                                </td>
                                            </tr>
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>

                        <div className="row p-4 bg-light mt-0">
                            <TextAreaField label="Course Description :" value={course.description} setValue={description => changeCourse({ description })} />

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

            {/* Viewing editable class (NOT EDITING) */}
            {canEdit() === true && editMode === false &&
                <div className="container border-0 mt-5">
                    <div className="row bg-light p-4 mb-0">
                        <div className="col-7 float-start mt-1">
                            <table className='table float-start'>
                                <thead>

                                    <th className="float-start col-11 fs-3 mt-2 text-start">{course.course_name} ({course.department})</th>
                                    <th className="col-1">
                                        <button type="button" className="btn btn-light" onClick={() => startEditing()}>Edit Course</button>
                                    </th>
                                </thead>
                                <tbody>
                                <tr>
                                        <td className="col-4 text-start">Teaching Assistants</td>
                                    </tr>
                                   
                                        {tas.length === 0 && <p>No Teaching Assistants Listed</p>}
                                        {tas.length !== 0 && tas.map((profile, idx) => {

                                                return <tr key={idx} className="container">
                                                    <td>
                                                        <span className="p-0 text-capitalize">{profile.first_name} </span><span className="p-0 text-capitalize" >{profile.last_name}</span>
                                                    </td>
                                                    <td>
                                                        <Button variant="contained"
                                                            className="btn bg-secondary"
                                                            endIcon={<ArrowForwardIcon />}
                                                            onClick={() => goToProfile(profile)}>
                                                            View Profile
                                                        </Button>
                                                    </td>
                                                </tr>
                                            })
                                        }
                            
                                </tbody>
                            </table>
                        </div>
                        <div className="ProfessorProfile col-5 mt-1 bg-light2">
                            <table className='table float-start'>
                                <thead>

                                    <th className="float-start col-11 fs-4 mt-2 text-start">Professor</th>
                                    <th className="col-1">
                                        <Button variant="contained"
                                            className="btn bg-secondary"
                                            endIcon={<ArrowForwardIcon />}
                                            onClick={() => navigate(`/users/${professor.username}`)}>
                                            View Profile
                                        </Button>
                                    </th>
                                </thead>
                                <tbody>
                                    <td className="col-3 fs-6 text-start">
                                        <span className="p-0 text-capitalize">{professor.first_name} </span><span className="p-0 text-capitalize" >{professor.last_name}</span>
                                    </td>
                                </tbody>
                            </table>

                        </div>
                    </div>
                    <div className="row p-4 bg-light mt-0">
                    <p className="text-start">
                            Course Description : 
                        </p>
                        <p className="text-start">
                            {course.description}
                        </p>
                    </div>

                    {!messageMode && <Button onClick={() => { setMessageMode(true); setReload(!reload) }}>Send Annoucement</Button>}
                    {messageMode && <div>
                        <TextField label="Message Title :" value={message.title} setValue={title => setMessage({ ...message, title: title })} />
                        <TextAreaField label="Message Body :" value={message.body} setValue={body => setMessage({ ...message, body: body })} />

                        <div className="row mb-3">
                            <div className="col-6">
                                <button type="button" className="btn btn-secondary col-4 contained m-1 float-end" onClick={() => { setMessage({}); setMessageMode(false); setReload(!reload) }}>Cancel</button>
                            </div>
                        </div>
                        <div className="col-6">
                            <button type="button" className="btn btn-success col-4 contained m-1 float-start" onClick={() => sendMessage()}>Save</button>
                        </div>
                    </div>}


                </div>
            }

            {/* Viewing non editable class */}
            {
                !canEdit() &&
                <div>
                    <div className="row">
                        <div className="col-3 float-end">
                            <Button variant="contained" className="m-3" onClick={() => navigate('/classes/enrollment')} startIcon={<KeyboardBackspaceIcon />}>Return to Class Search</Button>
                        </div>
                    </div>
                    <div className="clearfix p-0"></div>
                    <div className="container border-0 mt-3">
                        <div className="row bg-light p-4">
                            <div className="col-7 float-start mt-1">
                                <table className='table float-start'>
                                    <thead>
                                        <th className="float-start col-11 fs-3 mt-2 text-start">{course.course_name} ({course.course_number})</th>
                                        {/* Student is not in class or waitlist */}
                                        {account.account_type === "student" && account.status === 0 && <th className="col-2 pb-2">
                                            <Button variant="contained" className="bg-success" onClick={() => sendEnrollmentRequestFunc()} endIcon={<Add />}>Enroll</Button>
                                        </th>}
                                        {/* Student is on the waitlist */}
                                        {account.account_type === "student" && account.status === -1 && <th className="col-2 pb-2">
                                            <Button variant="contained" disabled endIcon={<Add color='disabled' />}>On Waitlist</Button>
                                            <Button variant="contained" className="col-1 bg-danger" onClick={() => dropCourse(account.account_id, course.course_id)}><ClearIcon/></Button>
                                        </th>}
                                        {/* Student is in class */}
                                        {account.status === 1 && <div className="float-end col-2 mb-1 mt-2">
                                            <div className="clearfix p-0"></div>
                                            <th className="col-1 rounded bg-success border-0 p-1">
                                                <div className="bg-success text-white">
                                                    Enrolled <Check className='mb-1 m-1 mt-0' />
                                                </div>
                                            <Button variant="contained" className="col-1 bg-danger" onClick={() => dropCourse(account.account_id, course.course_id)}><ClearIcon/></Button>
                                            </th>
                                        </div>}

                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td className="col-4 text-start">Teaching Assistants</td>
                                    </tr>
                                   
                                        {tas.length === 0 && <p>No Teaching Assistants Listed</p>}
                                        {tas.length !== 0 && tas.map((profile, idx) => {

                                                return <tr key={idx} className="container">
                                                    <td>
                                                        <span className="p-0 text-capitalize">{profile.first_name} </span><span className="p-0 text-capitalize" >{profile.last_name}</span>
                                                    </td>
                                                    <td>
                                                        <Button variant="contained"
                                                            className="btn bg-secondary"
                                                            endIcon={<ArrowForwardIcon />}
                                                            onClick={() => goToProfile(profile)}>
                                                            View Profile
                                                        </Button>
                                                    </td>
                                                </tr>
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                            <div className="ProfessorProfile col-5 mt-1 bg-light2">
                                <table className='table float-start'>
                                    <thead>

                                        <th className="float-start col-11 fs-4 mt-2 text-start">Professor</th>
                                        <th className="col-1">
                                            <Button variant="contained"
                                                className="btn bg-secondary"
                                                endIcon={<ArrowForwardIcon />}
                                                onClick={() => navigate(`/users/${professor.username}`)}>
                                                View Profile
                                            </Button>
                                        </th>
                                    </thead>
                                    <tbody>
                                        <td className="col-3 fs-6 text-start">
                                            <span className="p-0 text-capitalize">{professor.first_name} </span><span className="p-0 text-capitalize" >{professor.last_name}</span>
                                        </td>
                                    </tbody>
                                </table>

                            </div>
                        </div>
                        <div className="row p-4 bg-light mt-0">
                            <p>
                                {course.description}
                            </p>
                        </div>


                    </div>

                </div>
            }

        </section >
    }
    return <>Loading...</>;
}