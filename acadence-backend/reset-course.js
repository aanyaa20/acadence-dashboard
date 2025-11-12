import mongoose from 'mongoose';
import Lesson from './models/Lesson.js';
import Quiz from './models/Quiz.js';
import Course from './models/Course.js';

const COURSE_ID = '69132613bd264e1f397acaf4';
const QUIZ_ID = '69132613bd264e1f397acb00';

async function resetCourse() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/acadence_db');
    console.log('✅ Connected to MongoDB');

    // Reset all lessons in the course
    const lessonResult = await Lesson.updateMany(
      { courseId: COURSE_ID },
      { 
        $set: { 
          completedBy: [],
          completed: false 
        } 
      }
    );
    console.log(`✅ Reset ${lessonResult.modifiedCount} lessons`);

    // Reset the quiz
    const quizResult = await Quiz.updateOne(
      { _id: QUIZ_ID },
      { 
        $set: { 
          attempts: []
        } 
      }
    );
    console.log(`✅ Reset quiz (${quizResult.modifiedCount} modified)`);

    // Reset course completion count
    const courseResult = await Course.updateOne(
      { _id: COURSE_ID },
      { 
        $set: { 
          completedLessons: 0
        } 
      }
    );
    console.log(`✅ Reset course completion count`);

    console.log('\n🎉 Course reset complete! You can now earn points again.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

resetCourse();
