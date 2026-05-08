# AUTONOMOUS_PLANT_CORE // V3.3 🚀
### Full-Stack AI Maintenance Agent & Predictive Engine

**Live Production Link:** [View Live Site](https://autonomous-plant-agent.vercel.app)

---

## 🛠 Overview
The **Autonomous Plant Core** is a sophisticated predictive maintenance system designed for industrial motor analysis. It bridges the gap between raw sensor data and actionable intelligence by combining machine learning failure prediction with an LLM-driven diagnostic agent.

The system features a high-density "Hacker Aesthetic" dashboard, optimized for low-latency telemetry monitoring and expert-level diagnostic feedback.

## 🚀 Key Features
- **Predictive Intelligence:** Real-time analysis of Vibration (Hz), Heat (°C), and Pressure (PSI) using a custom **XGBoost Classifier**.
- **AI-Driven Protocols:** Integrated with **LangChain** and **Groq (Llama 3)** to generate high-fidelity repair instructions based on model confidence scores.
- **Dynamic UX:** An interactive HTML5 Canvas binary rain background with user-controllable contrast and visibility settings.
- **Full-Stack Connectivity:** Seamless communication between a React 18 frontend and a high-performance FastAPI backend.

## 🏗 Technical Stack
- **Frontend:** React, Lucide-React, CSS3 (CRT & Scanline effects), HTML5 Canvas.
- **Backend:** FastAPI (Python), Uvicorn.
- **Machine Learning:** Scikit-Learn, XGBoost, Pandas.
- **AI Framework:** LangChain, Groq API (Llama 3 70B).
- **Deployment:** Vercel (Frontend), Render (Backend).

## 📂 Project Architecture
```bash
autonomous-plant-agent/
├── backend/
│   ├── main.py          # FastAPI application & LangChain logic
│   ├── trainer.py       # ML model training script (automated on Render)
│   ├── requirements.txt # Python dependencies
│   └── .env             # [IGNORED] Secrets management
├── frontend/
│   ├── src/
│   │   ├── App.js       # React logic & Matrix animations
│   │   └── App.css      # Custom UI/UX styling
│   └── package.json     # JS dependencies
└── .gitignore           # Multi-layered security rules
