import React, { useContext, useState } from 'react';
import ProdSelectContext from '../../ProdSelectContext';
import iconSizes from '../../../../styles/IconSizes';
import appColors from '../../../../styles/AppColors';

import { Box } from '@material-ui/core';

function MarketCard(props) {
  // const history = useHistory();
  // const goToCart = () => history.push("/cart");
  const [isClicked, setClicked] = useState(false);

  const context = useContext(ProdSelectContext);

  function gotClicked() {
    setClicked(!isClicked);
    if (context.newWeekDay.length === 0) {
      // console.log(JSON.parse(props.hour),"here");
      var obj = JSON.parse(props.hour);
      var arr = [];
      for (const property in obj) {
        // console.log(property, obj[property][0]);
        if (
          !(obj[property][0] === '00:00:00' && obj[property][1] === '00:00:00')
        ) {
          arr.push(property);
        }
      }
      // console.log(arr);
      context.setWeekDay(arr);
    } else {
      context.setWeekDay([]);
    }
  }

  return (
    <Box
      mb={1}
      m={0.5}
      p={0.5}
      width="100%"
      style={{
        borderStyle: 'solid',
        borderWidth: '1px',
        borderRadius: '10px',
        borderColor: isClicked ? appColors.primary : appColors.componentBg,
        cursor: 'pointer',
      }}
    >
      <Box display="flex" justifyContent="center" onClick={gotClicked}>
        <img
          width={iconSizes.filter}
          height={iconSizes.filter}
          src={props.image}
          alt=""
        />
      </Box>
      <div style={{ width: '100%', fontSize: 12, textAlign: 'center' }}>
        {props.businessName}
      </div>
    </Box>
  );
}

export default MarketCard;
