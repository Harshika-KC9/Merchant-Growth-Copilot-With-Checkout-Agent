🎯 Our Vision

We believe commerce will increasingly evolve from:

Human → Website → Checkout

towards:

Human
  ↓
AI Agent
  ↓
Merchant
  ↓
Merchant Checkout Agent
  ↓
Controlled Transaction

Our goal is to explore how merchants can participate in this emerging AI-commerce ecosystem without giving up control over their products, policies, or transactions.

🚀 From Growth to AI Commerce
Understand the Business
          ↓
Discover Growth Opportunities
          ↓
Prepare for AI Commerce
          ↓
Enable Controlled AI Transactions
          ↓
Maintain Merchant Control

Merchant Growth Co-Pilot + Merchant Checkout Agent

Helping merchants grow today — and become ready for AI-driven commerce tomorrow. 🚀

---

# 📄 FILE 2 — Inner `README.md`

Put this inside:

```text
Merchant-Growth-Copilot-With-Checkout-Agent/
README.md
# Merchant Growth Co-Pilot + Merchant Checkout Agent
## Technical Documentation

This project preserves the existing **Merchant Growth Co-Pilot** and adds a separate **Merchant Checkout Agent** experience for demonstrating controlled AI-commerce transactions.

---

# 📂 Project Structure

```text
Merchant-Growth-Copilot-With-Checkout-Agent/
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── ...
│
├── merchant-checkout-agent/
│   └── index.html
│
├── merchant-checkout-agent-backend/
│   ├── package.json
│   ├── server.js
│   ├── .env.example
│   └── ...
│
└── README.md
📊 Existing Merchant Growth Co-Pilot

The original React application remains the main merchant analytics experience.

It provides:

Dataset analysis
Revenue diagnostics
AI-generated insights
Growth recommendations
Business simulations
Fix recommendations
Analysis history
Persistent Recent Analyses

The existing dashboard and analysis functionality remains intact.

🤖 Merchant Checkout Agent

The Checkout Agent is a separate AI-commerce experience connected to the Growth Co-Pilot.

The Growth Co-Pilot header contains:

AI Checkout Agent →

which opens:

/merchant-checkout-agent/index.html

The Checkout Agent also provides a link back to the Merchant Growth Co-Pilot and an Audit Trail.

🔄 Checkout Flow

The overall transaction flow is:

AI Buyer
   ↓
Purchase Request
   ↓
Merchant Checkout Agent
   ↓
Catalog Validation
   ↓
Stock Validation
   ↓
Quantity Validation
   ↓
Category Validation
   ↓
Buyer Budget Check
   ↓
AI Spending Cap
   ↓
Authorization Check
   ↓
Merchant Approval
   ↓
Razorpay Test Order
   ↓
Razorpay Test Payment
   ↓
Payment Signature Verification
   ↓
Audit Trail
🛍️ Agent-Readable Catalog

The Checkout Agent works with merchant product information including:

Product name
Price
Stock
Category
Quantity constraints
Purchase restrictions

This allows the agent to evaluate a purchase request before initiating payment.

🧠 Policy Checks

Before a payment order is created, the agent evaluates the request.

Product

The requested product must exist in the available catalog.

Stock

The requested quantity must be available.

Quantity

The requested quantity must satisfy the configured quantity restrictions.

Category

The requested product must belong to an allowed category.

Buyer Budget

The transaction must remain within the buyer's specified budget.

AI Spending Cap

The demonstration uses:

₹3,000

as the maximum AI transaction amount.

Requests above this amount are declined before payment.

Merchant Approval

Transactions above:

₹2,000

require merchant approval before a Razorpay order can be created.

Authorization

The Checkout Agent uses a one-time authorization mechanism for the demo transaction flow.

💳 Razorpay Test Mode

Approved transactions can create a Razorpay Test Mode order through the backend.

The backend is responsible for handling the Razorpay secret credentials.

The frontend must never contain:

RAZORPAY_KEY_SECRET
🔐 Environment Variables

Create a .env file inside:

merchant-checkout-agent-backend/

Example:

RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
PORT=5001
FRONTEND_ORIGIN=http://localhost:3000

Use Razorpay TEST MODE credentials for the demonstration.

Never commit .env to GitHub.

🚀 Running the Project Locally
1. Start the React frontend

Open a terminal:

cd frontend
npm install
npm start

The frontend will run at:

http://localhost:3000
2. Start the Checkout Agent backend

Open a second terminal:

cd merchant-checkout-agent-backend
npm install
copy .env.example .env

Edit .env and add your Razorpay Test Mode credentials.

Then start the backend:

npm start

Backend:

http://localhost:5001
🔗 Connecting the Experiences

The Merchant Growth Co-Pilot contains the:

AI Checkout Agent →

button.

The Checkout Agent page provides a:

Merchant Growth Co-Pilot

link to return to the main application.

This keeps the existing merchant analytics application intact while adding the separate AI-commerce experience.

🎬 Recommended Demo

For a hackathon demonstration, use the following sequence.

Step 1 — Merchant Growth

Open:

http://localhost:3000

Log in and open the Merchant Growth Co-Pilot.

Step 2 — Analyze Data

Upload a merchant dataset.

Run the analysis and show:

Revenue insights
Diagnostics
Recommendations
Simulation
Recent Analyses
Step 3 — Open Checkout Agent

Click:

AI Checkout Agent →

Step 4 — Successful Transaction

Select a product and quantity that satisfy:

Stock availability
Quantity restrictions
Buyer budget
Category rules
₹3,000 AI spending cap

Submit the purchase request.

Step 5 — Merchant Approval

For transactions above:

₹2,000

demonstrate the merchant approval step.

Step 6 — Razorpay Test Mode

Create the Razorpay Test Mode order.

Use the test payment flow.

The backend verifies the payment signature.

Step 7 — Audit Trail

Open the Audit Trail.

Show the transaction lifecycle and decision history.

❌ Failure Scenario

To demonstrate the policy layer, create a request exceeding:

₹3,000

Example:

Product X × 2
Total = ₹3,600

Expected behavior:

❌ Request Declined

Reason:
Transaction exceeds the AI spending cap.

Alternative:
Reduce the requested quantity.

The agent should reject the request before initiating the payment action.

🔄 Resetting the Demo

The Audit Trail page provides:

Clear Demo

This resets the demonstration state so another transaction can be demonstrated.

It clears the audit trail and resets the one-time demo authorization token.

🧾 Audit Trail

Important transaction events are recorded during the process.

A typical flow can contain:

Request Received
       ↓
Catalog Validation
       ↓
Stock Check
       ↓
Policy Evaluation
       ↓
Authorization
       ↓
Merchant Approval
       ↓
Agent Decision
       ↓
Razorpay Order Creation
       ↓
Payment Verification
       ↓
Transaction Completion

This provides visibility into the agent's actions and decisions.

🔒 Security

The project follows these important security practices for the demonstration:

Razorpay Secret

Never place:

RAZORPAY_KEY_SECRET

in frontend code.

Only the backend should access the secret.

Environment Variables

Store sensitive credentials in:

.env

and never commit them to GitHub.

Test Mode

Use Razorpay Test Mode credentials during development and demonstration.

Payment Verification

The backend verifies the Razorpay payment signature before treating the payment as verified.

🌐 Deployment

The React frontend is deployed using Render.

Live application:

https://merchant-growth-copilot-razorpay.onrender.com

The frontend deployment is separate from the Checkout Agent backend.

The backend can be deployed independently and connected to the frontend using the appropriate backend URL and environment configuration.

🧪 Demo Test Cases
Test Case 1 — Valid Request
Product:
Available

Quantity:
Within stock

Budget:
Sufficient

Transaction:
Within ₹3,000

Expected:

APPROVED
Test Case 2 — Spending Cap
Transaction:
₹3,600

Expected:

DECLINED

Reason:

Exceeds ₹3,000 AI spending cap.
Test Case 3 — Merchant Approval
Transaction:
₹2,500

Expected:

Merchant approval required.
🏗️ Conceptual Architecture
                    MERCHANT
                       │
                       ▼
             Merchant Growth Co-Pilot
                       │
                 Business Data
                       │
                       ▼
             AI / Growth Insights
                       │
                       ▼
             AI-Transactable Catalog
                       │
                       │
                       ▼
                    AI BUYER
                       │
                Purchase Request
                       │
                       ▼
            Merchant Checkout Agent
                       │
                       ▼
              Policy Evaluation
                       │
          ┌────────────┼────────────┐
          │            │            │
        Budget       Stock      Authorization
          │            │            │
          └────────────┼────────────┘
                       │
                       ▼
              Merchant Approval
                       │
                       ▼
                 Razorpay Test
                       │
                       ▼
              Payment Verification
                       │
                       ▼
                  Audit Trail
🛠️ Technology Stack
Frontend
React
JavaScript
HTML
CSS
Backend
Node.js
Express
Payments
Razorpay Test Mode
Deployment
Render
Version Control
Git
GitHub
🌱 Future Scope

The current implementation demonstrates the concept of controlled AI commerce.

Possible future improvements include:

Multi-merchant AI commerce
Persistent transaction databases
Merchant-specific policy engines
Dynamic spending limits
Role-based merchant approvals
Fraud and risk scoring
Inventory reservation
Order management
Production payment integrations
Advanced AI agent reasoning
Agent-to-agent commerce protocols
🎯 Project Vision

The project explores a future where merchants are not only optimized for human customers but are also prepared for AI-driven commerce.

The long-term model is:

Human
   ↓
AI Buyer
   ↓
Merchant
   ↓
Merchant Checkout Agent
   ↓
Policy-Controlled Transaction
   ↓
Payment
   ↓
Auditability

The Merchant Growth Co-Pilot helps merchants understand and grow their business.

The Merchant Checkout Agent helps merchants participate in AI-driven commerce while retaining control.
