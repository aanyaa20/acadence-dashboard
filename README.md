# Acadence - Modern E-Learning Platform

A full-stack learning management system built with the MERN stack, featuring AI-powered course generation, interactive learning paths, and gamified progress tracking.

## ✨ What Makes Acadence Special

Acadence transforms online learning into an engaging experience through intelligent features and a sleek, modern interface. The platform combines adaptive learning with gamification to keep learners motivated and on track.

### Core Features

**🎯 Smart Learning Dashboard**
- Real-time progress tracking with animated visualizations
- Learning streak system with milestone celebrations
- Interactive calendar showing daily activity
- Achievement badges that unlock as you progress
- Weekly goals with dynamic progress bars

**🤖 AI Course Generation**
- Generate complete courses using Google Gemini AI
- Customizable course difficulty and lesson count
- Structured learning paths with quizzes
- Intelligent content suggestions

**📚 Course Management**
- Browse and enroll in various courses
- Track completion status across all enrolled courses
- Resume learning from where you left off
- Detailed course progress analytics

**🎮 Gamification Elements**
- Point-based reward system
- Streak tracking with confetti celebrations
- Achievement badges (First Course, Week Streak, Quiz Master, etc.)
- Visual progress indicators

**🎨 Modern UI/UX**
- Dark mode optimized interface
- Smooth animations with Framer Motion
- Responsive design for all devices
- Custom theme system with CSS variables

## 🛠️ Tech Stack

### Frontend
- **React 19** - Latest React with concurrent features
- **Vite** - Lightning-fast build tool
- **React Router v7** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Recharts** - Data visualization
- **React Icons** - Comprehensive icon library
- **Canvas Confetti** - Celebration effects

### Backend
- **Node.js & Express** - RESTful API server
- **MongoDB & Mongoose** - NoSQL database
- **JWT** - Secure authentication
- **bcrypt** - Password hashing
- **Google Generative AI** - AI course generation
- **Nodemailer** - Email functionality

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Google Gemini API key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/aanyaa20/acadence.git
cd acadence
```

2. **Set up the backend**
```bash
cd acadence-backend
npm install

# Create .env file
echo "MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
PORT=5000" > .env

# Start the backend server
npm run dev
```

3. **Set up the frontend**
```bash
cd ../acadence-frontend
npm install

# Start the development server
npm run dev
```

4. **Access the application**
- Frontend: http://localhost:5174
- Backend API: http://localhost:5000

## 📁 Project Structure

```
acadence/
├── acadence-backend/
│   ├── config/           # Configuration files
│   ├── middleware/       # Authentication & validation
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   └── server.js        # Express server setup
│
├── acadence-frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Route pages
│   │   ├── context/     # React context providers
│   │   ├── lib/         # Utility functions
│   │   └── assets/      # Static files
│   └── public/          # Public assets
```

## 🎯 Key Features Breakdown

### Learning Streak System
Tracks consecutive days of learning activity with:
- Current streak counter
- Longest streak record
- Daily activity calendar with color-coded intensity
- Milestone celebrations at 3, 7, 14, 30, 50, and 100 days
- Motivational messages based on progress

### AI Course Generator
Powered by Google Gemini AI to create:
- Structured course outlines
- Multiple lessons per course
- Interactive quizzes with explanations
- Difficulty-based content adaptation

### Progress Analytics
Visual insights into learning journey:
- Circular progress indicators with smooth animations
- Completion percentages
- Points earned tracking
- Course-wise progress breakdown

### Achievement System
Unlock badges by completing milestones:
- 🎓 First Course - Complete your first course
- 🔥 Week Streak - Maintain 7-day learning streak
- ⭐ Quiz Master - Score 100+ points
- 📚 10 Lessons - Complete 10 lessons
- 🌅 Early Bird - Learn early in the morning
- ✅ Perfectionist - Score 100% on quizzes

## 🔐 Authentication

Secure user authentication with:
- JWT-based session management
- bcrypt password encryption
- Protected routes on frontend
- Token validation middleware
- Automatic session refresh

## 🎨 Theme System

Custom CSS variable-based theming:
```css
--color-primary: Dynamic primary color
--color-bg-elevated: Elevated surface color
--gradient-primary: Branded gradients
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Courses
- `GET /api/courses` - List all courses
- `POST /api/courses` - Create course
- `GET /api/courses/:id` - Get course details
- `POST /api/courses/generate` - AI generate course

### Lessons
- `GET /api/lessons/:courseId` - Get course lessons
- `POST /api/lessons/:id/complete` - Mark lesson complete

### Quizzes
- `GET /api/quizzes/:lessonId` - Get quiz
- `POST /api/quizzes/:id/submit` - Submit quiz answers

## 🤝 Contributing

Contributions are welcome! Feel free to:
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Google Gemini AI for intelligent course generation
- React community for amazing libraries
- All contributors and users of Acadence

---

Built with ❤️ for learners everywhere