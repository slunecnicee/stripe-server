const express = require("express");
const app = express();
const stripe = require("stripe")(
  "sk_test_51O4ttgJyX5iki0jy61CIk9ZISdDc1oliuyZMrlVh56wmxOu8FZLq91Zq1Qz5lMYBlETXqYqR15HM5dhv7XX09eBJ00PWJOVItu"
);
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");

app.use(morgan("dev"));

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    optionsSuccessStatus: 204,
    preflightContinue: false,
  })
);

app.use(express.json());

app.post("/create-checkout-session", async (req, res) => {
  const { cartItems, userId } = req.body;
  const line_items = Object.values(cartItems).map((item) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          images: [item.images[0]],
          metadata: {
            id: item.id,
          },
        },
        unit_amount: parseInt(item.price * 100, 10),
      },
      quantity: 1,
    };
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    shipping_address_collection: {
      allowed_countries: ["US", "CA", "GE"],
    },
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: 0,
            currency: "usd",
          },
          display_name: "Free shipping",
          // Delivers between 5-7 business days
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: 5,
            },
            maximum: {
              unit: "business_day",
              value: 7,
            },
          },
        },
      },
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: 1500,
            currency: "usd",
          },
          display_name: "Next day air",
          // Delivers in exactly 1 business day
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: 1,
            },
            maximum: {
              unit: "business_day",
              value: 1,
            },
          },
        },
      },
    ],
    phone_number_collection: {
      enabled: true,
    },
    line_items,
    mode: "payment",
    success_url: "http://localhost:3000/success-page",
    cancel_url: "http://localhost:3000/cart",
  });

  res.send({ url: session.url });
});

app.post("/api/create-checkout-session", async (req, res) => {
  const { cartItems, userId } = req.body;
  const line_items = cartItems.map((item) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          images: [item.images[0]],
          metadata: {
            id: item.id,
          },
        },
        unit_amount: parseInt(item.price * 100, 10),
      },
      quantity: 1,
    };
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    shipping_address_collection: {
      allowed_countries: ["US", "CA", "GE"],
    },
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: 0,
            currency: "usd",
          },
          display_name: "Free shipping",
          // Delivers between 5-7 business days
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: 5,
            },
            maximum: {
              unit: "business_day",
              value: 7,
            },
          },
        },
      },
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: 1500,
            currency: "usd",
          },
          display_name: "Next day air",
          // Delivers in exactly 1 business day
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: 1,
            },
            maximum: {
              unit: "business_day",
              value: 1,
            },
          },
        },
      },
    ],
    phone_number_collection: {
      enabled: true,
    },
    line_items,
    mode: "payment",
    success_url: "http://localhost:3000/success-page",
    cancel_url: "http://localhost:3000/cart",
  });

  res.send({ url: session.url });
});

app.listen(4242, () => console.log(`Listening on port ${4242}!`));
