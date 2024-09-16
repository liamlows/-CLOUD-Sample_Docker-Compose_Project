import { Button } from "@mui/material"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"



export const NoPages = () => {

    const navigate = useNavigate()


    return <div>
        <div className="col-12">
            <img className="col-4 m-5" src="https://i.imgur.com/AEpS8AD.png" />
        </div>
        
        <Button varient="contained" className="" onClick={() => navigate('/')}>Homepage</Button>
    </div>
}