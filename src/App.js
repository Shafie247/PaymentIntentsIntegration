import { useState } from 'react';
import {Elements, CardElement, ElementsConsumer} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import items from './items.json';
import './App.css';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY)

function App() {
  const [cart, setCart] = useState([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);

  const addItem = item => {
    setCart(prevState => [item, ...prevState])
  }

  const checkoutItems = async () => {
    setIsCheckingOut(true);
    const response = await fetch('/payment-intent', {
      method: 'POST',
      body: JSON.stringify({
        items: cart, currency: 'gbp'
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const res = await response.json();
    console.log('yoo==>>>', res)
    setClientSecret(res.clientSecret);
  }

  const handleSubmit = async (e, elements, stripe) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    const {error, paymentMethod} = await stripe.createPaymentMethod({type: 'card', card});
    console.log('got here==>>>', error, 'payme==>>', paymentMethod);

    if (error) {
      console.log('error occuredd==>>', error)
    } else {
      try {
        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card
          }
        });
        console.log('result==>>>', result);
      } catch (err) {

      }
    }
  }

  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };

  return (
    <div className="App container">

      <button onClick={checkoutItems} >Checkout {cart.length} Items</button>

      {!isCheckingOut && <div className="row col-sm-12">
        {items.map((item, i) => (
          <div key={i} className="card col-sm-3" style={{ width: '18rem' }}>
            <div className="card-body">
              <h5 className="card-title">{item.title}</h5>
              <h6 className="card-subtitle mb-2 text-muted">{item.type}</h6>
              <p className="card-text">{item.description}</p>
              <span className="card-link">{item.price}</span>
              <button onClick={() => addItem(item)} >Add to Cart</button>
            </div>
          </div>
        ))}
      </div>}

      {isCheckingOut && <div>
        <Elements stripe={stripePromise}>
        <ElementsConsumer>{({elements, stripe}) => (
          <form onSubmit={e => handleSubmit(e, elements, stripe)}>
            <CardElement options={CARD_ELEMENT_OPTIONS} />
            <br/><br/>
            <div>
              <button id="submit" disabled={!stripe}> Pay </button>
            </div>
          </form>
        )}</ElementsConsumer>
        </Elements>
      </div>}
    </div>
  );
}

export default App;
