import { useNavigate } from "react-router-dom"
import ReactDOM from "react-dom";
import React from "react";
import Button from "@mui/material/Button";

export const GenericButton = ({ label, click}) => {
    const navigate = useNavigate();
    const path = click;
    return <div className="form-group">
        <Button type="button" onClick={() => path && navigate(path) }  variant="contained" color="success">{ label }</Button>
</div>
}
