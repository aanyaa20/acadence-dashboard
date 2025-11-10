import jwt from 'jsonwebtoken';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Access token is required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');
    req.user = decoded;
    
    // Normalize user id field (handle both 'id' and 'userId')
    if (decoded.userId && !decoded.id) {
      req.user.id = decoded.userId;
    } else if (decoded.id && !decoded.userId) {
      req.user.userId = decoded.id;
    }
    
    console.log("✅ Token validated. User ID:", req.user.id || req.user.userId);
    next();
  } catch (error) {
    console.error("❌ Token validation failed:", error.message);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

export { authenticateToken };