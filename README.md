# 🚀 Merchant Growth Co-Pilot & Checkout Agent

> **Helping merchants scale today — and getting them ready for an AI-first commerce world.**

🌐 **Live Demo:** https://merchant-growth-copilot-razorpay.onrender.com

---

## 📌 Overview

E-commerce is evolving from **human-driven shopping** to **AI-assisted and agent-driven commerce**.

Traditional checkout flows were designed around:

**Human → Website → Checkout → Payment**

But when an AI agent is authorized to make purchases on behalf of a customer, a new challenge emerges:

> **How can merchants allow AI agents to transact while still maintaining control, security, and visibility over every transaction?**

For example, what happens if an AI agent is instructed to purchase **1 laptop**, but due to an error attempts to purchase **50 laptops**?

Merchants need a safety layer between the AI buyer and the payment gateway.

**Merchant Growth Co-Pilot & Checkout Agent** is a two-part platform designed to address both sides of this problem:

1. 📊 **Merchant Growth Co-Pilot** — helps merchants analyze their data and identify opportunities for growth.
2. 🤖 **Merchant Checkout Agent** — acts as a secure policy and authorization layer between AI buyers and the payment system.

---

# 🛠️ What I Built

## 1. 📊 Merchant Growth Co-Pilot

The **Merchant Growth Co-Pilot** is an intelligent analytics dashboard designed to help merchants understand their transaction data and make better business decisions.

### Key Features

* 📈 **Dataset Analysis**

  * Upload transaction datasets.
  * Identify hidden revenue patterns.
  * Analyze transaction performance.

* 💡 **AI-Powered Insights**

  * Generate actionable recommendations based on merchant data.
  * Identify potential revenue leaks and optimization opportunities.

* 🧪 **Business Simulation**

  * Test potential business changes before implementing them.
  * Example:

    > "What happens if I increase prices by 5%?"

* 📊 **Revenue Impact Analysis**

  * Estimate the potential impact of proposed changes.
  * Compare current performance with simulated outcomes.

* 📝 **Analysis & Fix History**

  * Track previous analyses.
  * Keep a record of AI-generated recommendations and fixes.
  * Understand which strategies were previously applied.

### Goal

The goal is to help merchants move from:

**"What happened?"**

to:

**"Why did it happen?" → "What should I do?" → "What could happen if I do it?"**

---

# 2. 🤖 Merchant Checkout Agent

The **Merchant Checkout Agent** is a middleware layer designed for the emerging world of **AI-driven commerce**.

Instead of allowing an AI buyer to communicate directly with the payment gateway, the Checkout Agent evaluates the transaction first.

### Architecture

```text
AI Buyer
   │
   ▼
Checkout Agent
   │
   ▼
Policy Engine
   │
   ├── Inventory & Catalog Check
   ├── Budget Check
   ├── AI Spending Cap
   ├── Merchant Approval
   └── Authorization Check
   │
   ▼
Merchant Approval
   │
   ▼
Razorpay (Test Mode)
   │
   ▼
Audit Trail
```

This creates a controlled transaction flow where **AI agents can act, but merchants remain in control.**

---

# 🛡️ Checkout Safety Policies

Before any payment order is created, the Checkout Agent evaluates the requested transaction.

## 📦 1. Inventory & Catalog Validation

The agent verifies:

* Whether the requested product exists.
* Whether the product is currently in stock.
* Whether the requested category is allowed.

Invalid or unavailable products are rejected before reaching the payment stage.

---

## 💰 2. Budget Matching

The agent checks whether the requested purchase fits within the buyer's specified budget.

For example:

```text
Buyer Budget: ₹3,000
Purchase Amount: ₹2,500

Result: ✅ Allowed
```

If the purchase exceeds the buyer's budget:

```text
Buyer Budget: ₹3,000
Purchase Amount: ₹3,600

Result: ❌ Declined
```

The agent can also suggest safer alternatives, such as reducing the requested quantity.

---

## 🛡️ 3. AI Spending Cap

AI-driven transactions have a strict maximum spending limit.

### AI Transaction Limit: ₹3,000

Any AI purchase request above this amount is immediately blocked.

For example:

```text
AI Request: ₹3,600
AI Spending Cap: ₹3,000

❌ Transaction Blocked
```

This prevents an AI agent from accidentally generating an excessively large transaction.

---

## 👤 4. Merchant Approval

High-value transactions require explicit merchant approval.

### Approval Threshold: ₹2,000

```text
Transaction ≤ ₹2,000
        ↓
Automatic policy evaluation
        ↓
Continue if approved
```

```text
Transaction > ₹2,000
        ↓
Merchant Approval Required
        ↓
Payment order created only after approval
```

This ensures that merchants retain human control over higher-value AI transactions.

---

## 🔐 5. Authorization

The Checkout Agent uses one-time authorization tokens.

The token is consumed only after the Razorpay order has successfully been generated.

This helps prevent unauthorized reuse of transaction authorization.

---

# 🧠 Graceful Failure Handling

A major design goal of the Checkout Agent is to **fail safely rather than blindly forwarding requests**.

For example, if an AI agent requests:

```text
Product: Laptop
Quantity: 2
Total: ₹3,600
AI Spending Cap: ₹3,000
```

The Checkout Agent detects that the request exceeds the AI spending limit.

Instead of creating a payment order, it:

```text
AI Request
    ↓
Policy Evaluation
    ↓
₹3,600 > ₹3,000
    ↓
❌ Transaction Declined
    ↓
💡 Suggest Lower Quantity
```

This prevents invalid transactions from reaching the payment gateway.

---

# 📜 Transparent Audit Trail

Every important stage of the transaction is recorded in an **Audit Trail**.

The system tracks events such as:

```text
Request
   ↓
Policy Check
   ↓
Merchant Approval
   ↓
Payment Order
   ↓
Payment Verification
```

This provides merchants with visibility into:

* What the AI requested.
* Which policies were evaluated.
* Why a transaction was approved or rejected.
* Whether merchant approval was required.
* What happened during payment verification.

The goal is to make AI-driven commerce **observable, explainable, and controllable**.

---

# 🔄 End-to-End Flow

A typical AI purchase follows this flow:

```text
1. AI Buyer sends purchase request
              ↓
2. Checkout Agent receives request
              ↓
3. Product & inventory validation
              ↓
4. Budget validation
              ↓
5. AI spending cap validation
              ↓
6. Merchant approval check
              ↓
7. Authorization validation
              ↓
8. Razorpay test order creation
              ↓
9. Payment processing
              ↓
10. Payment verification
              ↓
11. Audit Trail updated
```

If any critical policy fails, the transaction is stopped before it reaches the payment stage.

---

# 💻 Tech Stack

| Layer           | Technology               |
| --------------- | ------------------------ |
| Frontend        | React.js                 |
| Backend         | Node.js                  |
| API Framework   | Express.js               |
| Payments        | Razorpay API — Test Mode |
| Deployment      | Render                   |
| Version Control | Git & GitHub             |

---

# 🏗️ Project Architecture

```text
                    ┌─────────────────────┐
                    │      AI Buyer       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │  Checkout Agent     │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    Policy Engine    │
                    └──────────┬──────────┘
                               │
             ┌─────────────────┼─────────────────┐
             │                 │                 │
             ▼                 ▼                 ▼
        Inventory          Budget          Spending Cap
          Check             Check             Check
             │                 │                 │
             └─────────────────┼─────────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Merchant Approval   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Razorpay Test Mode  │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    Audit Trail      │
                    └─────────────────────┘
```

---

# 🚀 Live Demo

The deployed application demonstrates the **Merchant Growth Co-Pilot analytics experience**.

🌐 **Live Demo:**
https://merchant-growth-copilot-razorpay.onrender.com

> **Note:** The live deployment primarily demonstrates the merchant analytics experience. The complete Checkout Agent + Razorpay test flow can be run locally.

---

# 🖥️ Running the Project Locally

To test the complete platform locally:

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd <PROJECT_FOLDER>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file and add your Razorpay test credentials:

```env
RAZORPAY_KEY_ID=your_test_key_id
RAZORPAY_KEY_SECRET=your_test_key_secret
```

> Use **Razorpay Test Mode credentials** for development and demonstration.

### 4. Start the application

```bash
npm start
```

Depending on the project configuration, the frontend and backend may need to be started separately.

Refer to the project documentation for the exact local setup.

---

# 🧪 Demo Scenarios

The Checkout Agent can be tested using different AI purchase scenarios.

### ✅ Scenario 1 — Valid Purchase

```text
Product: Product X
Quantity: 1
Total: ₹1,500
Budget: ₹3,000

Result: ✅ Approved
```

---

### ⚠️ Scenario 2 — Merchant Approval Required

```text
Product: Product X
Quantity: 2
Total: ₹2,500
Budget: ₹3,000

Result: ⚠️ Merchant Approval Required
```

The transaction cannot proceed until the merchant explicitly approves it.

---

### ❌ Scenario 3 — AI Spending Cap Exceeded

```text
Product: Product X
Quantity: 3
Total: ₹3,600
AI Spending Cap: ₹3,000

Result: ❌ Blocked
```

The agent prevents the transaction from reaching the payment gateway.

---

# 🔐 Security Considerations

The Checkout Agent is designed around the principle:

> **AI agents can request actions, but they should not have unrestricted authority to execute financial transactions.**

Important safeguards include:

* AI transaction spending limits.
* Merchant approval for higher-value transactions.
* One-time authorization tokens.
* Policy validation before payment order creation.
* Inventory and catalog validation.
* Transaction audit logging.
* Razorpay Test Mode for development.

This project is a prototype demonstrating how a **policy-controlled transaction layer** could work in AI-first commerce.

---

# 🌍 Why This Matters

As AI agents become capable of performing real-world actions, traditional application architectures may no longer be sufficient.

Today's flow:

```text
Human → Website → Checkout → Payment
```

Tomorrow's flow could look like:

```text
Human
  ↓
AI Agent
  ↓
Merchant Systems
  ↓
Policy / Authorization Layer
  ↓
Payment
```

The challenge is no longer only:

> **"Can an AI agent make a purchase?"**

It becomes:

> **"Can an AI agent make a purchase safely, within defined boundaries, while keeping the merchant in control?"**

This project explores one possible architecture for solving that problem.

---

# 🎯 Future Improvements

Some potential extensions include:

* 🔑 Role-based merchant permissions.
* 📊 Advanced transaction monitoring.
* 🤖 More sophisticated AI purchase agents.
* 🚨 Real-time fraud and anomaly detection.
* 📈 ML-based revenue forecasting.
* 🧠 Dynamic policy configuration for merchants.
* 🔄 Refund and cancellation workflows.
* 🔐 Stronger token-based authorization.
* 📜 More detailed audit and compliance reporting.
* 💳 Support for additional payment gateways.
* 🛍️ Multi-merchant AI shopping workflows.

---

# 👩‍💻 About the Project

I built this project as a **3rd-year Computer Science & Engineering student** interested in the intersection of:

* Artificial Intelligence
* AI Agents
* E-commerce
* Payments
* Cybersecurity
* Data Analytics

The project combines two important aspects of modern commerce:

**Helping merchants grow today** 📊
and
**preparing merchants for AI-driven transactions tomorrow** 🤖

---

# ⭐ Key Takeaways

### Merchant Growth Co-Pilot

**Analyze → Understand → Simulate → Act → Track**

### Merchant Checkout Agent

**Request → Validate → Authorize → Approve → Pay → Audit**

Together, they create a platform focused on making commerce **smarter, safer, and ready for an AI-first future.**

---

## ⭐ If you find this project interesting, consider starring the repository!
**For furthermore details,refer the Readme.md file inside the project folder.**

**Built with ❤️ using React.js, Node.js, Express.js, and Razorpay Test Mode.**
