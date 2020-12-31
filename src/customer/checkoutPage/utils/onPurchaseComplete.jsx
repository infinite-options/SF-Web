export function onPurchaseComplete(props) {
  props.store.setCartItems({});
  props.store.setCartTotal(0);
  props.store.setDayClicked('');
  props.store.setStartDeliveryDate('');
  props.store.setFarmsClicked(new Set());
  props.checkout.setPurchaseMade(props.checkout.purchaseMade + 1);
  localStorage.removeItem('selectedDay');
  localStorage.removeItem('cartTotal');
  localStorage.removeItem('cartItems');
  localStorage.removeItem('startDeliveryDate');

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
