# Quick Start Guide - Gemini Course Generation

## 🚀 Setup Steps

### 1. Environment Setup
Your `.env` file already contains the Gemini API key. Verify it's present:

```env
GEMINI_API_KEY=AIzaSyAE6Fmv8fAKve3RzmsQVQQGbw-TBTigTII
MONGO_URI=mongodb+srv://...
PORT=5000
```

✅ **Status**: Already configured!

### 2. Dependencies
All required packages are already installed:
- `@google/generative-ai` - Gemini SDK
- `mongoose` - MongoDB ODM
- `express` - Web framework
- `dotenv` - Environment variables

### 3. File Structure Created
```
acadence-backend/
├── config/
│   └── gemini.js                    ✅ Created
├── routes/
│   └── generateCourse.js           ✅ Created
├── models/
│   ├── Course.js                   ✅ Updated
│   ├── Lesson.js                   ✅ Updated
│   └── Quiz.js                     ✅ (Already exists)
├── .env                            ✅ (Already exists)
├── .env.example                    ✅ Created
├── GEMINI_INTEGRATION.md           ✅ Created
├── DATABASE_SCHEMA.md              ✅ Created
├── test-gemini-api.js              ✅ Created
└── server.js                       ✅ Updated
```

## 📝 API Endpoints Available

### 1. Generate Course
**POST** `/api/generate-course`

**Request**:
```json
{
  "topic": "Python Programming",
  "difficulty": "beginner",
  "numberOfLessons": 5
}
```

**Response** (201):
```json
{
  "message": "Course generated successfully",
  "course": { ... },
  "lessons": [ ... ],
  "quiz": { ... }
}
```

### 2. Preview Course
**POST** `/api/generate-course/preview`

Same request format, but doesn't save to database.

## 🧪 Testing

### Option 1: PowerShell
```powershell
# Replace with your actual JWT token
$token = "YOUR_JWT_TOKEN"

$body = @{
    topic = "JavaScript Basics"
    difficulty = "beginner"
    numberOfLessons = 5
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/generate-course" `
  -Method POST `
  -Headers @{"Authorization"="Bearer $token"; "Content-Type"="application/json"} `
  -Body $body
```

### Option 2: Postman
1. Method: `POST`
2. URL: `http://localhost:5000/api/generate-course`
3. Headers:
   - `Content-Type`: `application/json`
   - `Authorization`: `Bearer YOUR_JWT_TOKEN`
4. Body (raw JSON):
```json
{
  "topic": "Machine Learning Basics",
  "difficulty": "intermediate",
  "numberOfLessons": 6
}
```

### Option 3: Test Script
```bash
node test-gemini-api.js
```
(Update the token in the file first)

## 🎯 How It Works

### 1. Request Flow
```
Client Request
    ↓
POST /api/generate-course
    ↓
Authentication Middleware (JWT)
    ↓
Input Validation
    ↓
Gemini API Call (with detailed prompt)
    ↓
JSON Response Parsing
    ↓
Database Save (Course, Lessons, Quiz)
    ↓
Response to Client
```

### 2. Gemini Prompt Strategy
The system uses a **highly structured prompt** that:
- Defines the AI's role as an educational content creator
- Specifies exact JSON structure required
- Sets content quality requirements (300+ words per lesson)
- Enforces validation rules
- Restricts output to pure JSON (no markdown)

### 3. Database Schema
Three collections are created:

**Course** → Stores course metadata
- Title, topic, description
- Difficulty level
- Learning objectives
- Progress tracking

**Lesson** → Stores individual lessons
- Title and detailed content
- Order and duration
- Points system

**Quiz** → Stores course assessment
- 5 questions with answers
- Total score

All linked via `courseId` ObjectId references.

## 🔐 Security Features

✅ **JWT Authentication** - All endpoints require valid token
✅ **Input Validation** - Topic, difficulty, lesson count validated
✅ **Environment Variables** - API keys stored securely
✅ **User Isolation** - Courses tied to userId

## 📊 What Was Changed

### Updated Files:
1. **server.js**
   - Added `generateCourseRoutes` import
   - Added `/api/generate-course` route
   - Updated to use `getChatbotModel()` from config

2. **models/Course.js**
   - Added `difficulty` field (enum)
   - Added `estimatedDuration` field
   - Added `learningObjectives` array

3. **models/Lesson.js**
   - Added `order` field for sequencing
   - Added `duration` field

### New Files:
1. **config/gemini.js** - Gemini API configuration
2. **routes/generateCourse.js** - Course generation endpoints
3. **.env.example** - Environment template
4. **GEMINI_INTEGRATION.md** - Full documentation
5. **DATABASE_SCHEMA.md** - Schema reference
6. **test-gemini-api.js** - Test utilities

## ⚡ Performance Notes

- **Generation Time**: 10-30 seconds per course
- **Rate Limits**: Check Google Cloud Console for your API limits
- **Optimization**: Use preview endpoint for testing without DB writes

## 🐛 Troubleshooting

### Issue: "Failed to parse AI response"
**Solution**: The code automatically strips markdown. Verify API key is valid.

### Issue: "Invalid or expired token"
**Solution**: Generate a new JWT token by logging in via `/api/users/login`

### Issue: "GEMINI_API_KEY not found"
**Solution**: Ensure `.env` file exists in `acadence-backend/` directory

## 📚 Documentation

- **Full Integration Guide**: `GEMINI_INTEGRATION.md`
- **Schema Documentation**: `DATABASE_SCHEMA.md`
- **API Reference**: See GEMINI_INTEGRATION.md section

## ✅ Ready to Use!

Your Gemini integration is fully configured and ready to generate courses. Start by testing with the preview endpoint, then generate real courses!

---

**Next Steps**:
1. Test the preview endpoint first
2. Generate a sample course
3. Verify data in MongoDB
4. Integrate with frontend
5. Add UI components for course generation

**Support**: See documentation files for detailed information.
