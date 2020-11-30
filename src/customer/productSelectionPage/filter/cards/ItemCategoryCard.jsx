import React, {useContext, useEffect, useState} from "react";
import ProdSelectContext from "../../prodSelectContext";
import iconSizes from "../../../../styles/IconSizes";
import {Box} from "@material-ui/core";

const ItemCategoryItem = props => {
  const productSelect = useContext(ProdSelectContext);

  const [isClicked, setIsClicked] = useState(false);
  const [isShown, setIsShown] = useState(
    productSelect.farmsClicked.size > 0 || productSelect.daysClicked.size > 0
  );

  function onCategoryClicked() {
    const newCategoriesClicked = new Set(productSelect.categoriesClicked);

    if (isClicked) {
      newCategoriesClicked.delete(props.type);
    } else {
      newCategoriesClicked.add(props.type);
    }
    console.log("newCategoriesClicked: ", newCategoriesClicked);
    productSelect.setCategoriesClicked(newCategoriesClicked);
    setIsClicked(!isClicked);
  }

  useEffect(() => {
    setIsShown(
      productSelect.farmsClicked.size > 0 || productSelect.daysClicked.size > 0
    );
  }, [productSelect.farmsClicked, productSelect.daysClicked]);

  return (
    <Box hidden={!isShown} mb={1} m={0.5} p={0.5} width='100%'>
      <Box
        display='flex'
        justifyContent='center'
        onClick={onCategoryClicked}
        style={{cursor: "pointer"}}
      >
        <img
          width={iconSizes.filter}
          height={iconSizes.filter}
          src={isClicked ? props.onAsset : props.offAsset}
          alt={props.altName}
        />
      </Box>
      <div style={{width: "100%", fontSize: 12, textAlign: "center"}}>
        {props.label}
      </div>
    </Box>
  );
};

export default ItemCategoryItem;
