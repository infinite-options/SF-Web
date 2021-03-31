import React from 'react';

import {AdminFarmContext} from '../AdminFarmContext';

import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';

const btnWidth = 260;

const useStyles = makeStyles((theme) => ({
  foodList: {
    border: '2px solid #3f51b5',
  },

  tablesFood: {
    width: '100%',
    textAlign: 'center',
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#3f51b5',
  },

  organicBtnLI: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing(2),
  },

  organicBtn: {
    width: btnWidth,
  },

  foodListItem: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 1fr',
    gridAutoRows: '1fr',
    margin: theme.spacing(0),
    padding: theme.spacing(1),
  },

  foodRowElTemplate: {
    border: '2px solid #3f51b5',
    margin: '0px',
    padding: theme.spacing(1),
    fontWeight: 'bold',
    color: '#3f51b5',
    height: '100%',
  },
}));

/**
 * @return {*}
 */
function CompareTable() {
  const classes = useStyles();

  const {data, display, foodSelected} =
    React.useContext(AdminFarmContext);

  const {organicFilter, setOrganicFilter} = React.useContext(AdminFarmContext);

  return ( display == 'table' ?
    <List className = {classes.foodList}>
      <ListItem>
        <Typography className = {classes.tablesFood}>
          {`Price comparison for ${foodSelected}`}
        </Typography>
      </ListItem>

      <ListItem
        className = {classes.organicBtnLI}
      >
        <Button
          className = {classes.organicBtn}
          onClick = {() => {
            setOrganicFilter(!organicFilter);
          }}
          style = {{
            color: 'white',
            backgroundColor: organicFilter ?
              '#757de8' : 'rgba(153, 102, 255, 1)',
          }}
          variant = 'outlined'
        >
          Toggle organic Filter
        </Button>
      </ListItem>

      <ListItem className = {classes.foodListItem}>
        <Typography className = {classes.foodRowElTemplate}>
          Item&apos;s Market Name
        </Typography>

        <Typography className = {classes.foodRowElTemplate}>
          Food Market
        </Typography>

        <Typography className = {classes.foodRowElTemplate}>
          Item&apos;s Price at Food Market
        </Typography>

        <Typography className = {classes.foodRowElTemplate}>
          Price Delta
        </Typography>
      </ListItem>

      {/* {list} */}
      {data}
    </List> : ''
  );
}

export default CompareTable;
