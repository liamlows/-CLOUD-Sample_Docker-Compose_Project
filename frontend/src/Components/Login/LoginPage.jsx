// Library Imports
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Component Imports
import { PasswordField, TextField } from "../common";
import { GenericButton } from "../common/GenericButton"

// Method Imports
import { getAccountbyId, logIntoAccount } from "../../APIFolder/loginApi";

export const LoginPage = (props) => {
    // Navigate Object
    const navigate = useNavigate();
    if (localStorage.getItem("currUser") === null)
        localStorage.setItem("currUser", "{}");

    // Component Variables
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Initial Load
    useEffect(() => {
        console.log(localStorage.getItem("currUser"));
        if (localStorage.getItem("currUser") !== "{}") {
            console.log("User exists");
            navigate('/'); 
        }
    });

    // Conditions

    // Component Methods
    const login = () => {
        var credentials = {
            "username": username,
            "password": password
        };
        logIntoAccount(credentials).then(res => checkIfLoginSucc(res)).catch();
    }
    const checkIfLoginSucc = (res) => {
        if (res.success !== 1) {
            window.alert("Password or username is incorrect");
        }
        else {
            console.log("logging in now...");
            getAccountbyId(res.account_id)
                .then(x => {
                    localStorage.setItem("currUser", JSON.stringify(x));
                    props.setNavigated(0);
                    navigate('/');
                });
        }
    }

    // HTML
    return <section id="loginView">
        <h1 class="text-success">Login</h1>
        <form className="container">
            <TextField label="Username"
                value={username}
                setValue={x => setUsername(x)} />

            {/* Need to change all the generic classes to id passed in since I click on "Password" and it takes me to the Username field" */}

            <PasswordField label="Password"
                value={password}
                setValue={x => setPassword(x)} />

            <button
                type="button"
                onClick={() => login()}
                variant="contained"
                class="btn btn-secondary text-light">
                Login
            </button>
            {/* <GenericButton label="Login" click="/loggedIn" /> */}
            <p className="mb-0">or</p>
            <GenericButton label="Sign Up" click="/signUp" />
        </form>
    </section>
}