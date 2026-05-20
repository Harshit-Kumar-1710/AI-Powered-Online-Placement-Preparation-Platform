AI-Powered Placement Preparation Platform

A modern full-stack AI-powered platform designed to help students prepare for technical placements through adaptive mock interviews, coding assessments, aptitude practice, resume analysis, and personalized analytics.

🚀 Features
🤖 AI Mock Interviews
Adaptive interview difficulty
AI-generated follow-up questions
Resume-based personalized interviews
Text-based confidence analysis
AI-generated interview reports
💻 Coding Practice
Online coding compiler integration
DSA topic-wise practice
Coding assessments
Difficulty filters
🧠 Aptitude Preparation
Quantitative aptitude
Logical reasoning
Verbal ability
Timed quizzes
📄 Resume Analyzer
ATS score analysis
Missing keyword detection
Skill recommendations
AI-based feedback
📊 Personalized Dashboard
Performance analytics
Weak topic detection
Progress tracking
Interview history
🏢 Company-Specific Modes
Google
Amazon
JP Morgan
Microsoft
🛠️ Tech Stack
Frontend
React
Tailwind CSS
shadcn/ui
Framer Motion
Backend
Flask (Python)
Database
MongoDB Atlas
Authentication
JWT Authentication
bcrypt Password Hashing
AI Integration
Gemini API
Compiler API
Judge0 API
Deployment
Vercel
Render
📂 Project Structure
AI-Powered-Placement-Preparation-Platform/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── routes/
│   ├── config/
│   ├── middleware/
│   ├── app.py
│   └── .env
│
└── README.md
⚙️ Environment Variables

Create a .env file inside the backend/ folder.

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_gemini_api_key
🔧 Installation
1️⃣ Clone Repository
git clone <your_repo_link>
cd AI-Powered-Placement-Preparation-Platform
2️⃣ Frontend Setup
cd frontend
npm install
npm run dev
3️⃣ Backend Setup
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
venv\Scripts\activate

# Install dependencies
pip install flask flask-cors pymongo python-dotenv bcrypt pyjwt

# Run backend
python app.py
📌 Current Development Status

✅ Frontend setup completed
✅ Flask backend setup completed
✅ MongoDB Atlas integration completed
✅ Environment configuration completed
✅ Gemini API integration setup completed
🔄 Authentication system in progress
🔄 AI interview engine in progress
🔄 Coding compiler integration pending

🎯 Future Scope
Voice-based AI interviews
Real-time collaborative interviews
AI-generated study roadmaps
Advanced analytics dashboard
Role-based interview preparation
Multi-language interview support
👨‍💻 Author

Harshit Kumar
