/* eslint-disable */
import React from 'react';

import {AdminFarmContext} from '../AdminFarmContext';
import CompareGraph from './CompareGraph';
import CompareTable from './CompareTable';

import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';

const btnWidth = 260;

const useStyles = makeStyles((theme) => ({
  priceCompareContainer: {
    display: 'flex',
    flexDirection: 'column',
    margin: theme.spacing(1),
  },

  graphTypeBtnBar: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  graphTypeBtn: {
    width: btnWidth,
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },

  buttonBar: {
    display: 'flex',
    justifyContent: 'center',
  },

  dataInfoFilter: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },

  foodListItem: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 1fr',
    flexDirection: 'row',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    padding: theme.spacing(1),
  },
  
  foodRowElOrg: {
    border: '2px solid #3f51b5',
    margin: '0px',
    padding: theme.spacing(1),
    color: '#3f51b5',
    height: '100%',
  },

  foodRowElInorg: {
    border: '2px solid #f44336',
    margin: '0px',
    padding: theme.spacing(1),
    color: '#f44336',
    height: '100%',
  },

  margin: {
    background: '#EEEEEE',
    width: btnWidth,
    marginBottom: theme.spacing(1),
  },

  formControl: {
    margin: theme.spacing(1),
    width: btnWidth,
  },

  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

/**
 * @param {*} setFoodMap
 * @param {*} setFoodArr
 */
function fetchFoodsEndpoint(setFoodMap, setFoodArr) {
  fetch(`https://kfc19k33sc.execute-api.us-west-1.amazonaws.com/dev/api/v2/priceComparison`, {
    method: 'GET',
  })
      .then((response) => {
        if (!response.ok) {
          throw response;
        }
        return response.json();
      })
      .then((json) => {
        const foodMappings = {};
        const foodsComps = json.result;
        const foodArr = [];
        const noDuplicates = {};

        // console.warn('FoodsComp');
        // console.log(foodsComps);

        for (const foodComp of foodsComps) {
          if (noDuplicates[foodComp.item_name] == undefined) {
            foodArr.push(foodComp.item_name);
            noDuplicates[foodComp.item_name] = 0;
          }

          if (foodMappings[foodComp.item_name] == undefined) {
            foodMappings[foodComp.item_name] = {};
            foodMappings[foodComp.item_name]['farm_price'] = foodComp.farm_price;
          }

          if (foodMappings[foodComp.item_name]['stores'] == undefined) {
            foodMappings[foodComp.item_name]['stores'] = [];
          }

          foodMappings[foodComp.item_name]['stores'].push([foodComp.market_name,
            foodComp.market_item_name, foodComp.market_price]); 
        }

        foodArr.sort();

        // console.warn('Food Mappings log');
        // console.log(foodMappings);

        setFoodMap(foodMappings);
        setFoodArr(foodArr);
      })
      .catch((error) => {
        console.error(error);
      });
}

/**
 * @return {object} JSX
 */
function PriceCompare() {
  /* eslint-disable */
  const isInitialMount = React.useRef(true);

  const [foodMap, setFoodMap] = React.useState({});
  const [foodArr, setFoodArr] = React.useState([]);
  const [data, setData] = React.useState(null);
  const [foodSelected, setFoodSelected] = React.useState(null);
  const [display, setDisplay] = React.useState('graph');
  const [organicFilter, setOrganicFilter] = React.useState(false);

  const classes = useStyles();

  React.useEffect(() => {
    fetchFoodsEndpoint(setFoodMap, setFoodArr);
  }, ([]));

  React.useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      updateData(display);
    }
  }, ([organicFilter]));

  const foodInputted = (event) => {
    console.warn('event');
    console.log(event);
    // console.warn('food selected target');
    // console.log(event.target);
    // console.warn('food selected target value');
    // console.log(event.target['value']);
    setFoodSelected(event.target.value);
  };

  const updateData = (displayType) => {
    if (foodSelected == null || foodSelected == "") {
      console.error(`Food selected has truthy value of false. Exiting updateData().`);
      return;
    }

    let caseCorrectedFood = foodSelected.replace(/\s{2,}/g, ' ')
      .replace(/(^\s)|(\s$)/g,'').split(" ");

    for (let i = 0; i < caseCorrectedFood.length; i++) {
      if (caseCorrectedFood[i].length) {
        caseCorrectedFood[i] = caseCorrectedFood[i][0].toUpperCase() +
          caseCorrectedFood[i].substring(1, caseCorrectedFood[i].length).toLowerCase();
      }
    }

    // User-selected food has been fixed to camel-case
    // because that's how the items are stored in the
    // database
    caseCorrectedFood = caseCorrectedFood.join(' ');

    if (foodMap[caseCorrectedFood] == undefined) {
      console.error(`${foodSelected} does not have competitive value.`);
      alert(`${foodSelected} does not have competitive value.`);
      return;
    }

    const farmPrice = foodMap[caseCorrectedFood]['farm_price'];
    const stores = [];
    const priceData = [];

    for (const storeInfo of foodMap[caseCorrectedFood]['stores']) {
      stores.push(storeInfo[0]);
      priceData.push((storeInfo[2] - farmPrice).toPrecision(2));
    }

    // console.log(stores);
    // console.log(priceData);

    if (displayType == 'graph') {
      setData({labels: stores, datasets: [
          {
            label: caseCorrectedFood + ' Price Differential (MarketPrice - FarmPrice)',
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1,
            data: priceData,
          },
        ]}
      );
    } else if (displayType == 'table') {
      const list = [];

      let keyCount = 0;

      for (const storeInfo of foodMap[caseCorrectedFood]['stores']) {
        let priceDelta = (storeInfo[2] - foodMap[caseCorrectedFood]['farm_price']);    

        priceDelta = priceDelta < 0 ? `-$${(priceDelta * -1).toFixed(2)}` :
          `$${priceDelta.toFixed(2)}`;

        const foodIsOrganic = storeInfo[1].toUpperCase().includes('ORGANIC');

        const foodClass = foodIsOrganic ?
          classes.foodRowElOrg : classes.foodRowElInorg;

        if (foodIsOrganic || !organicFilter) {
          list.push(
              <ListItem
                className = {classes.foodListItem}
                key = {`key${keyCount++}`}
              >
                <Typography className = {foodClass}>
                  {storeInfo[1]}
                </Typography>

                <Typography className = {foodClass}>
                  {storeInfo[0]}
                </Typography>

                <Typography className = {foodClass}>
                  {`$${storeInfo[2]}`}
                </Typography>

                <Typography className = {foodClass}>
                  {priceDelta}
                </Typography>
              </ListItem>,
          );
        }
      }

      // console.warn('list');
      // console.log(list);
      setData(list);
    }

    setDisplay(displayType);
    setFoodSelected(caseCorrectedFood);
  };

  const keyPressed = (e) => {
    if (e.keyCode == 13) {
      updateData(display);
    }
  };

  return (
    <Box className = {classes.priceCompareContainer}>
      <Box className = {classes.dataInfoFilter}>
        <FormControl className={classes.formControl}>
          <InputLabel
            htmlFor="food-native-simple"
            onKeyDown={keyPressed}
          >
            Enter food
          </InputLabel>
          <Select
            native
            value={foodSelected}
            onChange = {foodInputted}
            input={<Input id="food-native-simple" />}
          >
            <option value = {""} />
            {
              foodArr.map((food) =>
                <option value = {food}>{food}</option>
              )
            }
          </Select>
        </FormControl>

        <Box className = {classes.graphTypeBtnBar}>
          <Button
            className = {classes.graphTypeBtn}
            onClick = {() => updateData('graph')}
            variant = 'contained'
          >
            Graph
          </Button>

          <Button
            className = {classes.graphTypeBtn}
            onClick = {() => updateData('table')}
            variant = 'contained'
          >
            Table
          </Button>
        </Box>
      </Box>

      <AdminFarmContext.Provider value = {{
        foodMap, foodSelected, data,
        display, organicFilter, setOrganicFilter,
      }}>
        <CompareGraph />
        <CompareTable />
      </AdminFarmContext.Provider>
    </Box>
  );
}

export default PriceCompare;
