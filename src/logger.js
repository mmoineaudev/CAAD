// Centralized logging module for consistent error tracking and debugging

const logger = {
  // Log levels
  levels: {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3
  },
  
  // Current log level (default: INFO)
  level: 1, // INFO
  
  // Set log level
  setLevel(level) {
    if (level in this.levels) {
      this.level = this.levels[level];
    }
  },
  
  // Format timestamp
  formatTimestamp() {
    const now = new Date();
    return now.toISOString();
  },
  
  // Log message with level
  log(level, message, ...args) {
    if (level <= this.level) {
      const timestamp = this.formatTimestamp();
      const prefix = `[${timestamp}] [${this.getLevelName(level)}]`;
      
      // Use console methods based on level
      switch (level) {
        case this.levels.DEBUG:
          console.debug(`${prefix} ${message}`, ...args);
          break;
        case this.levels.INFO:
          console.log(`${prefix} ${message}`, ...args);
          break;
        case this.levels.WARN:
          console.warn(`${prefix} ${message}`, ...args);
          break;
        case this.levels.ERROR:
          console.error(`${prefix} ${message}`, ...args);
          break;
        default:
          console.log(`${prefix} ${message}`, ...args);
      }
      
      // Log to file if configured (for production)
      // This can be extended to write to a log file
    }
  },
  
  // Get level name from number
  getLevelName(level) {
    for (const [name, value] of Object.entries(this.levels)) {
      if (value === level) {
        return name;
      }
    }
    return 'UNKNOWN';
  },
  
  // Convenience methods
  debug(message, ...args) {
    this.log(this.levels.DEBUG, message, ...args);
  },
  
  info(message, ...args) {
    this.log(this.levels.INFO, message, ...args);
  },
  
  warn(message, ...args) {
    this.log(this.levels.WARN, message, ...args);
  },
  
  error(message, ...args) {
    this.log(this.levels.ERROR, message, ...args);
  },
  
  // Initialize logger with optional log file path
  init(logFilePath = null) {
    this.logFilePath = logFilePath;
    this.info('Logger initialized');
  }
};

module.exports = logger;
