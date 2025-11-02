/**
 * Test file for Gemini Course Generation API
 * 
 * This file contains test scenarios for the course generation endpoints.
 * Run these tests manually or integrate with your testing framework.
 */

// ========================================
// TEST CONFIGURATION
// ========================================
const BASE_URL = 'http://localhost:5000';
const TEST_TOKEN = 'YOUR_JWT_TOKEN_HERE'; // Replace with a valid JWT token

// ========================================
// TEST UTILITIES
// ========================================
async function makeRequest(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TEST_TOKEN}`
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    return { error: error.message };
  }
}

// ========================================
// TEST CASES
// ========================================

// Test 1: Generate a basic beginner course
async function testBasicCourseGeneration() {
  console.log('\n🧪 Test 1: Generate Basic Beginner Course');
  console.log('===========================================');
  
  const result = await makeRequest('/api/generate-course', 'POST', {
    topic: 'Introduction to JavaScript',
    difficulty: 'beginner',
    numberOfLessons: 5
  });
  
  console.log('Status:', result.status);
  console.log('Response:', JSON.stringify(result.data, null, 2));
  
  // Assertions
  if (result.status === 201) {
    console.log('✅ Test PASSED: Course generated successfully');
    console.log(`   - Course ID: ${result.data.course._id}`);
    console.log(`   - Lessons Created: ${result.data.course.lessonsCount}`);
    console.log(`   - Quiz ID: ${result.data.course.quizId}`);
  } else {
    console.log('❌ Test FAILED:', result.data.error);
  }
}

// Test 2: Preview course without saving
async function testCoursePreview() {
  console.log('\n🧪 Test 2: Preview Course (No Save)');
  console.log('=====================================');
  
  const result = await makeRequest('/api/generate-course/preview', 'POST', {
    topic: 'Python Programming',
    difficulty: 'intermediate',
    numberOfLessons: 6
  });
  
  console.log('Status:', result.status);
  console.log('Preview generated:', result.data.message);
  
  if (result.status === 200) {
    console.log('✅ Test PASSED: Preview generated');
    console.log(`   - Course Title: ${result.data.preview.course.title}`);
    console.log(`   - Lessons: ${result.data.preview.lessons.length}`);
    console.log(`   - Quiz Questions: ${result.data.preview.quiz.questions.length}`);
  } else {
    console.log('❌ Test FAILED:', result.data.error);
  }
}

// Test 3: Generate advanced course with many lessons
async function testAdvancedCourse() {
  console.log('\n🧪 Test 3: Generate Advanced Course');
  console.log('====================================');
  
  const result = await makeRequest('/api/generate-course', 'POST', {
    topic: 'Machine Learning Algorithms',
    difficulty: 'advanced',
    numberOfLessons: 10
  });
  
  console.log('Status:', result.status);
  
  if (result.status === 201) {
    console.log('✅ Test PASSED: Advanced course generated');
    console.log(`   - Difficulty: ${result.data.course.difficulty}`);
    console.log(`   - Total Lessons: ${result.data.course.totalLessons}`);
  } else {
    console.log('❌ Test FAILED:', result.data.error);
  }
}

// Test 4: Invalid input - empty topic
async function testInvalidInput() {
  console.log('\n🧪 Test 4: Invalid Input (Empty Topic)');
  console.log('========================================');
  
  const result = await makeRequest('/api/generate-course', 'POST', {
    topic: '',
    difficulty: 'beginner',
    numberOfLessons: 5
  });
  
  console.log('Status:', result.status);
  
  if (result.status === 400) {
    console.log('✅ Test PASSED: Validation error caught');
    console.log(`   - Error: ${result.data.error}`);
  } else {
    console.log('❌ Test FAILED: Should return 400 for empty topic');
  }
}

// Test 5: Invalid input - out of range lessons
async function testInvalidLessonCount() {
  console.log('\n🧪 Test 5: Invalid Lesson Count');
  console.log('=================================');
  
  const result = await makeRequest('/api/generate-course', 'POST', {
    topic: 'Web Development',
    difficulty: 'beginner',
    numberOfLessons: 20 // Out of range (max 15)
  });
  
  console.log('Status:', result.status);
  
  if (result.status === 400) {
    console.log('✅ Test PASSED: Validation error caught');
    console.log(`   - Error: ${result.data.error}`);
  } else {
    console.log('❌ Test FAILED: Should return 400 for invalid lesson count');
  }
}

// Test 6: Test without authentication
async function testNoAuth() {
  console.log('\n🧪 Test 6: No Authentication');
  console.log('==============================');
  
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
      // No Authorization header
    },
    body: JSON.stringify({
      topic: 'Test Topic',
      difficulty: 'beginner',
      numberOfLessons: 5
    })
  };
  
  try {
    const response = await fetch(`${BASE_URL}/api/generate-course`, options);
    const data = await response.json();
    
    console.log('Status:', response.status);
    
    if (response.status === 401) {
      console.log('✅ Test PASSED: Authentication required');
      console.log(`   - Error: ${data.message}`);
    } else {
      console.log('❌ Test FAILED: Should return 401 without token');
    }
  } catch (error) {
    console.log('❌ Test ERROR:', error.message);
  }
}

// ========================================
// RUN ALL TESTS
// ========================================
async function runAllTests() {
  console.log('\n');
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║     GEMINI COURSE GENERATION API - TEST SUITE             ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log(`\nBase URL: ${BASE_URL}`);
  console.log(`Token: ${TEST_TOKEN.substring(0, 20)}...`);
  console.log('\n⚠️  Note: Replace TEST_TOKEN with a valid JWT token before running\n');
  
  // Run tests sequentially (to avoid rate limits)
  await testNoAuth();
  
  if (TEST_TOKEN !== 'YOUR_JWT_TOKEN_HERE') {
    await testInvalidInput();
    await testInvalidLessonCount();
    await testCoursePreview();
    await testBasicCourseGeneration();
    // await testAdvancedCourse(); // Uncomment if you want to test advanced course
    
    console.log('\n');
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║                   TEST SUITE COMPLETED                     ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log('\n');
  } else {
    console.log('\n⚠️  Cannot run authenticated tests without valid JWT token');
    console.log('   Please replace TEST_TOKEN at the top of this file\n');
  }
}

// ========================================
// MANUAL TEST SCENARIOS
// ========================================

// Scenario 1: Quick test with cURL (PowerShell)
function printCurlCommands() {
  console.log('\n📋 cURL Test Commands (PowerShell):\n');
  
  console.log('# Test 1: Generate Course');
  console.log('$token = "YOUR_JWT_TOKEN"');
  console.log('$body = @{');
  console.log('    topic = "Web Development"');
  console.log('    difficulty = "beginner"');
  console.log('    numberOfLessons = 5');
  console.log('} | ConvertTo-Json');
  console.log('');
  console.log('Invoke-RestMethod -Uri "http://localhost:5000/api/generate-course" `');
  console.log('  -Method POST `');
  console.log('  -Headers @{"Authorization"="Bearer $token"; "Content-Type"="application/json"} `');
  console.log('  -Body $body\n');
  
  console.log('\n# Test 2: Preview Course');
  console.log('$previewBody = @{');
  console.log('    topic = "Python Basics"');
  console.log('    difficulty = "beginner"');
  console.log('    numberOfLessons = 3');
  console.log('} | ConvertTo-Json');
  console.log('');
  console.log('Invoke-RestMethod -Uri "http://localhost:5000/api/generate-course/preview" `');
  console.log('  -Method POST `');
  console.log('  -Headers @{"Authorization"="Bearer $token"; "Content-Type"="application/json"} `');
  console.log('  -Body $previewBody\n');
}

// ========================================
// EXPORT / RUN
// ========================================

// For Node.js execution
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    runAllTests,
    testBasicCourseGeneration,
    testCoursePreview,
    testAdvancedCourse,
    testInvalidInput,
    testInvalidLessonCount,
    testNoAuth,
    printCurlCommands
  };
}

// Auto-run if executed directly
if (typeof require !== 'undefined' && require.main === module) {
  runAllTests().catch(console.error);
}

// Print cURL commands for manual testing
printCurlCommands();
