const User = require("../users/users-model");

// const Post = require("../posts/posts-model");

function logger(req, res, next) {
  console.log(`[${new Date().toISOString()}]${req.method} to ${req.url}`);
  next();
}

function validateUserId(req, res, next) {
  const { id } = req.params;
  User.getById(id).then((possibleUser) => {
    if (possibleUser) {
      req.id = possibleUser;
      next();
    } else {
      next({ message: "user not found", status: 404 });
    }
  });
  next();
}

function validateUser(req, res, next) {
  if (!req.body.name) {
    res.status(400).json({ message: "missing required name field" });
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  if (!req.body.text) {
    res.status(400).json({ message: "missing required text field" });
  } else {
    next();
  }
}

// do not forget to expose these functions to other modules
module.exports = { logger, validateUserId, validateUser, validatePost };
