// This is your test secret API key.
const stripe = require("stripe")(
    "sk_test_51PQvFpRrMWCSgGaVys3pxFWSGR4LLsLFViBAwn4joS0r0b7LdyRf2AQayIjoXInlGbY57BZwteNLZGAJBxH9zzOO005RdtS31W"
);
const express = require("express");
const app = express();
app.use(express.static("public"));

const YOUR_DOMAIN = "http://localhost:4242";

app.post("/create-checkout-session", async (req, res) => {
    const session = await stripe.checkout.sessions.create({
        line_items: [
            // {
            //     // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
            //     price: "price_1PQvYkRrMWCSgGaVxp3I4mmn",
            //     quantity: 1,
            // },.
            {
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: "Fuck",
                        description: "werfg",
                        images: ["https://res.cloudinary.com/enlearn/image/upload/v1642928006/fullauth/user-pictures/default_rg7jfy.png"],
                    },
                    unit_amount: 4526 * 100,
                },
                quantity: 1,
            },
        ],
        mode: "payment",
        success_url: `${YOUR_DOMAIN}?success=true`,
        cancel_url: `${YOUR_DOMAIN}?canceled=true`,
    });
    console.log(session.url);
    res.redirect(303, session.url);
});

app.listen(4242, () => console.log("Running on port 4242"));
