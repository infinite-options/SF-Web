import React from 'react';
import MenuNavButton from '../../utils/MenuNavButton';
import {Box, Button, Toolbar, Typography, TextField, Avatar, Link} from '@material-ui/core';  
import sf from '../../icon/sfnav.svg';
import {withStyles, makeStyles} from '@material-ui/core/styles';
import { green, purple } from '@material-ui/core/colors';
// Blank comment for committing empty branch

const useStyles = makeStyles((theme) => ({
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

    profInfButtonContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },

    profInfButton: {
        marginTop: theme.spacing(3),
        width: '75%',
        height: '60px',
        color: 'primary',
        background: '#e88330',
        color: 'white',
    },
}));

const ColorButton = withStyles((theme) => ({
    root: {
        color: 'white',
        backgroundColor: '#e88330',
        '&:hover': {
        backgroundColor: 'rgb(162, 91, 33)',
        },
    },
}))(Button);

function ProfileInfo() {
    const classes = useStyles();
    return (
        <Box style = {{display: 'flex', flexDirection: 'column'}}>
            <Toolbar style={{backgroundColor:'#2F787F'}}>
                <MenuNavButton style={{border:'1px solid black',color:'white'}}/>
                
                <Box flexGrow={1} ><div style={{left:'30%'}}><img style={{float:'center'}} src={sf}></img></div></Box>
                
                <Box>
                    <Button
                        variant="contained"
                        size="small"
                        color="primary"
                    >
                        Login
                    </Button>
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

                    <Link style = {{textDecoration: 'underline', marginTop: '10px'}}>Reset Password</Link>

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
                </Box>
            </Box>
        </Box>
    );
}

export default ProfileInfo;