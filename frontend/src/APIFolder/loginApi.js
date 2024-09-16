import axios from 'axios';
axios.defaults.withCredentials = true
export const BACKEND_ENDPOINT = "http://localhost:8000";


export const registerAccount = async (credentials) =>  {
    console.log("Registering...");

    const res = await axios.post(`${BACKEND_ENDPOINT}/api/account/register`, credentials);
    if(res.status !== 200){
        console.log(`Couldn't register. ${res.status}`)
        return null;
    }
    return res.data;
};

export const logIntoAccount = async (credentials) => {
    console.log("Logging in...");
    const res = await axios.post(`${BACKEND_ENDPOINT}/api/account/login`, credentials);
    if(res.status !== 200){
        console.log(`Couldn't log in. ${res.status}`)
        return null;
    }
    return res.data;
};

export const logout = async () => {
    try {
        const res = await axios.get(`${BACKEND_ENDPOINT}/api/account/logout`);
    } catch(e) {
        console.log(`Failed to logout.: ${e}`)
    }
}

export const getAccountbyId = async (account_id) => {
    if(account_id === undefined || account_id === null){
        return null;
    }

    const res = await axios.get(`${BACKEND_ENDPOINT}/api/users/${account_id}`);
    if(res.status !== 200){
        console.log(`Couldn't find user: ${account_id}`)
        return null;
    }
    return res.data;
}

//Still work in progress. Account editing is not fully implemented
export const updateAccountbyUsername = async (account) => {
    return axios.put(`${BACKEND_ENDPOINT}/api/account`, {account: account} );
}


export const getStudents = async () => {
    const res = await axios.get(`${BACKEND_ENDPOINT}/api/users?account_type=student`);

    if(res.status !== 200){
        console.log("Couldn't find users");
        return null;
    }
    return res.data;
}

export const getStatusByUsername = async (username) => {
    const res = await axios.get(`${BACKEND_ENDPOINT}/api/users/${username}/status`);
    if(res.status !== 200){
        console.log("Couldn't find user status");
        return null;
    }
    return res.data;
}

export const sendFriendRequest = async (targetId) => {
    console.log("Sending Friend Request")
    const res = await axios.post(`${BACKEND_ENDPOINT}/api/friends/requests`, { targetId: targetId });
    return res.data;
}
export const getAllCourses = async() => {
    //TODO: is this right???
    const res = await axios.get('http://localhost:8000/api/courses');
    if(res.status !== 200){
        console.log("Couldn't find courses");
        return null;
    }
    return res.data;
}

// export const sendFriendRequests = async () => {
//     const res = await axios.post(`http://loacalhost:8000/api/friends/requests`);
//     return res.data;
// }

export const getFriends = async () => {
    const res = await axios.get(`${BACKEND_ENDPOINT}/api/friends`);
    console.log(res)
    return res.data;
}

export const getWaitlist = async (courseID) => {
    var res;
    try {
        res = await axios.get(`${BACKEND_ENDPOINT}/api/d/waitlists/course_id/${courseID}`);
    }
    catch {
        return [];
    }
    return res.data;
}

export const getCoursebyId = async (courseID) => {
    //TODO: is this right???
    const res = await axios.get(`${BACKEND_ENDPOINT}/api/courses/${courseID}`);
    if(res.status !== 200){
        console.log("Couldn't find course");
        return null;
    }
    console.log(res);
    return res.data;
}

export const updateCoursebyId = async (course) => {
    //TODO: is this right???
    const res = await axios.put(`${BACKEND_ENDPOINT}/api/d/courses/course_id/${course.course_id}`, course);
    if(res.status !== 200){
        console.log("Couldn't find course");
        return null;
    }

    return res.data;
}


export const addCourse = async (course, account) =>  {
    console.log("Adding..");

    const res = await axios.post(`${BACKEND_ENDPOINT}/api/users/${account.username}/courses/${course.courseID}`, course.courseID, account);
    if(res.status !== 200){
       // console.log(`Couldn't register. ${res.status}`)
        return null;
    }
    return res.data;
};

/**TODO: professor call?, indivual course call */
// export const 
export const getFriendRequests = async () => {
    const res = await axios.get(`${BACKEND_ENDPOINT}/api/friends/requests`);
    return res.data;
}

export const handleFriendRequest = async (id, status) => {
    const res = await axios.put(`${BACKEND_ENDPOINT}/api/friends/requests/${id}`, {status: status});
    return;
}

export const getFriendRequest = async (id) => {
    const res = await axios.get(`${BACKEND_ENDPOINT}/api/friends/status/${id}`);
    return res.data;
}

export const getFriendsClasses = async (id) => {
    console.log(id)
    const res = await axios.get(`${BACKEND_ENDPOINT}/api/enrollments/${id}`);

    return res.data;
}

// api/users/professors/

export const getClasses = async () => {
    const res = await axios.get(`${BACKEND_ENDPOINT}/api/courses`);
    return res.data;
}

export const uploadPP = async (pp) => {
    console.log(typeof(pp), pp)
    let formData = new FormData();
    formData.set("profilePic", pp);
    await axios.post(`${BACKEND_ENDPOINT}/api/account/pfp`, formData,
        {
            headers: {
                "Content-type": "multipart/form-data",
            }
        });
    // return res.data;
}

export const sendEnrollmentRequest = async (targetId) => {
    const res = await axios.post(`${BACKEND_ENDPOINT}/api/enrollments/`, { targetId: targetId });
    return res.data;
}

export const deleteNotification = async (id) => {
    await axios.delete(`${BACKEND_ENDPOINT}/api/notifications/${id}`);
    return;
}

export const getNotifications = async () => {
    const res = await axios.get(`${BACKEND_ENDPOINT}/api/notifications`);
    return res.data;
}

export const sendNotification = async (message) => {
    const res = await axios.post(`${BACKEND_ENDPOINT}/api/notifications`, message);
    return res.data;
}

//status for course
export const getEnrollmentStatus = async (id) => {
    const res = await axios.get(`${BACKEND_ENDPOINT}/api/enrollments/status/${id}`);
    return res.data;
}
//drop course
export const dropCourse = async (account_id, id) => {
    await axios.delete(`${BACKEND_ENDPOINT}/api/enrollments/${account_id}/${id}`);
    return;
}