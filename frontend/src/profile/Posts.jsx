import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export const Posts = ()=> {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
        <Grid container spacing={2}>
            <Grid item xs={3}>
                <Button onClick={handleClickOpen}>
                    <img className="post" src="https://cdn.pixabay.com/photo/2013/07/18/20/26/sea-164989_1280.jpg"/>
                </Button>
            </Grid>
            <Grid item xs={3}>
                <Button onClick={handleClickOpen}>
                    <img className="post" src="https://cdn.pixabay.com/photo/2016/10/18/21/22/beach-1751455__340.jpg"/>
                </Button>
            </Grid>
            <Grid item xs={3}>
                <Button onClick={handleClickOpen}>
                    <img className="post" src="https://cdn.pixabay.com/photo/2012/08/06/00/53/bridge-53769__340.jpg"/>
                </Button>
            </Grid>
            <Grid item xs={3}>
                <Button onClick={handleClickOpen}>
                    <img className="post" src="https://cdn.pixabay.com/photo/2018/08/12/15/29/hintersee-3601004__340.jpg"/>
                </Button>
            </Grid>
            <Grid item xs={3}>
                <Button onClick={handleClickOpen}>
                    <img className="post" src="https://cdn.pixabay.com/photo/2014/08/15/11/29/beach-418742__340.jpg"/>
                </Button>
            </Grid>
            <Grid item xs={3}>
                <Button onClick={handleClickOpen}>
                    <img className="post" src="https://cdn.pixabay.com/photo/2013/10/09/02/27/lake-192990__340.jpg"/>
                </Button>
            </Grid>
            <Grid item xs={3}>
                <Button onClick={handleClickOpen}>
                    <img className="post" src="https://cdn.pixabay.com/photo/2013/04/03/12/05/tree-99852__340.jpg"/>
                </Button>
            </Grid>
            <Grid item xs={3}>
                <Button onClick={handleClickOpen}>
                    <img className="post" src="https://cdn.pixabay.com/photo/2017/08/04/17/56/dolomites-2580866__480.jpg"/>
                </Button>
            </Grid>
            <Grid item xs={3}>
                <Button onClick={handleClickOpen}>
                    <img className="post" src="https://cdn.pixabay.com/photo/2016/06/20/03/15/pier-1467984__480.jpg"/>
                </Button>
            </Grid>
        </Grid>
        
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          Modal title
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
            dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
            consectetur ac, vestibulum at eros.
          </Typography>
          <Typography gutterBottom>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur et.
            Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.
          </Typography>
          <Typography gutterBottom>
            Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus
            magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec
            ullamcorper nulla non metus auctor fringilla.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Save changes
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}