// Library Imports
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// Component Imports
import LoggedInResponsiveAppBar from '../common/LoggedInResponsiveAppBar';

// Method Imports
import { getAccountbyId, getFriends, logout } from '../../APIFolder/loginApi';

export const FriendsList = (props) => {
    // Navigate Object
    const navigate = useNavigate();

    // Component Variables
    const [account, setAccount] = useState(JSON.parse(localStorage.getItem("currUser")));
    const [friends, setFriends] = useState(false);

    // Initial Load
    useEffect(() => {

        let temp_friends = []
        if (JSON.stringify(account) === "{}") {
            navigate('/');
            props.setNavigated(true);
        }
        getFriends().then( async res => { 
            console.log(res);
            for(const i in res){
            console.log(res[i].friend_a,res[i].friend_b)
                
                if(res[i].friend_a === account.account_id)
                {
                    console.log("getting friend b")
                    await getAccountbyId(res[i].friend_b).then(frRes => {
                        console.log(frRes);
                        temp_friends.push(frRes);
                    })
                }
                else {
                    console.log("getting friend a")
                     await getAccountbyId(res[i].friend_a).then(frRes => {
                        temp_friends.push(frRes);
                    })
                }
            }
            
        }).then(() => {
            setFriends(temp_friends)})
    }, []);

    // Conditions
    if (!friends) {
        return <>Loading...</>
    }

    // Component Methods
    const goToProfile = (friend) => {
        navigate(`/users/${friend.username}`);
    }

    const signOut = () => {
        console.log("Logging out");
        logout().then(() => {
            localStorage.setItem("currUser", "{}")
            navigate('/');
        });
    }

    // HTML
    return <div>
        <LoggedInResponsiveAppBar
            pages={props.pages}
            settings={props.settings}
            signOut={() => signOut()}
            account_id={account.account_id} />

        <div className='container border-0 mb-3'>
            <h1 className='mt-3 col-6 float-start '>Friends List <span className='text-secondary'>({friends.length})</span></h1>
            <Button variant="contained"
                className='bg-success float-end fs-4 col-3 m-3'
                onClick={() => navigate('/users')}
                endIcon={<AddIcon />}>
                Add A Friend
            </Button>
            <div className='clearfix'></div>
        </div>
        <div className='border-top mb-3'></div>
        {console.log(friends)}
        {friends.length > 0
            && <table className="table">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>First</th>
                        <th>Last</th>
                    </tr>
                </thead>
                <tbody>
                    {friends.map(friend => 
                        <tr key={friend.username} className="container">
                            <td>{friend.username}</td>
                            <td>{friend.first_name}</td>
                            <td>{friend.last_name}</td>

                            <td>
                                <Button variant="contained"
                                    className="btn btn-secondary"
                                    endIcon={<ArrowForwardIcon />}
                                    onClick={() => goToProfile(friend)}>
                                    View Profile
                                </Button>
                            </td>
                        </tr>
                    )}

                </tbody>
            </table>}
        {friends.length === 0 && <h2>You have no friends</h2>}
    </div>
}
