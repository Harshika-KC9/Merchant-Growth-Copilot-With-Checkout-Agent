🚀 Merchant Growth Co-Pilot & Checkout Agent
Helping merchants scale today—and getting them ready for an AI-first commerce world.

🌐 Live Demo: https://merchant-growth-copilot-razorpay.onrender.com

As a 3rd-year CSE student, I've been fascinated by how AI agents are evolving from just answering questions to actually taking actions—like making purchases. But this brings up a huge real-world problem: How do we let AI agents buy things on a merchant's site without the merchant losing control?

Traditional checkouts were built for humans (Human → Website → Checkout → Payment). But when an AI assistant is authorized to buy things for you, what happens if it glitches and tries to buy 50 laptops instead of 1? Merchants need a safety net.

That's why I built this project. It’s a two-part platform designed to bridge the gap between traditional e-commerce and AI-driven transactions.

🛠️ What I Built
1. Merchant Growth Co-Pilot 📊
An intelligent dashboard that helps merchants understand their data so they can grow.

Analyze datasets and spot hidden revenue patterns.

Simulate business changes (e.g., "What happens if I increase prices by 5%?").

Generate AI-powered, actionable insights to boost sales.

Track previous analyses to see what strategies actually worked.

2. Merchant Checkout Agent 🤖
Think of this as a smart "bouncer" or middleware between an AI buyer and the payment gateway. Before any money moves, it evaluates the transaction against strict merchant policies.

The Architecture:
AI Buyer ➔ Checkout Agent ➔ Policy Engine ➔ Merchant Approval ➔ Razorpay (Test) ➔ Audit Trail

When an AI requests a purchase (e.g., "Buy 2 units of Product X under my ₹3,000 budget"), my Checkout Agent verifies:

📦 Inventory & Catalog: Is it in stock? Is the category allowed?

💰 Budget Matching: Does it fit the buyer's specified budget?

🛡️ AI Spending Cap: I implemented a strict ₹3,000 hard limit for AI transactions. Requests over this are blocked immediately.

👤 Merchant Approval: Transactions over ₹2,000 are flagged and require explicit human approval from the merchant before a payment order is even created.

🔐 Authorization: One-time auth tokens are securely consumed only after the Razorpay order generates.

🛡️ Key Engineering Highlights
Graceful Failures: The agent doesn't just crash or blindly forward bad requests. If an AI tries to buy ₹3,600 worth of goods, the transaction is gracefully declined before hitting the payment gateway, and the agent suggests an alternative (like lowering the quantity).

Transparent Audit Trail: I built a logging system that records every single stage (Request -> Policy Check -> Approval -> Payment Verify). This gives merchants complete visibility into what the AI did and why it made that decision.

💻 Tech Stack
Frontend: React.js

Backend: Node.js & Express

Payments: Razorpay API (Test Mode integration)

Deployment & Version Control: Render, Git, GitHub

🚀 Want to run it locally?
The live link (https://merchant-growth-copilot-razorpay.onrender.com) demonstrates the Merchant Growth Co-Pilot analytics experience.

If you want to test the full AI Checkout Agent flow with Razorpay, clone the repo and check out the detailed docs inside the project folder. You'll find a complete guide covering:

Local setup & .env configurations

Razorpay API test-mode setup

Simulated demo scenarios for the AI buyer

Security and troubleshooting tips
