const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const crypto = require('crypto');

class AuthService {
  constructor() {
    this.app = express();
    this.users = new Map();
    this.sessions = new Map();
    this.setupMiddleware();
    this.setupRoutes();
    this.initializeHeavyData();
  }

  setupMiddleware() {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(express.json());
    
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100
    });
    this.app.use(limiter);
  }

  setupRoutes() {
    this.app.post('/register', this.register.bind(this));
    this.app.post('/login', this.login.bind(this));
    this.app.post('/refresh', this.refreshToken.bind(this));
    this.app.post('/logout', this.logout.bind(this));
    this.app.get('/verify', this.verifyToken.bind(this));
    this.app.get('/health', (req, res) => res.json({ status: 'healthy' }));
  }

  initializeHeavyData() {
    // Generate heavy user data for testing
    for (let i = 0; i < 10000; i++) {
      const userId = `user_${i}`;
      this.users.set(userId, {
        id: userId,
        email: `user${i}@example.com`,
        password: bcrypt.hashSync(`password${i}`, 12),
        profile: this.generateHeavyProfile(i),
        permissions: this.generatePermissions(i),
        metadata: this.generateMetadata(i)
      });
    }
  }

  generateHeavyProfile(index) {
    return {
      firstName: `FirstName${index}`,
      lastName: `LastName${index}`,
      preferences: Array.from({ length: 50 }, (_, i) => ({
        key: `pref_${i}`,
        value: Math.random() > 0.5,
        metadata: {
          created: new Date(),
          updated: new Date(),
          version: Math.floor(Math.random() * 10)
        }
      })),
      history: Array.from({ length: 100 }, (_, i) => ({
        action: `action_${i}`,
        timestamp: new Date(Date.now() - i * 86400000),
        data: this.generateRandomData()
      })),
      analytics: this.generateAnalytics(index)
    };
  }

  generatePermissions(index) {
    const permissions = ['read', 'write', 'delete', 'admin', 'moderate'];
    return permissions.filter(() => Math.random() > 0.5).map(perm => ({
      permission: perm,
      scope: `scope_${index % 10}`,
      granted: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      metadata: this.generateRandomData()
    }));
  }

  generateMetadata(index) {
    return {
      createdAt: new Date(Date.now() - index * 1000),
      lastLogin: new Date(),
      loginCount: Math.floor(Math.random() * 1000),
      devices: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, i) => ({
        id: `device_${index}_${i}`,
        type: ['mobile', 'desktop', 'tablet'][Math.floor(Math.random() * 3)],
        lastSeen: new Date(),
        fingerprint: crypto.randomBytes(32).toString('hex')
      })),
      security: {
        failedAttempts: Math.floor(Math.random() * 10),
        lastFailedAttempt: new Date(),
        passwordChanges: Array.from({ length: Math.floor(Math.random() * 10) }, () => ({
          timestamp: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
          reason: ['expired', 'compromised', 'voluntary'][Math.floor(Math.random() * 3)]
        }))
      }
    };
  }

  generateAnalytics(index) {
    return {
      pageViews: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
        count: Math.floor(Math.random() * 100),
        pages: Array.from({ length: Math.floor(Math.random() * 20) }, (_, j) => ({
          path: `/page/${j}`,
          views: Math.floor(Math.random() * 50),
          timeSpent: Math.floor(Math.random() * 300)
        }))
      })),
      interactions: this.generateInteractions(index),
      performance: this.generatePerformanceMetrics()
    };
  }

  generateInteractions(index) {
    return Array.from({ length: 200 }, (_, i) => ({
      type: ['click', 'scroll', 'hover', 'focus'][Math.floor(Math.random() * 4)],
      element: `element_${i}`,
      timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      coordinates: { x: Math.floor(Math.random() * 1920), y: Math.floor(Math.random() * 1080) },
      sessionId: `session_${index}_${Math.floor(i / 20)}`,
      metadata: this.generateRandomData()
    }));
  }

  generatePerformanceMetrics() {
    return {
      loadTimes: Array.from({ length: 100 }, () => ({
        page: `/page/${Math.floor(Math.random() * 50)}`,
        loadTime: Math.random() * 5000,
        timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
      })),
      errors: Array.from({ length: 20 }, (_, i) => ({
        message: `Error ${i}`,
        stack: `Stack trace ${i}`,
        timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        severity: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)]
      }))
    };
  }

  generateRandomData() {
    return {
      randomString: crypto.randomBytes(16).toString('hex'),
      randomNumber: Math.random() * 1000,
      randomArray: Array.from({ length: 10 }, () => Math.random()),
      randomObject: {
        nested: {
          deep: {
            value: Math.random(),
            timestamp: new Date()
          }
        }
      }
    };
  }

  async register(req, res) {
    try {
      const { email, password } = req.body;
      
      // Heavy validation and processing
      await this.performHeavyValidation(email, password);
      
      const hashedPassword = await bcrypt.hash(password, 12);
      const userId = crypto.randomUUID();
      
      const user = {
        id: userId,
        email,
        password: hashedPassword,
        profile: this.generateHeavyProfile(Date.now()),
        permissions: this.generatePermissions(Date.now()),
        metadata: this.generateMetadata(Date.now())
      };
      
      this.users.set(userId, user);
      
      const token = this.generateToken(userId);
      const refreshToken = this.generateRefreshToken(userId);
      
      res.json({
        success: true,
        token,
        refreshToken,
        user: { id: userId, email }
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      
      // Heavy authentication process
      const user = await this.performHeavyAuthentication(email, password);
      
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      const token = this.generateToken(user.id);
      const refreshToken = this.generateRefreshToken(user.id);
      
      // Update user metadata
      user.metadata.lastLogin = new Date();
      user.metadata.loginCount++;
      
      res.json({
        success: true,
        token,
        refreshToken,
        user: { id: user.id, email: user.email }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async performHeavyValidation(email, password) {
    // Simulate heavy validation
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Complex email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }
    
    // Complex password validation
    if (password.length < 8) {
      throw new Error('Password too short');
    }
    
    // Check against common passwords (simulate heavy operation)
    const commonPasswords = Array.from({ length: 1000 }, (_, i) => `password${i}`);
    if (commonPasswords.includes(password)) {
      throw new Error('Password too common');
    }
    
    return true;
  }

  async performHeavyAuthentication(email, password) {
    // Simulate heavy database lookup
    await new Promise(resolve => setTimeout(resolve, 50));
    
    let foundUser = null;
    for (const [userId, user] of this.users) {
      if (user.email === email) {
        foundUser = user;
        break;
      }
    }
    
    if (!foundUser) return null;
    
    // Heavy password comparison
    const isValid = await bcrypt.compare(password, foundUser.password);
    if (!isValid) return null;
    
    // Additional security checks
    await this.performSecurityChecks(foundUser);
    
    return foundUser;
  }

  async performSecurityChecks(user) {
    // Simulate heavy security analysis
    await new Promise(resolve => setTimeout(resolve, 30));
    
    // Check for suspicious activity
    const recentFailures = user.metadata.security.failedAttempts;
    if (recentFailures > 5) {
      throw new Error('Account temporarily locked');
    }
    
    // Analyze login patterns
    const loginHistory = user.profile.history.filter(h => h.action === 'login');
    if (loginHistory.length > 0) {
      // Complex pattern analysis
      const patterns = this.analyzeLoginPatterns(loginHistory);
      if (patterns.suspicious) {
        throw new Error('Suspicious login pattern detected');
      }
    }
  }

  analyzeLoginPatterns(history) {
    // Heavy pattern analysis
    const timeIntervals = [];
    for (let i = 1; i < history.length; i++) {
      const interval = history[i].timestamp - history[i-1].timestamp;
      timeIntervals.push(interval);
    }
    
    const avgInterval = timeIntervals.reduce((a, b) => a + b, 0) / timeIntervals.length;
    const variance = timeIntervals.reduce((sum, interval) => 
      sum + Math.pow(interval - avgInterval, 2), 0) / timeIntervals.length;
    
    return {
      suspicious: variance > 1000000, // Arbitrary threshold
      avgInterval,
      variance
    };
  }

  generateToken(userId) {
    return jwt.sign(
      { userId, type: 'access' },
      'secret_key',
      { expiresIn: '15m' }
    );
  }

  generateRefreshToken(userId) {
    const token = jwt.sign(
      { userId, type: 'refresh' },
      'refresh_secret',
      { expiresIn: '7d' }
    );
    
    this.sessions.set(token, {
      userId,
      createdAt: new Date(),
      lastUsed: new Date()
    });
    
    return token;
  }

  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;
      
      const session = this.sessions.get(refreshToken);
      if (!session) {
        return res.status(401).json({ error: 'Invalid refresh token' });
      }
      
      const decoded = jwt.verify(refreshToken, 'refresh_secret');
      const newToken = this.generateToken(decoded.userId);
      
      session.lastUsed = new Date();
      
      res.json({ token: newToken });
    } catch (error) {
      res.status(401).json({ error: 'Invalid refresh token' });
    }
  }

  async logout(req, res) {
    try {
      const { refreshToken } = req.body;
      this.sessions.delete(refreshToken);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async verifyToken(req, res) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }
      
      const decoded = jwt.verify(token, 'secret_key');
      const user = this.users.get(decoded.userId);
      
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }
      
      res.json({
        valid: true,
        user: { id: user.id, email: user.email }
      });
    } catch (error) {
      res.status(401).json({ error: 'Invalid token' });
    }
  }

  start(port = 3001) {
    this.app.listen(port, () => {
      console.log(`Auth service running on port ${port}`);
    });
  }
}

const authService = new AuthService();
authService.start();
