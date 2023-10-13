import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import './profile.css';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { Posts } from './Posts';


export const ExampleUser = () => {
    function stringToColor(string) {
        let hash = 0;
        let i;
        for (i = 0; i < string.length; i += 1) {
          hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }
      
        let color = '#';
      
        for (i = 0; i < 3; i += 1) {
          const value = (hash >> (i * 8)) & 0xff;
          color += `00${value.toString(16)}`.slice(-2);
        }
      
        return color;
      }
      
      function stringAvatar(name) {
        return {
          sx: {
            bgcolor: stringToColor(name),
            height: 80,
            width: 80
          },
          children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
        };
      }

    return(<div className="profileContainer">
        <br/>
        <h2 className="userHead">
            username!!
        </h2>
        <br/>
        <Grid container spacing={2}>
            <Grid item xs={3}>
                <Avatar {...stringAvatar('Kate Bouis')} />
            </Grid>
            <Grid item xs={3}>
                <p><span className="colorChange">20</span> <br></br>posts</p>
            </Grid>
            <Grid item xs={3}>
                <p><span className="colorChange">200</span> <br></br>following</p>
            </Grid>
            <Grid item xs={3}>
                <p><span className="colorChange">2000</span> <br></br>followers</p>
            </Grid>
        </Grid>
        <br/>
        <h4 className="bioName">Bio Name</h4>
        <br/>
        <div className="bio"> Bioooo </div>
        <br></br><br></br>
        <Button variant="outlined">Follow</Button>

        {/* in lab, ask how to make card pop up on click without changing link and while keeping profile in background*/}
        {/* possible option of making it dialog instead of card but still figure out how to make it appear */}
        <br/><br/>
        <Posts/>
        </div>

    );
}