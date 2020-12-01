import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function AlertDialog(props) {
  const [open, setOpen] = React.useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  const handleYes = () => {
    props.onYes();
  };

  const handleNo = () => {
    props.onNo();
  };

  return (
    <div>
      <Dialog
        open={true}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {props.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNo} color="primary">
            {props.noText}
          </Button>
          <Button onClick={handleYes} color="primary" autoFocus>
            {props.yesText}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
