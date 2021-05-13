import React from 'react';
import {useHistory} from 'react-router-dom';

import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined';
import MenuNavButton from '../../utils/MenuNavButton';
import {Box, Button, Toolbar, Typography, TextField, Avatar, Link, IconButton, Badge} from '@material-ui/core';  
import sf from '../../icon/sfnav.svg';
import {withStyles, makeStyles} from '@material-ui/core/styles';
import appColors from '../../styles/AppColors';

import useWindowsDimensions from '../WindowDimensions';

const useStyles = makeStyles((theme) => ({
    profileInfoContainer: {
        display: 'flex',
        flexDirection: 'column',
        background: appColors.componentBg,
    },

    sfImgContainer: {
        flexBasis: '1',
        flexGrow: '1',
        '&:hover': {
            cursor: 'pointer',
        },
    },

    profileContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },

    pageLabel: {
        fontSize: '20px',
        fontWeight: 'bold',
        color: 'rgb(47, 120, 127)',
        textAlign: 'left',
        textDecoration: 'underline',
        marginLeft: theme.spacing(6),
        marginTop: theme.spacing(6),
    },

    currUserInf: {
        display: 'flex',
        flexDirection: 'column',
        width: '450px',
    },

    currUserPic: {
        width: theme.spacing(12),
        height: theme.spacing(12),
    },

    resetPasswordLink: {
        textDecoration: 'underline',
        marginTop: '10px',
        '&:hover': {
            cursor: 'pointer',
        },
    },

    profInfButtonContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: theme.spacing(3),
    },

    profInfButton: {
        marginTop: theme.spacing(3),
        width: '75%',
        height: '50px',
        color: 'primary',
        background: '#e88330',
        color: 'white',
    },

    servingFreshSupportMessage: {
        // color: '#e88330',
        marginBottom: theme.spacing(12),
    },

    supportLink: {
        color: '#e88330',
        textDecoration: 'none',
    },
}));

const ColorButton = withStyles((theme) => ({
    root: {
        color: 'white',
        backgroundColor: appColors.primary,
        '&:hover': {
        backgroundColor: 'rgb(162, 91, 33)',
        },
    },
}))(Button);

function ProfileInfo() {
    const classes = useStyles();
    const history = useHistory();
    const {width} = useWindowsDimensions();

    return (
        <Box className = {classes.profileInfoContainer}>
            <Toolbar style={{backgroundColor:'#2F787F'}}>
                <Box flexBasis = {1} flexGrow = {1}>
                    <MenuNavButton style={{border:'1px solid black',color:'white'}}/>
                </Box>
                
                <Box
                    className = {classes.sfImgContainer}
                    onClick = {() => history.push('/')
                }>
                    <img style={{float:'center'}} src={sf}></img>
                </Box>
                
                <Box flexGrow = {1} flexBasis = {1} style = {{display: 'flex', justifyContent: 'flex-end', color: 'white', alignItems: 'center'}}>
                    <Typography style = {{marginRight: '20px'}}> John Doe </Typography>
                    <Button
                        variant="contained"
                        size="small"
                        color="primary"
                        style = {{marginRight: '20px'}}
                    >
                        <Typography style = {{color: 'white', fontSize: '12px', marginLeft: '5px', marginRight: '5px'}}> Log Out </Typography>
                    </Button>

                    <IconButton edge="end" className="link" onClick = {() => {
                        if (width < 1280) {
                            // setCheckingOut(true)
                            console.log("Should check out");
                        }
                        }
                    }>
                        <Badge badgeContent={1} color = "primary">
                        <ShoppingCartOutlinedIcon
                            fontSize="large"
                            key={'profile-info-shop-cart'}
                            aria-hidden="false"
                            aria-label = 'Shopping cart'
                            style = {{color: appColors.buttonText}}
                        />
                        </Badge>
                    </IconButton>
                </Box>
            </Toolbar>

            <Box className = {classes.profileContainer}>
                <Box style = {{width: '100%'}}>
                    <Typography className = {classes.pageLabel}>
                        Profile
                    </Typography>
                </Box>
                

                <Box className = {classes.currUserInf}>
                    <Box style = {{display: 'flex', justifyContent: 'center'}}>
                        <Avatar src = {"no-link"} className = {classes.currUserPic}> Temp </Avatar>
                    </Box>
                    <TextField label = 'John'/>
                    <TextField label = 'Doe'/>
                    <TextField label = '(123)456-7891'/>
                    <TextField label = 'johndoe@gmail.com'/>

                    <Link className=  {classes.resetPasswordLink}>
                        Reset Password
                    </Link>

                    <TextField label = 'Street Address'/>
                    <TextField label = 'Appt number'/>

                    <Box style = {{display:  'flex'}}>
                        <TextField label = 'City' style = {{marginRight: "30px"}}/>
                        <TextField label = 'State' style = {{marginRight: "30px"}}/>
                        <TextField label = 'Zip'/>
                    </Box>

                    <Box className = {classes.profInfButtonContainer}>
                        <ColorButton variant = 'contained' className = {classes.profInfButton}>
                            Save Changes
                        </ColorButton>

                        <ColorButton variant = 'contained' className = {classes.profInfButton}>
                            Log Out
                        </ColorButton>
                    </Box>

                    <Typography className = {classes.servingFreshSupportMessage}>
                        Please contact <a href = "google.com" className = {classes.supportLink}>support@servingfresh.me</a> to 
                        change your First Name, Last Name
                        or Email Address.
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}

export default ProfileInfo;