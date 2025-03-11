const roleAuth = (allowedRoles) => {
  return (req, res, next) => {
    try {
      const { role } = req.user;
      if (!role || !allowedRoles.includes(role)) {
        throw new Error("You are not allowed to perform this action");
      }
      next();
    } catch (error) {
      throw new Error("Unauthorized");
    }
  };
};

export default roleAuth;
