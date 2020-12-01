import React, { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import appColors from '../../../styles/AppColors';
import Paper from '@material-ui/core/Paper';
import blankImg from '../../../images/blank_img.svg';
import storeContext from '../../storeContext';
import axios from 'axios';
//this part for Material UI
const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    backgroundColor: appColors.componentBg,
    borderTopLeftRadius: 25,
  },
  imageContainer: {
    width: '80%',
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
  uploadBtn: {
    width: '70%',
    height: '40px',
    backgroundColor: 'white',
    color: '#FF8500',
    fontWeight: 'bold',
    border: '1px solid #E5E5E5',
    borderRadius: '10px',
    textAlign: 'center',
    margin: '50px auto 20px auto ',
    alignSelf: 'center',
    verticalAlign: 'center',
    overflow: 'hidden',
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
  },
  sendBtn: {
    backgroundColor: '#FF8500',
    color: 'white',
    fontSize: '20px',
    textAlign: 'center',
  },
  ml: {
    marginLeft: '20px',
  },
});

//TODO: reformat and fix spelling
const RefundTab = () => {
  const { profile } = useContext(storeContext);
  const [windowHeight, setWindowHeight] = React.useState(window.innerHeight);
  const [imageUpload, setImageUpload] = useState({
    file: null,
    path: blankImg,
  });
  const [userEmail, setUserEmail] = useState(profile.email);
  const [returnDesc, setReturnDesc] = useState('');
  const classes = useStyles();

  const handleImgChange = (e) => {
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

  const submitRefund = async () => {
    let formUpload = new FormData();
    if (imageUpload.file) {
      formUpload.append('email', userEmail);
      formUpload.append('note', returnDesc);
      formUpload.append('item_photo', imageUpload.file);
      try {
        let res = await axios.post(
          'https://tsx3rnuidi.execute-api.us-west-1.amazonaws.com/dev/api/v2/Refund',
          formUpload,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        console.log('Upload success: ', res);
        reset();
      } catch (err) {
        console.log(err);
      }
    }
  };
  return (
    <Paper className={classes.root} style={{ height: windowHeight + 100 }}>
      <div className={classes.imageContainer}>
        <img
          className={classes.image}
          src={imageUpload.path}
          alt="Please choose a image"
        />
      </div>
      {/* <div class='upload-btn-wrapper'>
        <button class='btn'>Upload a file</button>
        <input type='file' name='imageUpload' onChange={handleImgChange} />
      </div> */}
      <div className={classes.uploadBtn}>
        Choose a Photo from Gallery
        <input
          type="file"
          onChange={handleImgChange}
          className={classes.chooseImg}
        />
      </div>
      <div>
        <div className={classes.easyPeasy}>
          <h3 style={{ textAlign: 'center' }}>
            Easy Peasy Return Instructions
          </h3>
          <p>1. Take a picture of what you want to return.</p>
          <p>2. Enter your email address and a note (required)</p>
          <p>3. Press send</p>
          <p>
            We'll either add your items to our next delivery or issue you a
            coupon code for your nex order! Tell us if you have a preference.
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
    </Paper>
  );
};

export default RefundTab;
