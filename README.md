# 🚀 Merchant Growth Co-Pilot + Merchant Checkout Agent

> **Helping merchants grow today — and become ready for AI-driven commerce tomorrow.**

🌐 **Live Demo:**  
https://merchant-growth-copilot-razorpay.onrender.com

---

## 💡 What We Built

**Merchant Growth Co-Pilot + Merchant Checkout Agent** is a two-part platform designed for the emerging world of AI-powered commerce.

It combines:

### 📊 Merchant Growth Co-Pilot

An intelligent merchant analytics platform that helps merchants:

- Analyze business datasets
- Identify revenue patterns
- Discover growth opportunities
- Generate AI-powered insights
- Simulate business changes
- Apply actionable recommendations
- Track previous analyses

### 🤖 Merchant Checkout Agent

A controlled AI-commerce layer that allows AI buyers to interact with a merchant's catalog and request purchases.

Before any payment action takes place, the Checkout Agent evaluates the request against merchant-defined policies.

---

# 🎯 The Problem

AI agents are becoming capable of making decisions and acting on behalf of users.

But when an AI agent wants to purchase something from a merchant, an important question arises:

> **How can AI agents transact with merchants while keeping merchants in control?**

Traditional checkout assumes:

```text
Human → Website → Checkout → Payment
AI-driven commerce introduces:

AI Agent → Merchant → Transaction

This creates new requirements around:

Authorization
Spending limits
Merchant policies
Approval
Transparency
Auditability
💡 Our Solution

We introduce a Merchant Checkout Agent as a controlled decision layer between an AI buyer and the payment system.

                    AI BUYER
                       │
                       ▼
             ┌──────────────────┐
             │ Merchant         │
             │ Checkout Agent   │
             └────────┬─────────┘
                      │
                      ▼
             ┌──────────────────┐
             │ Policy Engine    │
             │                  │
             │ • Budget         │
             │ • Stock          │
             │ • Quantity       │
             │ • Category       │
             │ • Spend Cap      │
             │ • Authorization  │
             └────────┬─────────┘
                      │
                ┌─────┴─────┐
                │           │
             DECLINE      APPROVE
                            │
                            ▼
                    Merchant Approval
                            │
                            ▼
                     Razorpay Test
                            │
                            ▼
                     Payment Verify
                            │
                            ▼
                      Audit Trail
🤖 How the Checkout Agent Works

A buyer can make a request such as:

Buy 2 units of Product X within my ₹3,000 budget.

The Checkout Agent checks:

📦 Product availability
📊 Stock
🔢 Quantity constraints
🏷️ Allowed categories
💰 Buyer budget
🛡️ AI spending cap
🔐 One-time authorization
👤 Merchant approval requirements

Only when the required checks pass can the request proceed to payment.

🛡️ Controlled AI Commerce

Our demo implements multiple safeguards.

💰 AI Spending Cap

The AI agent has a maximum transaction limit of:

₹3,000

Requests above this limit are declined before any payment action.

👤 Merchant Approval

Transactions above:

₹2,000

require explicit merchant approval before the payment order can be created.

🔐 One-Time Authorization

A one-time authorization token is consumed only after a Razorpay order is successfully created.

🧾 Auditability

Important transaction events are recorded in the Audit Trail so the decision process can be inspected.

💳 Razorpay Integration

Approved transactions can create a Razorpay Test Mode Order through the backend.

AI Buyer
   ↓
Purchase Request
   ↓
Checkout Agent
   ↓
Policy Checks
   ↓
Merchant Approval
   ↓
Razorpay Test Order
   ↓
Test Payment
   ↓
Payment Verification
   ↓
Audit Trail

The project uses Razorpay Test Mode, so the demonstration does not involve real money.

❌ Graceful Failure

The Checkout Agent doesn't blindly attempt every transaction.

For example:

Request:
2 × Product X

Total:
₹3,600

AI Spending Cap:
₹3,000

        ↓

❌ DECLINED

Reason:
Transaction exceeds the AI spending limit.

Alternative:
Try a lower quantity.

The request is rejected before any payment action.

🧾 Transparent Audit Trail

The system records important stages such as:

Request Received
       ↓
Catalog Check
       ↓
Policy Evaluation
       ↓
Authorization
       ↓
Merchant Approval
       ↓
Agent Decision
       ↓
Razorpay Order
       ↓
Payment Verification
       ↓
Completed

This provides visibility into:

What did the agent do, and why?

✨ Key Features
Merchant Growth Co-Pilot
📊 Dataset analysis
🔍 Revenue diagnostics
🤖 AI-powered insights
📈 Growth simulations
💡 Actionable recommendations
🧾 Persistent analysis history
Merchant Checkout Agent
🤖 AI buyer interaction
🛍️ Agent-readable product catalog
🛡️ Policy enforcement
💰 Spending limits
👤 Merchant approval
🔐 Authorization controls
💳 Razorpay Test Mode
🧾 Transaction audit trail
❌ Graceful failure handling
🛠️ Technology Stack
Layer	Technology
Frontend	React
Backend	Node.js
API	Express
Payments	Razorpay Test Mode
Version Control	Git + GitHub
Deployment	Render
🌐 Live Demo
👉 Try the application

https://merchant-growth-copilot-razorpay.onrender.com

The deployed application demonstrates the Merchant Growth Co-Pilot experience.

For the complete local Checkout Agent and Razorpay Test Mode setup, see the detailed documentation inside the project folder.

📖 Detailed Documentation

For:

Local setup
Backend configuration
Razorpay configuration
Environment variables
Project structure
Checkout Agent flow
Demo scenarios
Security
Troubleshooting

Open the project folder and read its:

README.md
