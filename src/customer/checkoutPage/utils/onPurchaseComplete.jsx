export function onPurchaseComplete(props) {
  props.store.setCartItems({});
  props.store.setCartTotal(0);
  localStorage.removeItem('selectedDay');
  props.store.setDayClicked('');
  props.store.setFarmsClicked(new Set());
  localStorage.removeItem('cartTotal');
  localStorage.removeItem('cartItems');

  // TODO: check message with Prashant
  props
    .confirm({
      variant: 'info',
      title: 'Purchase Completed',
      description:
        'Thank you! Your order should arrive by ' +
        props.store.expectedDelivery +
        '.',
    })
    .then(() => {
      props.store.setExpectedDelivery('');
    })
    .catch(() => {});
}
