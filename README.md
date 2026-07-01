# 📄 AI-Powered Resume Analyzer & Skill Gap Recommendation System

An AI-powered full-stack MERN application that analyzes uploaded resumes, compares extracted skills with a selected job role, calculates a role-fit score, identifies missing skills, and generates a personalized learning roadmap to help candidates improve their employability.

---

# 🚀 Features

- Upload Resume (.pdf, .docx, .txt)
- Automatic Resume Parsing
- Skill Extraction using Keyword Matching
- Role-fit Score Calculation
- Skill Gap Detection
- Personalized Learning Roadmap
- Analysis History (MongoDB)
- REST API
- Responsive React UI

---

# 🛠 Tech Stack

| Technology | Purpose |
|------------|----------|
| React (Vite) | Frontend |
| Tailwind CSS | UI Styling |
| Node.js | Runtime |
| Express.js | Backend API |
| MongoDB | Database |
| Mongoose | ODM |
| pdf-parse | PDF Parsing |
| mammoth | DOCX Parsing |
| Multer | File Upload |
| fs | TXT Parsing |

---

# ⚙️ How It Works

1. User uploads a resume (.pdf, .docx, or .txt).
2. Resume is converted into plain text.
3. Text is normalized.
4. Skills are extracted using a master skill dictionary.
5. Synonyms are resolved (e.g. ReactJS → React, k8s → Kubernetes).
6. Skills are compared against the selected job role.
7. Weighted scoring is performed:
   - Core Skills → Highest Weight
   - Intermediate Skills → Medium Weight
   - Advanced Skills → Lower Weight
8. Missing skills are identified.
9. Curated learning resources are attached to every missing skill.
10. Final analysis is stored in MongoDB (if connected).

---

# 📁 Project Structure

```text
resume-analyzer/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── vite.config.js
│
├── server/
│   ├── data/
│   │   ├── jobRoles.json
│   │   └── learningResources.json
│   │
│   ├── models/
│   │   └── Analysis.js
│   │
│   ├── routes/
│   │   └── analyze.js
│   │
│   ├── utils/
│   │   ├── resumeParser.js
│   │   └── skillMatcher.js
│   │
│   ├── server.js
│   └── .env
│
└── README.md
```

---

# 📦 Installation

## Clone Repository

```bash
git clone https://github.com/your-username/resume-analyzer.git

cd resume-analyzer
```

---

# Backend Setup

```bash
cd server

npm install

cp .env.example .env

npm start
```

Server runs at:

```
http://localhost:5000
```

---

# Frontend Setup

```bash
cd client

npm install

npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

# Environment Variables

Create a `.env` file inside the **server** folder.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string
```

MongoDB is optional.

Without MongoDB:

- Resume Analysis ✅
- Role Matching ✅
- Learning Roadmap ✅

Unavailable:

- Analysis History

---

# API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/roles` | List all supported job roles |
| POST | `/api/analyze` | Analyze uploaded resume |
| GET | `/api/history` | Fetch last 20 analyses |
| GET | `/api/health` | Server & Database status |

---

# 📊 Matching Algorithm

The application uses a rule-based keyword matching engine.

### Supported Skill Levels

- Core Skills
- Intermediate Skills
- Advanced Skills

### Scoring Strategy

- Core skills carry the highest weight.
- Intermediate skills have medium weight.
- Advanced skills contribute lower weight.
- Synonym mapping improves matching accuracy.

Example:

```
ReactJS → React

Node → Node.js

k8s → Kubernetes
```

---

# 📚 Learning Roadmap

Every missing skill is mapped to curated learning resources.

Example:

```
Missing Skill:
Docker

↓

Recommended Resources

• Official Documentation

• YouTube Tutorials

• Roadmap.sh

• FreeCodeCamp

• Hands-on Projects
```

---

# 📸 Screenshots

Add screenshots here.

```
screenshots/

home.png

analysis.png

roadmap.png

history.png
```

---

# 🚀 Future Improvements

- AI-based Resume Parsing
- OpenAI/Gemini Skill Matching
- Semantic Search using Embeddings
- Resume Improvement Suggestions
- ATS Score Prediction
- Authentication
- Resume Comparison
- Export PDF Report

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Push the branch.
5. Open a Pull Request.

---

# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

**Vikash Seth**

Full Stack Developer

If you found this project helpful, consider giving it a ⭐ on GitHub.