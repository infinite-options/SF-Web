import * as React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@material-ui/core';

//TODO: Make the Dialog Box rounder
export const ConfirmationDialog = ({
  open,
  title,
  variant,
  description,
  onSubmit,
  onClose,
}) => {
  return (
    <Dialog open={open} style={{ position: 'absolute', zIndex: 10000000 }}>
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{description}</DialogContentText>
      </DialogContent>
      <DialogActions>
        {variant === 'danger' && (
          <>
            <Button color="primary" onClick={onSubmit}>
              Yes
            </Button>
            <Button color="primary" onClick={onClose} autoFocus>
              CANCEL
            </Button>
          </>
        )}

        {variant === 'info' && (
          <Button color="primary" onClick={onSubmit}>
            OK
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
