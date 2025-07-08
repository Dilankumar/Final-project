

export const isAdmin = (req, res, next) => {
    // Check if user exists and has admin role
    if (req.user && req.user.role === 'admin') {
      next(); // Allow access
    } else {
      res.status(403).json({ message: 'Access denied: Admins only' });
    }
  };


  
  
