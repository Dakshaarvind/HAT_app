import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { doc, setDoc, collection } from 'firebase/firestore';
import { db, auth } from '../firebase/config';

// Check if Stripe key exists, otherwise set to null
const stripePromise = null;

const CheckoutForm = ({ items, total }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements || !auth.currentUser) {
      return;
    }

    setProcessing(true);
    setError('');

    try {
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      });

      if (stripeError) {
        throw stripeError;
      }

      // In a real app, you would send paymentMethod.id to your backend
      // and handle the payment confirmation there
      
      // Save order to Firestore
      const orderRef = doc(collection(db, 'orders'));
      await setDoc(orderRef, {
        userId: auth.currentUser.uid,
        items: items.map(item => ({
          id: item.id,
          title: item.title,
          price: item.price,
          purchaseType: item.purchaseType,
        })),
        total: total,
        paymentMethod: paymentMethod.id,
        status: 'completed',
        createdAt: new Date().toISOString(),
      });

      navigate('/checkout/success', { state: { orderId: orderRef.id } });
    } catch (err) {
      setError(err.message);
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Payment Details</h2>
        
        <div className="mb-6">
          <CardElement
            className="p-3 border border-gray-300 rounded-md"
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm mb-4">{error}</div>
        )}

        <button
          type="submit"
          disabled={processing || !stripe}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-md transition-colors disabled:bg-gray-400"
        >
          {processing ? 'Processing...' : `Pay $${total}`}
        </button>
      </div>
    </form>
  );
};

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [isStripeAvailable, setIsStripeAvailable] = useState(!!process.env.REACT_APP_STRIPE_PUBLIC_KEY);

  useEffect(() => {
    if (!location.state?.items) {
      navigate('/');
      return;
    }

    const cartItems = location.state.items;
    setItems(cartItems);
    
    const calculatedTotal = cartItems.reduce(
      (sum, item) => sum + (item.purchaseType === 'rent' ? item.rentalPrice : item.price),
      0
    );
    setTotal(calculatedTotal.toFixed(2));
  }, [location.state, navigate]);

  if (!items.length) {
    return null;
  }

  // Service unavailable message component
  const ServiceUnavailableMessage = () => (
    <div className="bg-white rounded-lg shadow-md p-6 text-center">
      <h2 className="text-xl font-bold mb-4">Payment Service Coming Soon</h2>
      <p className="text-gray-600 mb-4">
        Our payment processing service is currently under maintenance. 
        Please check back later to complete your purchase.
      </p>
      <button
        onClick={() => navigate('/')}
        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-md transition-colors"
      >
        Return to Shopping
      </button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
      <div className="lg:grid lg:grid-cols-3 lg:gap-8">
        {/* Order Summary */}
        <div className="lg:col-span-1 mb-6 lg:mb-0">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-2 border-b">
                <div>
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-sm text-gray-500">
                    {item.purchaseType === 'rent' ? 'Rental' : 'Purchase'}
                  </p>
                </div>
                <span className="font-medium">
                  ${item.purchaseType === 'rent' ? item.rentalPrice : item.price}
                </span>
              </div>
            ))}
            
            <div className="flex items-center justify-between py-4">
              <span className="font-semibold">Total</span>
              <span className="text-xl font-bold text-purple-600">${total}</span>
            </div>
          </div>
        </div>

        {/* Payment Form or Service Unavailable Message */}
        <div className="lg:col-span-2">
          {isStripeAvailable && stripePromise ? (
            <Elements stripe={stripePromise}>
              <CheckoutForm items={items} total={total} />
            </Elements>
          ) : (
            <ServiceUnavailableMessage />
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
