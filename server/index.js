const express = require('express')
const bodyparser = require('body-parser')
const stripe = require('stripe')("sk_test_51MwQxhSCl0jbFD3lreZcugzLYfJkqdwT8J18pAGa6nqektoaWvpfV9vdh7hw9hlCGZb3ZD9inuR5lOcpuik8NaAn00rLMufPUx");
const uuid = require('uuid').v4
const cors = require('cors')


const app = express()

app.use(cors())

app.use(bodyparser.urlencoded({ extended:false}))

app.use(bodyparser.json())

const PORT = process.env.PORT || 5000


// post request which would handle the checkout process here

app.post('/checkout', async(req,res) =>{
      
    // console.log(req.body)

    let error, status

    try {
        const {product, token} = req.body
        // console.log("1")
        const customer = await stripe.customers.create({
            email: token.email,
            source: token.id
        })
        //  console.log("2",customer, "----",token)
        const key = uuid()


        const charge = await stripe.charges.create(
            {
                // amount : product.price * 100,
                currency: "INR",
                customer: customer.id,
                receipt_email: token.email,
                // description: `purchased the ${product}`,
                shipping: {
                    name: token.card.name,
                    address: {
                        line1: token.card.address_line1,
                        line2: token.card.address_line2,
                        city: token.card.address_city,
                        country: token.card.address_country,
                        postal_code: token.card.address_zip,
                    },
                },

        },
        {
            key:key,
        }
        );
        //    console.log("3")
        console.log("charge:", { charge });
        status = "success";
         charge = {charge}

    } catch (error){
        console.log(error)
        status = "failure...";
    }

    res.json({error,status});

})

app.listen(PORT, () => {

    console.log("APP IS RUNNING ON PORT 5000")
})