require('dotenv').config();
const express = require('express');
const fs = require('fs');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = express();
const bodyparser = require('body-parser')
app.use(bodyparser.urlencoded({extended:false})) 
app.use(bodyparser.json())

app.use(express.json());

app.post('/payment-intent', async (req, res) => {
    
    const {items, currency } = req.body;
    console.log('req body items==>>>', items.reduce((a,b) => a.price + b.price))

    const {client_secret} = await stripe.paymentIntents.create({
        amount: 200, //get it from items
        currency,
        metadata: {integration_check: 'accept_a_payment'},
    });

    res.send({clientSecret: client_secret});
});

app.post('/webhook', bodyparser.raw({type: 'application/json'}), (request, response) => {
	let event;
	try {
		console.log(request.body);
		event = request.body
	} catch (err) {
		console.log(`⚠️  Webhook error while parsing basic request.`, err.message);
		return response.send();
	}
	// Handle the event
	switch (event.type) {
		case 'payment_intent.succeeded':
			const paymentIntent = event.data.object;
            console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
            fs.appendFileSync('./payments.txt', `PaymentIntent for ${paymentIntent.amount} was successful! at ${new Date().toISOString()} \n\n`);
			// Then define and call a method to handle the successful payment intent.
			// handlePaymentIntentSucceeded(paymentIntent);
			break;
		case 'payment_method.attached':
			const paymentMethod = event.data.object;
			// Then define and call a method to handle the successful attachment of a PaymentMethod.
			// handlePaymentMethodAttached(paymentMethod);
			break;
		default:
			// Unexpected event type
			console.log(`Unhandled event type ${event.type}.`);
	}
	// Return a 200 response to acknowledge receipt of the event
	response.send();
});

app.listen(3001, () => console.log('server started on 3001'));
