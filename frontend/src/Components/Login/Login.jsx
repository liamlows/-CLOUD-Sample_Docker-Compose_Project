import { useState } from "react"
import { render } from "react-dom"
import './Login.css';
import {account} from "../../api/account";
const Login=()=>{
    const[user, setUsername]= useState("");
    const[password, setPassword]=useState("");
    const[err, setErr]=useState('');
    const[signUp, setSignUp]=useState(false);
    const[rUser, setRUsername]= useState("");
    const[email, setEmail]= useState("");
    const[rPassword, setRPassword]=useState("");
    const[cPassword, setCPassword]= useState("");
    const api = new account();

    const handleSubmit = (e) =>{
        e.preventDefault();
        if(signUp) {
            if(rPassword !== cPassword){
                setErr("passwords do not match");
                return;
            } else {
                api.register(rUser,email,rPassword).then((res)=>{
                    console.log(res);
                }).catch((err)=>{
                    setErr(err);
                });
            }
            
        } else {
                api.login(user,password).then((res)=>{
                    console.log(res);
                    localStorage.setItem("userToken", res.data.userToken);
                }).catch(alert("error logging in"));
            }    
    }

    const toggleSignUp = (e)=>{
        e.preventDefault();
        setSignUp(prev=>!prev);
    }
    return (
        <div className="login">
            <form>
                <div className="login-container">
                    {
                    !signUp ? 
                        <>
                            <div className="login-form-field">
                                <label htmlFor="user">Username</label>
                                <input type="text" value={user} name="user" id="user" onChange={e=>setUsername(e.target.value)}/>
                            </div>
                            
                            <div className="login-form-field">
                                <label htmlFor="password"> Password</label>
                                <input type="password" value={password} name="user" id="password" onChange={e=>setPassword(e.target.value)}/>
                            </div>
                        </>
                    :
                        <>
                            {err?<p>{err}</p>:''}
                            <div className="login-form-field">
                                <label htmlFor="user">Username</label>
                                <input type="text" value={rUser} name="rUser" id="rUser" onChange={e=>setRUsername(e.target.value)}/>
                            </div>
                            <div className="login-form-field">
                                <label htmlFor="email">Email</label>
                                <input type="text" value={email} name="email" id="email" onChange={e=>setEmail(e.target.value)}/>
                            </div>
                            <div className="login-form-field">
                                <label htmlFor="rPassword">Password</label>
                                <input type="password" value={rPassword} name="rPassword" id="rPassword" onChange={e=>setRPassword(e.target.value)}/>
                            </div>
                            <div className="login-form-field">
                                <label htmlFor="cPassword">Confirm Password</label>
                                <input type="password" value={cPassword} name="cPassword" id="cPassword" onChange={e=>setCPassword(e.target.value)}/>
                            </div>  
                        </>
                    }
                    <button type="submit" onClick={handleSubmit}>{signUp ? "Register":"Login"}</button>
                    <button onClick={toggleSignUp}>{signUp ? "login instead":"sign up"}</button>
                </div>
            </form>
        </div>
    )
}
export default Login;