const protect = (req, res, next) => {
    // Later we'll verify JWT here
    next(); // allow request to continue
  };
  
  module.exports = { protect };
  