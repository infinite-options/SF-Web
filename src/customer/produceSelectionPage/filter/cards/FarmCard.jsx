import React, { useContext, useState } from 'react';
import prodSelectContext from '../../ProdSelectContext';
import appColors from '../../../../styles/AppColors';
import iconSizes from '../../../../styles/IconSizes';
import { Box } from '@material-ui/core';
import FilterContext from '../FilterContext';

function FarmCard(props) {
  const filter = useContext(FilterContext);

  const [isClicked, setClicked] = useState(false);

  const produceSelect = useContext(prodSelectContext);

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
