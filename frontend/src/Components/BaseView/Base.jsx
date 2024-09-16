// Library Imports
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Component Imports
import { HomeView } from "../LoggedIn/HomeView"
import { BaseResponsiveAppBar } from "../common/BaseResponsiveAppBar"
import ErrorSnackBar from "./ErrorSnackBar"

// Method Imports

export const Base = (props) => {
    // Navigate Object
    const navigate = useNavigate();
    if (localStorage.getItem("currUser") === null)
        localStorage.setItem("currUser", "{}");

    // Component Variables

    // Initial Load
    useEffect(() => {
        console.log("Loading Base...");
    }, [props.account])

    // Conditions

    // HTML
    return <section className="baseView">
        {props.navigated == 1 && <ErrorSnackBar></ErrorSnackBar>}
        {localStorage.getItem("currUser") === "{}" && <div>
            <BaseResponsiveAppBar 
                pages={props.basePages} />
            <h1 className="mb-4">Welcome</h1>
            <h2 className="">This is the base page to be updated with logo and stuff</h2>
        </div>}
        {/*if the user is logged in*/}
        {localStorage.getItem("currUser") !== "{}" && <HomeView {...props} />}
    </section>
}
