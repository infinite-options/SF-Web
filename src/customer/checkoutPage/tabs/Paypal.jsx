import React, { useRef, useEffect, useState } from 'react';

const PayPal = ({ value, setPaypal, setCartItems }) => {
  const [loaded, setLoaded] = useState(false);
  let paypalRef = useRef();

  const CLIENT = {
    sandbox: process.env.REACT_APP_PAYPAL_CLIENT_ID_TESTING,
    production: process.env.REACT_APP_PAYPAL_CLIENT_ID_LIVE,
  };

  const CLIENT_ID =
    process.env.NODE_ENV === 'production' ? CLIENT.production : CLIENT.sandbox;

  useEffect(() => {
    const script = document.createElement('script');

    script.src = `https://www.paypal.com/sdk/js?client-id=${CLIENT.sandbox}&currency=USD`;
    script.addEventListener('load', () => setLoaded(true));
    document.body.appendChild(script);

    if (loaded) {
      setTimeout(() =>
        window.paypal
          .Buttons({
            createOrder: (data, actions) => {
              return actions.order.create({
                purchase_units: [
                  {
                    description: 'Testing',
                    amount: {
                      currency_code: 'USD',
                      value: value,
                    },
                  },
                ],
              });
            },
            onApprove: async (data, actions) => {
              const order = await actions.order.capture();
              setPaypal(false);
              setCartItems({});
              console.log('order: ', order);
            },
          })
          .render(paypalRef)
      );
    }
  });
  return (
    <div>
      <div ref={v => (paypalRef = v)} />
    </div>
  );
};

export default PayPal;
