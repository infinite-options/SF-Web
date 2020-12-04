import React, { useContext, useEffect, useState } from 'react';
import ProdSelectContext from '../../ProdSelectContext';
import appColors from '../../../../styles/AppColors';
import iconSizes from '../../../../styles/IconSizes';
import { Box } from '@material-ui/core';
import FilterContext from '../FilterContext';
import storeContext from '../../../storeContext';
import { StrikethroughS } from '@material-ui/icons';

function FarmCard(props) {
  const filter = useContext(FilterContext);
  const productSelect = useContext(ProdSelectContext);
  const store = useContext(storeContext);

  const [isClicked, setIsClicked] = useState(false);
  const [isClearFarmClicks, setIsClearFarmClicks] = useState(
    productSelect.dayClicked === '' ? true : false
  );
  const [showCard, setShowCard] = useState(
    productSelect.dayClicked === '' ? true : false
  );

  function gotFarmClicked() {
    const newFarmsClicked = new Set(productSelect.farmsClicked);

    if (isClicked) {
      newFarmsClicked.delete(props.id);
    } else {
      newFarmsClicked.add(props.id);
    }
    productSelect.setFarmsClicked(newFarmsClicked);
    setIsClicked(!isClicked);
  }

  // TODO texting: disappearing farm bug
  // TODO testing: day click will reset farms
  useEffect(() => {
    const isNoDayClicked = productSelect.dayClicked === '';
    let _showCard = isNoDayClicked ? true : false;
    setIsClearFarmClicks(isNoDayClicked ? true : false);

    if (!isNoDayClicked && isClearFarmClicks) {
      productSelect.setFarmsClicked(new Set());
      setIsClicked(false);
      setIsClearFarmClicks(true);
    }

    if (props.id in store.farmDaytimeDict)
      store.farmDaytimeDict[props.id].forEach((daytime) => {
        if (productSelect.dayClicked === daytime) _showCard = true;
      });
    setShowCard(_showCard);
  }, [productSelect.dayClicked]);

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
