export function onPurchaseComplete(props) {
  props.store.setCartItems({});
  props.store.setCartTotal(0);
  props.store.setDayClicked('');
  localStorage.removeItem('cartTotal');
  localStorage.removeItem('cartItems');

  // TODO: check message with Prashant
  props
    .confirm({
      variant: 'info',
      title: 'Your Purchase has been Processed and is Complete!',
      description:
        'Thank you! Your order should arrive by ' +
        props.store.expectedDelivery +
        '.',
    })
    .then(() => {})
    .catch(() => {});
}
