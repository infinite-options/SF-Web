import React, { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Button';
import { useConfirmation } from '../../../services/ConfirmationService';
import appColors from '../../../styles/AppColors';
import blankImg from '../../../images/blank_img.svg';
import storeContext from '../../storeContext';
import axios from 'axios';
//this part for Material UI
const useStyles = makeStyles({
  root: {
    backgroundColor: appColors.componentBg,
    borderTopLeftRadius: 25,
  },
  imageContainer: {
    width: '50%',
    height: '50%',
    margin: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    display: 'block',
  },
  upload_btn_wrapper: {
    position: 'relative',
    overflow: 'hidden',
    display: 'inline-block',
  },
  chooseImg: {
    opacity: '1',
  },
  easyPeasy: {
    textAlign: 'left',
    paddingLeft: '10%',
  },
  sendEmail: {
    width: '70%',
    height: '40px',
    backgroundColor: 'white',
    color: 'black',
    fontSize: '15px',
    border: '1px solid #E5E5E5',
    borderRadius: '10px',
    textAlign: 'left',
    margin: '5px',
    textIndent: '10px',
    fontFamily: 'Arial',
    resize: 'vertical',
  },
  sendBtn: {
    backgroundColor: '#FF8500',
    color: 'white',
    fontSize: '20px',
    textAlign: 'center',
  },
});

// DONE: check auto-load email
// DONE: test if works completely
const RefundTab = () => {
  const { profile } = useContext(storeContext);
  const confirm = useConfirmation();
  const [windowHeight, setWindowHeight] = React.useState(window.innerHeight);
  const [imageUpload, setImageUpload] = useState({
    file: null,
    path: blankImg,
  });
  const [userEmail, setUserEmail] = useState(profile.email);
  const [returnDesc, setReturnDesc] = useState('');
  const classes = useStyles();

  React.useEffect(() => {
    setUserEmail(profile.email);
  }, [profile.email]);

  const handleImgChange = (e) => {
    if (e.target.files > 0)
      setImageUpload({
        file: e.target.files[0],
        path: URL.createObjectURL(e.target.files[0]),
      });
  };

  const reset = () => {
    setImageUpload({ file: null, path: blankImg });
    setReturnDesc('');
    setUserEmail(profile.email);
  };

  // DONE: Add Dialogue on completion
  const submitRefund = async () => {
    let formUpload = new FormData();
    if (imageUpload.file) {
      formUpload.append('email', userEmail);
      formUpload.append('note', returnDesc);
      formUpload.append('item_photo', imageUpload.file);
      try {
        let res = await axios.post(
          process.env.REACT_APP_SERVER_BASE_URI + 'Refund',
          formUpload,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        console.log('Upload success: ', res);
        reset();
        // TODO: Check message with Prashant
        confirm({
          variant: 'info',
          title: 'Refund Submitted',
          description:
            "We've received your refund request and we'll be back in touch shortly.",
        })
          .then(() => {})
          .catch(() => {});
      } catch (err) {
        console.log(err);
      }
    }
  };
  return (
    <>
      <div className={classes.imageContainer}>
        <img className={classes.image} src={imageUpload.path} alt="refund" />
      </div>
      <Box my={4}>
        <Button
          onChange={handleImgChange}
          variant="outlined"
          color="primary"
          component="label"
          fullWidth
          style={{
            borderColor: appColors.border,
            backgroundColor: 'white',
            width: '300px',
          }}
        >
          Upload File
          <input
            onChange={handleImgChange}
            type="file"
            accept="image/*"
            hidden
          />
        </Button>
      </Box>
      <div>
        <div className={classes.easyPeasy}>
          <h3 style={{ textAlign: 'center' }}>
            Easy Peasy Return Instructions
          </h3>
          <p>
            1. Take a picture of what you want to return (not required for
            missing items)
          </p>
          <p>2. Enter your email address and a short note (required)</p>
          <p>3. Press send</p>
          <p>
            We'll either add your items to our next delivery or issue you a
            coupon code for your next order! Tell us if you have a preference.
            Easy peasy!
          </p>
        </div>
        <div>
          <input
            className={classes.sendEmail}
            type="text"
            value={userEmail}
            placeholder="User Email"
            onChange={(e) => setUserEmail(e.target.value)}
          />
          <textarea
            className={classes.sendEmail}
            type=""
            placeholder="Return Description"
            value={returnDesc}
            onChange={(e) => setReturnDesc(e.target.value)}
          />
          <button
            className={classes.sendEmail + ' ' + classes.sendBtn}
            onClick={submitRefund}
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
};

export default RefundTab;
