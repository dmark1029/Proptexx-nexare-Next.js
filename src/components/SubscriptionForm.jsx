"use client";
import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import axios from "axios";
import Translate from "./Translate";

const SubscriptionForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    // Collect card details using CardElement
    const cardElement = elements.getElement(CardElement);

    // Create a PaymentMethod from the card details
    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      console.error("Error creating PaymentMethod:", error.message);
      setLoading(false);
      return;
    }

    // Send PaymentMethod ID to the server for subscription creation
    try {
      const response = await axios.post("/api/create-subscription", {
        paymentMethodId: paymentMethod.id,
        priceId: "price_123456789", // Replace with the ID of the price you want to use for the subscription
        customerEmail: "customer@example.com", // Replace with the customer's email
      });

      setLoading(false);
      // Handle successful subscription creation
    } catch (error) {
      console.error("Error creating subscription:", error.message);
      setLoading(false);
      // Handle subscription creation error
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe || loading}>
        {loading ? (
          <Translate text="Processing..." />
        ) : (
          <Translate text="Subscribe" />
        )}
      </button>
    </form>
  );
};

export default SubscriptionForm;
