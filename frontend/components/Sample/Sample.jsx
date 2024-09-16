import React, { useState } from 'react';
import { withRouter } from "react-router-dom";
import './Sample.css';

export default class Sample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

        // set all of the default {this} variables here
        this.state.variable = "";
    }

    componentDidMount() {
        // do stuff if the component successfully mounts
        // write other methods in this class that you will then call here
        // an example could be a method that is called from a central class
        // that accesses the backend. I.E. this.centralClass.getUser(parameter)
        // for example. And you would set this.centralClass in the constructor. 
    }

    handleSubmitClick = (e) => {
        // do something when the submit event occurs
    }

    handleChange(e) {
        // handle state changes
        this.setState({ value: e.target.value });
    }

    render() {
        // render this page with the specified html
        return(
            <div></div>
        )
    }
}