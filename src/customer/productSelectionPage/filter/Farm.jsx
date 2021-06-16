import React, { useContext } from 'react';
import ProdSelectContext from '../ProdSelectContext';
import FarmCard from './cards/FarmCard';

const FarmCategory = () => {
  const topNode = useContext(ProdSelectContext);

  function createFarmCard(props) {
    return (
      <FarmCard
        image={props.image}
        businessName={props.name}
        key={props.id}
        id={props.id}
      />
    );
  }

  // const allValidDay = daysInWeek;
  var farms = topNode.farms;
  return <React.Fragment>{farms.map(createFarmCard)}</React.Fragment>;
};

export default FarmCategory;
