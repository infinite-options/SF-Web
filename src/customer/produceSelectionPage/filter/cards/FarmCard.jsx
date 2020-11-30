import React, { useContext, useEffect, useState } from 'react';
import ProdSelectContext from '../../prodSelectContext';
import appColors from '../../../../styles/AppColors';
import iconSizes from '../../../../styles/IconSizes';
import { Box } from '@material-ui/core';
import FilterContext from '../FilterContext';
import storeContext from '../../../storeContext';
import { StrikethroughS } from '@material-ui/icons';

function FarmCard(props) {
  const filter = useContext(FilterContext);
  const produceSelect = useContext(ProdSelectContext);
  const store = useContext(storeContext);

  const [isClicked, setClicked] = useState(false);
  const [showCard, setShowCard] = useState(
    produceSelect.daysClicked.size == 0 ? true : false
  );

  function gotFarmClicked() {
    const newFarmsClicked = new Set(produceSelect.farmsClicked);

    if (isClicked) {
      newFarmsClicked.delete(props.id);
    } else {
      newFarmsClicked.add(props.id);
    }
    produceSelect.setFarmsClicked(newFarmsClicked);
    setClicked(!isClicked);
  }
  useEffect(() => {
    setShowCard(produceSelect.daysClicked.size == 0 ? true : false);
    for (const day in store.farmDayTimeDict[props.id]) {
      console.log('day: ', day);
      console.log('produceSelect: ', produceSelect.daysClicked);

      if (produceSelect.daysClicked.has(day)) setShowCard(true);
    }
  }, [produceSelect.daysClicked]);

  console.log('showCard: ', showCard);
  return (
    <Box
      hidden={!showCard}
      mb={1}
      m={0.5}
      p={0.5}
      width="100%"
      style={{
        borderStyle: 'solid',
        borderWidth: '1px',
        borderRadius: '10px',
        borderColor: !isClicked ? appColors.componentBg : appColors.primary,
        cursor: 'pointer',
      }}
      onClick={gotFarmClicked}
    >
      <Box display="flex" justifyContent="center">
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

export default FarmCard;
