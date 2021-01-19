Project:
Shafie's stripe intergration for the payments intent API using Node and React. Overall purpose is to generate a friction report on the documentation + journey of building a custom intergration.  

Goals: 
1. Create a PaymentIntent on the server
2. Collect payment method details on the client
3. Submit the payment to Stripe from the client
4. Asynchronously fulfill the customer’s order

Client side code: app.js
To get it up and running input
//npm install
//npm start 

Once npm is up and running navigate to localhost:3000 

Server side code: server.js
To get it up and running input
//npm install 
//npm run start-backend

Environment variable used to store both the public and secert key, this can be viewed/updated in .env  

Ensure stripe is installed with -> npm install --save stripe

Once you ahve localhost3000 up and running and it's communicating with the server side code, it's time to run 3 test scenarios: 

1. Integration handles payments that don't require authentication -> Run 4242424242424242 in card details, plus any digits for MM/YY + CVC 
2. Integration handles payments that require authentication -> Run 4000002500003155 in card details, plus any digits for MM/YY + CVC 
3. Your integration handles card declines codes like insufficient funds -> Run 4000000000009995 in card details, plus any digits for MM/YY + CVC 


Webhook: 

To test our webhooks functionality, first install Stripes CLI -> brew install stripe/stripe-cli/stripe 

Once you make a test payment the custom webhook will store successfull payment information into our payments.txt file 

Hope you have fun playing around! 

