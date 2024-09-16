// Library Imports
import { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// Component Imports
import LoggedInResponsiveAppBar from '../common/LoggedInResponsiveAppBar';

// Method Imports
import { getAccountbyId, getWaitlist, logout } from '../../APIFolder/loginApi';

export const Waitlist = (props) => {
    // Navigate Object
    const navigate = useNavigate();
    const params = useParams();

    // Component Variables
    const [account, setAccount] = useState({});
    const [users, setUsers] = useState(false);

    // Initial Load
    useEffect(() => {
        if (!localStorage.getItem("currUser") || localStorage.getItem("currUser") === "{}") {
            navigate('/');
            props.setNavigated(true);
        }
        else if (JSON.stringify(account) === "{}")
            setAccount(JSON.parse(localStorage.getItem("currUser")));
        getWaitlist(params.course_id).then(res => {
            let list = [...res];
            let tempUsers = [];
            list.map(x => getAccountbyId(x.account_id).then(account => tempUsers.push(account)));
            setUsers(tempUsers);
        });
    }, []);

    // Conditions
    if (users === false) {
        return <>Loading...</>
    }

    // Component Methods
    const signOut = () => {
        console.log("Logging out");
        logout().then(() => {
            localStorage.setItem("currUser", "{}")
            navigate('/');
        });
    }
    const goToProfile = profile => {
        navigate(`users/${profile.username}`);
    }
    const profileNav = () => {
        navigate(`users/${account.username}`);
    }
    const accountNav = () => {
        navigate(`accounts/${account.username}`);
    }

    // HTML
    return <div>
        <LoggedInResponsiveAppBar
            pages={props.pages}
            settings={props.settings}
            signOut={() => signOut()}
            username={account.username}
            profileNav={() => profileNav()}
            account={() => accountNav()} />

        <div className='container border-0 mb-3'>
            <h1 className='mt-3 col-6 float-start '>Waitlist <span className='text-secondary'>({users.length})</span></h1>
            <div className='clearfix'></div>
        </div>
        <div className='border-top mb-3'></div>
        {console.log(users)}
        {users.length > 0
            && <table>
                <tbody>
                    {users.map(user => 
                        <tr key={user.username}>
                            <td>{user.username}</td>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>

                            <td>
                                <Button variant="contained"
                                    className="btn btn-secondary"
                                    endIcon={<ArrowForwardIcon />}
                                    onClick={() => goToProfile(user)}>
                                    View Profile
                                </Button>
                            </td>
                        </tr>
                    )}

                </tbody>
            </table>}
        {users.length === 0 && <h2>No one on this waitlist</h2>}
    </div>
}