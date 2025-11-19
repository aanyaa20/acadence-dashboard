# Gemini API Integration for Course Generation

## Overview
This integration uses Google's Gemini AI to automatically generate complete educational courses with lessons and quizzes based on user-provided topics.

##  File Structure

```
acadence-backend/
├── config/
│   └── gemini.js              # Gemini API configuration
├── routes/
│   └── generateCourse.js      # Course generation API endpoints
├── models/
│   ├── Course.js              # Updated Course schema
│   ├── Lesson.js              # Updated Lesson schema
│   └── Quiz.js                # Quiz schema
├── .env                       # Environment variables (API keys)
└── .env.example              # Example environment file
```

## 🔧 Configuration Details

### 1. Gemini Configuration (`config/gemini.js`)
- **Purpose**: Initializes and configures the Gemini AI client
- **Features**:
  - Two separate model configurations:
    - `getCourseGenerationModel()`: Optimized for structured course content (temperature: 0.7)
    - `getChatbotModel()`: Optimized for conversational responses (temperature: 0.9)
  - Customizable generation parameters (temperature, topP, topK, maxOutputTokens)

### 2. Environment Variables
Located in `.env`:
```env
GEMINI_API_KEY=your_api_key_here
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret
```

### 3. API Key Setup
1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the generated key
5. Add to `.env` file as `GEMINI_API_KEY`

## 📊 Database Schema

### Course Schema (Updated)
```javascript
{
  userId: ObjectId,              // Reference to User
  title: String,                 // Course title
  topic: String,                 // Main topic
  description: String,           // Course description
  difficulty: String,            // 'beginner', 'intermediate', 'advanced'
  estimatedDuration: String,     // e.g., '4 hours', '2 weeks'
  learningObjectives: [String],  // Array of learning goals
  totalLessons: Number,          // Total number of lessons
  completedLessons: Number,      // Number of completed lessons
  createdAt: Date,               // Auto-generated
  updatedAt: Date                // Auto-generated
}
```

### Lesson Schema (Updated)
```javascript
{
  courseId: ObjectId,            // Reference to Course
  title: String,                 // Lesson title
  content: String,               // Detailed lesson content (300+ words)
  order: Number,                 // Sequential order (1, 2, 3...)
  duration: String,              // Estimated time (e.g., '30 minutes')
  points: Number,                // Points awarded (10-50)
  completed: Boolean,            // Completion status
  createdAt: Date,               // Auto-generated
  updatedAt: Date                // Auto-generated
}
```

### Quiz Schema
```javascript
{
  courseId: ObjectId,            // Reference to Course
  title: String,                 // Quiz title
  description: String,           // Quiz description
  questions: [{                  // Array of questions
    ques: String,                // Question text
    answer: String               // Correct answer with explanation
  }],
  score: Number,                 // Total points (50-100)
  createdAt: Date,               // Auto-generated
  updatedAt: Date                // Auto-generated
}
```

## 🚀 API Endpoints

### 1. Generate Course (POST `/api/generate-course`)
**Description**: Generates a complete course and saves it to the database

**Authentication**: Required (JWT token)

**Request Body**:
```json
{
  "topic": "Python Programming",
  "difficulty": "beginner",
  "numberOfLessons": 5
}
```

**Parameters**:
- `topic` (required): The course topic (string)
- `difficulty` (optional): 'beginner', 'intermediate', or 'advanced' (default: 'beginner')
- `numberOfLessons` (optional): Number of lessons (3-15, default: 5)

**Response** (201 Created):
```json
{
  "message": "Course generated successfully",
  "course": {
    "_id": "course_id",
    "userId": "user_id",
    "title": "Complete Python Programming",
    "topic": "Python Programming",
    "description": "...",
    "difficulty": "beginner",
    "estimatedDuration": "4 hours",
    "learningObjectives": [...],
    "totalLessons": 5,
    "completedLessons": 0,
    "lessonsCount": 5,
    "quizId": "quiz_id"
  },
  "lessons": [...],
  "quiz": {...}
}
```

**Error Responses**:
- `400 Bad Request`: Invalid input parameters
- `401 Unauthorized`: Missing or invalid JWT token
- `500 Internal Server Error`: Generation or database error

### 2. Preview Course (POST `/api/generate-course/preview`)
**Description**: Generates course content without saving to database (for preview)

**Authentication**: Required (JWT token)

**Request Body**:
```json
{
  "topic": "Machine Learning Basics",
  "difficulty": "intermediate",
  "numberOfLessons": 7
}
```

**Response** (200 OK):
```json
{
  "message": "Course preview generated",
  "preview": {
    "course": {...},
    "lessons": [...],
    "quiz": {...}
  }
}
```

## 🎯 Prompt Engineering

### The Detailed Prompt Strategy
The course generation uses a carefully crafted prompt that:

1. **Defines Role**: "You are an expert educational content creator"
2. **Specifies Output Format**: Requires ONLY valid JSON (no markdown, no explanations)
3. **Provides Structure**: Exact JSON schema with all required fields
4. **Sets Content Requirements**:
   - Minimum 300 words per lesson
   - Exactly 5 quiz questions
   - Comprehensive educational content
5. **Enforces Validation Rules**:
   - Non-empty strings
   - Proper data types
   - Sequential ordering
   - Educational quality standards

### Why This Approach Works
- **Structured Output**: JSON format ensures parseable, consistent data
- **Validation**: Clear rules prevent incomplete or malformed responses
- **Quality Control**: Content length and detail requirements ensure educational value
- **Database Compatibility**: Output structure matches MongoDB schemas exactly

## 🔐 Security Considerations

1. **API Key Protection**:
   - Stored in `.env` file
   - Never committed to version control
   - Add `.env` to `.gitignore`

2. **Authentication**:
   - All endpoints require JWT token
   - User-specific course generation (userId tracked)

3. **Input Validation**:
   - Topic: Required, non-empty string
   - Difficulty: Enum validation (beginner/intermediate/advanced)
   - Number of lessons: Range validation (3-15)

## 📝 Usage Examples

### Example 1: Generate Beginner Course
```javascript
// Frontend request
const response = await fetch('http://localhost:5000/api/generate-course', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    topic: 'JavaScript Fundamentals',
    difficulty: 'beginner',
    numberOfLessons: 5
  })
});

const data = await response.json();
console.log(data.course);
```

### Example 2: Preview Advanced Course
```javascript
const response = await fetch('http://localhost:5000/api/generate-course/preview', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    topic: 'Advanced React Patterns',
    difficulty: 'advanced',
    numberOfLessons: 10
  })
});

const preview = await response.json();
console.log(preview.preview);
```

## 🧪 Testing the Integration

### Test via cURL (Windows PowerShell)
```powershell
# Generate a course
$token = "your_jwt_token"
$body = @{
    topic = "Introduction to Web Development"
    difficulty = "beginner"
    numberOfLessons = 5
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/generate-course" `
  -Method POST `
  -Headers @{"Authorization"="Bearer $token"; "Content-Type"="application/json"} `
  -Body $body
```

### Test via Postman
1. **Setup**:
   - Method: POST
   - URL: `http://localhost:5000/api/generate-course`
   - Headers: 
     - `Content-Type`: `application/json`
     - `Authorization`: `Bearer YOUR_JWT_TOKEN`

2. **Body** (JSON):
```json
{
  "topic": "Python for Data Science",
  "difficulty": "intermediate",
  "numberOfLessons": 6
}
```

## ⚡ Performance Considerations

1. **Response Time**: 
   - Course generation takes 10-30 seconds depending on content length
   - Consider implementing loading states in frontend

2. **Rate Limits**:
   - Gemini API has rate limits (check Google's documentation)
   - Implement retry logic with exponential backoff

3. **Cost Optimization**:
   - Use preview endpoint for testing
   - Cache generated content when possible
   - Monitor API usage in Google Cloud Console

## 🐛 Troubleshooting

### Common Issues

**Issue 1: "Failed to parse AI response"**
- **Cause**: Gemini returned non-JSON content
- **Solution**: The code strips markdown formatting automatically, but verify API key is valid

**Issue 2: "Invalid course structure generated"**
- **Cause**: Missing required fields in response
- **Solution**: Check the prompt template and ensure it matches schema requirements

**Issue 3: "GEMINI_API_KEY not found"**
- **Cause**: Environment variable not set
- **Solution**: Verify `.env` file exists and contains `GEMINI_API_KEY`

## 📈 Future Enhancements

- [ ] Support for different course formats (video, interactive)
- [ ] Multi-language course generation
- [ ] Course difficulty adjustment based on user progress
- [ ] Integration with image generation for lesson illustrations
- [ ] Batch course generation
- [ ] Course quality scoring and validation
- [ ] User feedback loop to improve generation

## 📚 Resources

- [Gemini API Documentation](https://ai.google.dev/docs)
- [Get API Key](https://makersuite.google.com/app/apikey)
- [Gemini Pricing](https://ai.google.dev/pricing)
- [Best Practices for Prompting](https://ai.google.dev/docs/prompting_intro)

---

**Created**: November 3, 2025
**Version**: 1.0.0
**Status**: Production Ready ✅
