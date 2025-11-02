import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

console.log('🔍 Testing MongoDB Connection...');
console.log('Connection String (masked):', MONGO_URI.replace(/:[^:@]+@/, ':****@'));

mongoose
  .connect(MONGO_URI, {
    serverSelectionTimeoutMS: 30000, // Increased to 30 seconds for paused cluster
    socketTimeoutMS: 45000,
  })
  .then(() => {
    console.log('✅ SUCCESS! Connected to MongoDB');
    console.log('Database:', mongoose.connection.name);
    console.log('Host:', mongoose.connection.host);
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ FAILED! Connection error:', err.message);
    console.error('\n📋 Error Details:');
    console.error('- Error Name:', err.name);
    if (err.reason) {
      console.error('- Reason:', err.reason);
    }
    console.error('\n💡 Solutions:');
    console.error('1. Wait 3-5 minutes after whitelisting IP');
    console.error('2. Check Database Access → Verify user exists');
    console.error('3. Check Network Access → Verify IP is whitelisted');
    console.error('4. Regenerate connection string from Atlas');
    console.error('5. Try 0.0.0.0/0 for testing (less secure)');
    process.exit(1);
  });
