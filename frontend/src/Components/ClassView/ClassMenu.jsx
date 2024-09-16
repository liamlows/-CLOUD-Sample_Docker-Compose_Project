import { getAllCourses, getClasses } from "../../APIFolder/loginApi";
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import Add from "@mui/icons-material/Add";

export const ClassMenu = () => {
  const [classes, setClasses] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    getClasses().then(res => {
      setClasses(...res)
    })
  }, []);
  const goToCourseAdd = () => {
    navigate('/classes/enrollment');
  }

  //TODO: put nav bar in, data intergration
  return <section className="ClassesMenu">
    <Button variant="contained" className="bg-success" onClick={() => goToCourseAdd()} endIcon={<Add />}>Add Class</Button>
    
  </section>
};