
// Library Imports
import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Cookies from 'js-cookie';

// Component Imports
import './App.css';
import { SignUpPage } from './Components/Login/SignUpPage';
import { LoginPage } from './Components/Login/LoginPage';
import { Base } from './Components/BaseView/Base';
import { Profile } from './Components/Profiles/Profile';
import { UserSearch } from './Components/Profiles/UserSearch';
import { FriendsList } from './Components/Profiles/FriendsList';
import { ClassMenu } from './Components/ClassView/ClassMenu';
import { NoPages } from './Components/NoPages';
import { AddClasses } from './Components/ClassView/AddClasses';
import { ClassProfile } from './Components/ClassView/ClassProfile';

import { Waitlist } from './Components/AdminView/Waitlist';

// Method Imports
import { getAccountbyId } from './APIFolder/loginApi';

// React functional component
function App() {
  // ENTER YOUR EC2 PUBLIC IP/URL HERE
  const ec2_url = ''
  // CHANGE THIS TO TRUE IF HOSTING ON EC2, MAKE SURE TO ADD IP/URL ABOVE
  const ec2 = false;
  // USE localhost OR ec2_url ACCORDING TO ENVIRONMENT
  const url = ec2 ? ec2_url : 'localhost'

  // Component Variables
  const [cName, setCName] = useState('dn');
  //using to alert when navigated back to home page ( for when not signed in as user)
  const [navigated, setNavigated] = useState(false);
  //Nav bar now made available from all views (at least thats the goal)
  const [loggedInPages] = useState([
    { label: 'Dashboard', route: `/` },
    { label: 'Classes', route: `/classes` },
    { label: 'Friends', route: `/users/:account_id/friends` },
  ]);
  const [basePages] = useState([
    { label: 'Info', route: `/info` },
    //Add more paths here if you want more?
  ]);
  const [settings] = useState([
    // { label: 'Public Profile', route: `/users/${account.id}` }, Keep out until have an account id confirmed
    // { label: 'Account', route: `/accounts/${account.id}` }, 
    { label: 'Public Profile', route: `/users` },
    { label: 'Logout', route: '/signout' }
  ]);

  // Initial Load
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    localStorage.setItem("currUser", "{}");
    console.log("Initial State Set");

    let account_id = Cookies.get("account_id");

    if (account_id) {
      setNavigated(false);
      getAccountbyId(account_id)
        .then(account => {
          if (account) {
            console.log("account found");
            console.log(account);
            localStorage.setItem("currUser", JSON.stringify(account));
          }
          else {
            console.log("User is null after request");
            localStorage.setItem("currUser", "{}");
          }
          setCName(' ');
        })
    }
    else {
      console.log("No cookie");
      localStorage.setItem("currUser", "{}");
      setCName(' ');
    }
  }, []);

  // Conditions

  // Component Methods

  // HTML
  return (
    <div className={`App ${cName}`} >
      <BrowserRouter>
        <Routes>
          {/* TODO: Add nav bar at top to have easy access to tabs??? 
          Probably Easiest to create react component then add to each view independently.
          May want to have 3 different nav bars for the different users and 
          check what type of user when loading and return different based on which type user is...Seems decently simple to implement */}

          {/* TODO: Integrate Material UI */}
          <Route path='/' element={<Base
            basePages={basePages}
            loggedInPages={loggedInPages}
            settings={settings}
            navigated={navigated} />} />

          {/* TODO: Make home page nicer and more professional. */}
          <Route path='/login' element={<LoginPage
            setNavigated={x => setNavigated(x)} />} />

          {/* <Route path='/loggedIn' element={<LoggedIn />} /> */}
          {/* TODO: Classes tab */}
          {/* TODO: Go directly to "Classes display" with  */}
          {/* TODO: When logged in need to be able to view all classes */}
          {/* TODO: Currently Enrolled classes */}

          {/* TODO: View Profile (Probably later on) */}
          {/* TODO: Specific Classes (Probably later on) */}
          {/* TODO: Account Settings (Probably later on) */}


          <Route path="/users/:account_id/friends" element={<FriendsList
            pages={loggedInPages}
            settings={settings}
            setNavigated={x => setNavigated(x)} />} />

          <Route path="/users" element={<UserSearch
            pages={loggedInPages}
            settings={settings}
            setNavigated={x => setNavigated(x)} />} />

          <Route path='/signup' element={<SignUpPage
            setNavigated={x => setNavigated(x)} />} />

          <Route path="/users/:account_id" element={<Profile
            pages={loggedInPages}
            settings={settings}
            setNavigated={x => setNavigated(x)} />} />




          {/* Classes loading */}
          <Route path="/classes" element={<ClassMenu />} />
          <Route path="/classes/enrollment" element={<AddClasses
            pages={loggedInPages}
            settings={settings}
            setNavigated={x => setNavigated(x)} />} />
          <Route path="/classes/:course_id" element={<ClassProfile
            pages={loggedInPages}
            settings={settings}
            setNavigated={x => setNavigated(x)} />} />

          {/* Admin loading */}
          <Route path="/waitlist/:course_id" element={<Waitlist
          pages={loggedInPages}
          settings={settings}
          setNavigated={x => setNavigated(x)}/>} />

          <Route path="*" element={<NoPages />} />


        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
