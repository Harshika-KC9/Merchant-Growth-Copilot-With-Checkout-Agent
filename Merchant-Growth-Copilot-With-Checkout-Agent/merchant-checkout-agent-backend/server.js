const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const Razorpay = require('razorpay');

dotenv.config();
const app = express();
app.use(cors({ origin: true }));
app.use(express.json({ limit: '1mb' }));

const PORT = Number(process.env.PORT || 5001);
const MAX_TRANSACTION = 3000;
const HUMAN_APPROVAL_THRESHOLD = 2000;
const AUTH_TOKEN = 'BUYER-AUTH-ONCE-2026';
const ALLOWED_CATEGORIES = new Set(['electronics', 'accessories', 'bundles']);
const catalog = JSON.parse(fs.readFileSync(path.join(__dirname, 'catalog.json'), 'utf8'));
const auditFile = path.join(__dirname, 'audit.json');
const usedTokensFile = path.join(__dirname, 'used-tokens.json');
if (!fs.existsSync(auditFile)) fs.writeFileSync(auditFile, '[]');
if (!fs.existsSync(usedTokensFile)) fs.writeFileSync(usedTokensFile, '[]');

function readAudit(){ try{return JSON.parse(fs.readFileSync(auditFile,'utf8'));}catch{return[];} }
function readUsedTokens(){ try{return JSON.parse(fs.readFileSync(usedTokensFile,'utf8'));}catch{return[];} }
function isTokenUsed(token){ return readUsedTokens().includes(token); }
function consumeToken(token){ const tokens=readUsedTokens(); if(!tokens.includes(token)){tokens.push(token);fs.writeFileSync(usedTokensFile,JSON.stringify(tokens,null,2));return true;} return false; }
function resetDemoState(){ fs.writeFileSync(auditFile,'[]'); fs.writeFileSync(usedTokensFile,'[]'); }
function audit(type, message, meta={}){
  const event={id:`audit-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,timestamp:new Date().toISOString(),type,message,meta};
  const all=readAudit(); all.unshift(event); fs.writeFileSync(auditFile, JSON.stringify(all.slice(0,500),null,2)); return event;
}
function getProduct(id){return catalog.products.find(p=>p.id===id);}
function normalizeItems(items){return (Array.isArray(items)?items:[]).map(x=>({productId:String(x.productId||''),quantity:Number(x.quantity||0)}));}
function evaluateRequest(body){
  const items=normalizeItems(body.items); const budget=Number(body.budget||0); const authToken=String(body.authorizationToken||'');
  const checks=[]; const reasons=[]; let total=0; let stockOk=true; let categoryOk=true; let constraintsOk=true; let tokenOk=authToken===AUTH_TOKEN && !isTokenUsed(authToken);
  if(!items.length){reasons.push('No products were requested.');}
  for(const item of items){
    const p=getProduct(item.productId);
    if(!p){stockOk=false; reasons.push(`Unknown product: ${item.productId}.`); continue;}
    if(!Number.isInteger(item.quantity)||item.quantity<1){constraintsOk=false; reasons.push(`${p.name}: quantity must be a positive integer.`); continue;}
    if(item.quantity>p.stock){stockOk=false; reasons.push(`${p.name}: requested ${item.quantity}, only ${p.stock} in stock.`);}
    const max=Number((p.constraints[0]||'').match(/\d+/)?.[0]||999);
    if(item.quantity>max){constraintsOk=false; reasons.push(`${p.name}: maximum ${max} units per order.`);}
    if(!ALLOWED_CATEGORIES.has(p.category)){categoryOk=false; reasons.push(`${p.name}: category ${p.category} is not allowed.`);}
    total += p.price*item.quantity;
  }
  if(budget>0 && total>budget) reasons.push(`Order total ₹${total.toLocaleString('en-IN')} exceeds buyer budget ₹${budget.toLocaleString('en-IN')}.`);
  const capOk=total>0 && total<=MAX_TRANSACTION;
  if(!capOk) reasons.push(`Merchant policy cap is ₹${MAX_TRANSACTION.toLocaleString('en-IN')} per AI-authorized transaction.`);
  if(!tokenOk){
    reasons.push(authToken===AUTH_TOKEN && isTokenUsed(authToken) ? 'One-time authorization token has already been consumed.' : 'One-time authorization token is missing or invalid.');
  }
  const needsApproval=total>HUMAN_APPROVAL_THRESHOLD;
  checks.push({name:'Allowed category',passed:categoryOk});
  checks.push({name:'Stock availability',passed:stockOk});
  checks.push({name:'Quantity constraints',passed:constraintsOk});
  checks.push({name:'Spend cap',passed:capOk});
  checks.push({name:'Buyer budget',passed:budget<=0||total<=budget});
  checks.push({name:'One-time authorization',passed:tokenOk});
  checks.push({name:'Human sign-off threshold',passed:!needsApproval,detail:needsApproval?'Required before payment':'Not required'});
  const passed=items.length>0&&categoryOk&&stockOk&&constraintsOk&&capOk&&(budget<=0||total<=budget)&&tokenOk;
  return {passed,needsApproval,total,budget,items,checks,reasons};
}

app.get('/api/health',(req,res)=>res.json({ok:true,testMode:true,merchant:catalog.merchant.name}));
app.get('/api/catalog',(req,res)=>res.json(catalog));
app.get('/api/audit',(req,res)=>res.json({events:readAudit()}));
app.post('/api/audit/clear',(req,res)=>{resetDemoState(); audit('SYSTEM','Audit trail and one-time authorization reset for a fresh demo session.'); res.json({ok:true});});

app.post('/api/checkout/evaluate',(req,res)=>{
  const result=evaluateRequest(req.body||{});
  audit('BUYER_REQUEST','AI Buyer requested a checkout.',{request:req.body,result:{total:result.total,passed:result.passed,needsApproval:result.needsApproval}});
  for(const c of result.checks) audit('POLICY_CHECK',`${c.name}: ${c.passed?'PASS':'BLOCK'}`,c);
  if(result.passed && result.needsApproval && !req.body.humanApproved){
    audit('ESCALATION',`₹${result.total.toLocaleString('en-IN')} exceeds ₹${HUMAN_APPROVAL_THRESHOLD.toLocaleString('en-IN')} human approval threshold.`);
    return res.json({...result,status:'needs_approval',decision:'ESCALATE',explanation:'All automated gates passed, but merchant sign-off is required before any Razorpay order is created.'});
  }
  if(!result.passed){
    audit('DECLINED','Checkout request declined by Merchant Checkout Agent.',{reasons:result.reasons});
    const bounded=result.items.length?result.items.map(i=>({...i,quantity:Math.min(1,i.quantity)})):[];
    return res.json({...result,status:'declined',decision:'DECLINE',explanation:'The agent stopped before any money action. It can propose a smaller bounded order or merchant escalation.',boundedAlternative:bounded});
  }
  audit('APPROVED','Checkout request passed policy gates.',{total:result.total,humanApproved:!!req.body.humanApproved});
  res.json({...result,status:'approved',decision:'PROCEED',explanation:'All required gates passed. A Razorpay Test Mode order may now be created.'});
});

app.post('/api/razorpay/create-order',async(req,res)=>{
  try{
    if(!process.env.RAZORPAY_KEY_ID||!process.env.RAZORPAY_KEY_SECRET) return res.status(500).json({error:'Razorpay test keys are not configured in backend/.env'});
    const evaluation=evaluateRequest(req.body||{});
    if(!evaluation.passed) return res.status(403).json({error:'Policy gate blocked order creation.',evaluation});
    if(evaluation.needsApproval && !req.body.humanApproved) return res.status(403).json({error:'Merchant approval required before order creation.',evaluation});
    const receipt=`mgc_${Date.now()}`.slice(0,40);
    const razorpay=new Razorpay({key_id:process.env.RAZORPAY_KEY_ID,key_secret:process.env.RAZORPAY_KEY_SECRET});
    const order=await razorpay.orders.create({amount:evaluation.total*100,currency:'INR',receipt,notes:{source:'merchant_checkout_agent',buyer:'ai_buyer',policy_cap:String(MAX_TRANSACTION)},payment_capture:1});
    if(!consumeToken(String(req.body.authorizationToken||''))){
      audit('AUTH_REPLAY_BLOCKED','One-time authorization token was already consumed before order creation.',{});
      return res.status(409).json({error:'One-time authorization token has already been consumed.'});
    }
    audit('AUTH_CONSUMED','One-time authorization token consumed for this money action.',{});
    audit('RAZORPAY_ORDER',`Razorpay Test Mode order ${order.id} created.`,{orderId:order.id,amount:evaluation.total,currency:'INR'});
    res.json({ok:true,keyId:process.env.RAZORPAY_KEY_ID,order,amount:evaluation.total,currency:'INR'});
  }catch(err){
    audit('RAZORPAY_ERROR','Razorpay order creation failed.',{message:err?.error?.description||err.message});
    res.status(500).json({error:err?.error?.description||err.message});
  }
});

app.post('/api/razorpay/payment-failed',(req,res)=>{
  const {razorpay_order_id,error}=req.body||{};
  audit('PAYMENT_FAILED','Razorpay Test Mode payment failed safely. No fulfillment should occur.',{orderId:razorpay_order_id||'',error:error||{}});
  res.json({ok:true});
});

app.post('/api/razorpay/verify-payment',(req,res)=>{
  try{
    const {razorpay_order_id,razorpay_payment_id,razorpay_signature}=req.body||{};
    if(!process.env.RAZORPAY_KEY_SECRET) return res.status(500).json({error:'Razorpay secret is not configured.'});
    if(!razorpay_order_id||!razorpay_payment_id||!razorpay_signature) return res.status(400).json({verified:false,error:'Missing Razorpay verification fields.'});
    const expected=crypto.createHmac('sha256',process.env.RAZORPAY_KEY_SECRET).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest('hex');
    const expectedBuffer=Buffer.from(expected);
    const receivedBuffer=Buffer.from(String(razorpay_signature));
    const verified=expectedBuffer.length===receivedBuffer.length && crypto.timingSafeEqual(expectedBuffer,receivedBuffer);
    audit(verified?'PAYMENT_VERIFIED':'PAYMENT_REJECTED',verified?'Razorpay payment signature verified.':'Payment signature verification failed.',{orderId:razorpay_order_id,paymentId:razorpay_payment_id});
    res.json({verified});
  }catch(err){res.status(400).json({verified:false,error:'Unable to verify payment signature.'});}
});

app.listen(PORT,()=>{console.log(`Merchant Checkout Agent backend running on http://localhost:${PORT}`);audit('SYSTEM','Merchant Checkout Agent backend started.',{port:PORT,testMode:true});});
