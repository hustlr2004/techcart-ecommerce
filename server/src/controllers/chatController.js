const Groq = require('groq-sdk');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const systemPrompt = `You are TechCart's friendly AI assistant 
for a tech gadgets store in India.
Categories: Phones, Laptops, Audio, Wearables, Gaming, Accessories.
Coupons available: SAVE10, TECH20, LAUNCH15.
Keep replies short and helpful. Reply in user's language.`;

const smartFallback = (message) => {
  const msg = String(message || '').toLowerCase();
  if (msg.includes('laptop')) {
    return 'We have MacBook Air M3 (₹1,14,900), Dell XPS 15 (₹1,89,000)! Check Laptops category.';
  }
  if (msg.includes('phone') || msg.includes('mobile')) {
    return 'Top picks: iPhone 15, Samsung S24, OnePlus 12. Visit Phones section!';
  }
  if (msg.includes('headphone') || msg.includes('audio')) {
    return 'Sony WH-1000XM5 and AirPods Pro are bestsellers. Check Audio section!';
  }
  if (msg.includes('gaming')) {
    return 'Gaming section has PS5 Controller, Mechanical Keyboards, Gaming Mouse!';
  }
  if (msg.includes('order') || msg.includes('track')) {
    return 'Go to My Orders page to track your order. Need help? Share your order ID!';
  }
  if (msg.includes('return') || msg.includes('refund')) {
    return 'We offer 7-day easy returns. Contact support with your order ID.';
  }
  if (msg.includes('discount') || msg.includes('coupon') || msg.includes('offer')) {
    return 'Use code SAVE10 for 10% off, TECH20 for 20% off on orders above ₹5000!';
  }
  if (msg.includes('deliver') || msg.includes('shipping')) {
    return 'Free delivery on orders above ₹999. Standard delivery in 3-5 business days.';
  }
  if (msg.includes('pay') || msg.includes('payment')) {
    return 'We accept UPI, Credit/Debit Cards, Net Banking via Razorpay. 100% secure!';
  }
  return 'I can help with products, orders, offers and more. What are you looking for?';
};

exports.chat = async (req, res) => {
  const { message, history = [] } = req.body;

  if (!message || !String(message).trim()) {
    return res.status(400).json({ message: 'Message is required' });
  }

  // Try Groq first
  try {
    const response = await groq.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [
        { role: 'system', content: systemPrompt },
        ...history,
        { role: 'user', content: message },
      ],
      max_tokens: 300,
    });

    return res.json({
      reply: response.choices[0].message.content,
      source: 'groq',
    });
  } catch (groqErr) {
    console.log('Groq failed, trying Gemini...', groqErr?.message || groqErr);
  }

  // Try Gemini as backup
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const chat = model.startChat({ history });
    const result = await chat.sendMessage(message);

    return res.json({
      reply: result.response.text(),
      source: 'gemini',
    });
  } catch (geminiErr) {
    console.log('Gemini failed, using fallback...', geminiErr?.message || geminiErr);
  }

  // Smart fallback - always works
  return res.json({
    reply: smartFallback(message),
    source: 'fallback',
  });
};
