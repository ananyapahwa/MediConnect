const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware.cjs');

// POST /api/ai/chat — AI symptom checker using Google Gemini
router.post('/chat', verifyToken, async (req, res) => {
    const { messages } = req.body; // array of { role: 'user'|'model', content: string }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ message: 'Messages array is required.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
        return res.status(503).json({
            message: 'AI service not configured. Please add your GEMINI_API_KEY to the .env file.'
        });
    }

    try {
        // System instruction to keep the AI medically focused
        const systemInstruction = `You are MediBot, a helpful and empathetic AI health assistant for MediConnect, a healthcare platform. 
Your role is to:
1. Listen carefully to patients' symptoms and health concerns.
2. Provide general health information and education (NOT diagnosis).
3. Recommend which medical specialist they should consult (e.g., Cardiologist, Dermatologist, Neurologist).
4. Always remind users that you are NOT a replacement for professional medical advice.
5. Be warm, reassuring, and clear.
6. Keep responses concise and easy to understand.
7. If symptoms sound urgent or life-threatening (chest pain, difficulty breathing, stroke symptoms), immediately advise calling emergency services (112/911).

Always end your response with a relevant specialist recommendation and a reminder to book an appointment.`;

        // Convert our message format to Gemini's format
        const geminiContents = messages.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
        }));

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    systemInstruction: { parts: [{ text: systemInstruction }] },
                    contents: geminiContents,
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 512,
                    }
                })
            }
        );

        if (!response.ok) {
            const errData = await response.json();
            console.error('Gemini API error:', errData);
            const errorMessage = errData?.error?.message || 'AI service returned an error. Please try again.';
            return res.status(502).json({ message: errorMessage });
        }

        const data = await response.json();
        const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!aiText) {
            return res.status(502).json({ message: 'AI did not return a response. Please try again.' });
        }

        res.json({ reply: aiText });
    } catch (error) {
        console.error('AI chat error:', error);
        res.status(500).json({ message: 'Failed to connect to AI service.' });
    }
});

module.exports = router;
