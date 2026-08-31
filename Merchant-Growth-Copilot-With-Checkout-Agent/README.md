# Merchant Growth Co-Pilot + Merchant Checkout Agent

This package preserves the existing Merchant Growth Co-Pilot and adds a separate AI-commerce checkout layer.

## Existing app

Start the existing React frontend from `frontend/`:

```powershell
cd frontend
npm install
npm start
```

Open `http://localhost:3000`. Your existing Growth Co-Pilot remains the main application.

## New link between both experiences

The existing Growth Co-Pilot header now contains an **AI Checkout Agent →** button. It opens:

`http://localhost:3000/merchant-checkout-agent/index.html`

The Checkout Agent page contains a **Merchant Growth Co-Pilot** link back to `/`, plus an Audit Trail link.

No existing dashboard, diagnosis, prescription, simulation, dataset, or history component was replaced.

## Checkout backend

Open a second terminal:

```powershell
cd merchant-checkout-agent-backend
npm install
copy .env.example .env
notepad .env
```

Put your Razorpay **TEST MODE** credentials in `.env`:

```env
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
PORT=5001
FRONTEND_ORIGIN=http://localhost:3000
```

Then run:

```powershell
npm start
```

Backend: `http://localhost:5001`

## Demo flow

1. Open the Growth Co-Pilot at `http://localhost:3000`.
2. Click **AI Checkout Agent →**.
3. Choose a product, quantity, and buyer budget.
4. The Merchant Checkout Agent checks catalog, stock, quantity constraints, allowed category, buyer budget, the ₹3,000 AI spend cap, and the one-time authorization token.
5. Requests above ₹2,000 require merchant approval before a Razorpay order can be created.
6. Approved requests create a real Razorpay **Test Mode** Order on the backend.
7. Razorpay Checkout handles the test payment.
8. The backend verifies the payment signature.
9. Every important step is recorded in the audit trail.
10. The one-time authorization token is consumed only when the Razorpay order is successfully created.

## Graceful failure demo

Use a quantity whose total exceeds ₹3,000. The agent declines the request before any money action and offers a bounded one-unit alternative.

## Fresh demo reset

The Audit Trail page has **Clear Demo**. It clears the audit trail and resets the one-time demo authorization token so you can demonstrate another successful transaction.

## Security

Never put `RAZORPAY_KEY_SECRET` in frontend code or commit `.env`. Only the backend uses the secret. Use Razorpay Test Mode keys for this demo.
