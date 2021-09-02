const express = require("express");
const Users = require("./users-model");
const Posts = require("../posts/posts-model");
const {
  logger,
  validateUser,
  validateUserId,
  validatePost,
} = require("../middleware/middleware");

// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required

const router = express.Router();

router.get("/", logger, (req, res, next) => {
  Users.get()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      next(err);
    });
  // RETURN AN ARRAY WITH ALL THE USERS
});

router.get("/:id", validateUserId, async (req, res, next) => {
  res.json(req.user);
});

router.post("/", validateUser, (req, res, next) => {
  Users.insert({ name: req.name })
    .then((newUser) => {
      res.status(201).json(newUser);
    })
    .catch((err) => {
      next(err);
    });

  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
});

router.put("/:id", validateUserId, validateUser, (req, res, next) => {
  Users.update(req.params.id, { name: req.name })
    .then(() => {
      return Users.getById(req.params.id);
    })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      next(err);
    });
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
});

router.delete("/:id", validateUserId, async (req, res, next) => {
  try {
    await Users.remove(req.params.id);
    res.json(req.user);
  } catch (err) {
    next(err);
  }
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
});

router.get("/:id/posts", validateUserId, async (req, res, next) => {
  try {
    const result = await Users.getUserPosts(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
});

router.post(
  "/:id/posts",
  validateUserId,
  validatePost,
  async (req, res, next) => {
    try {
      const result = await Posts.insert({
        user_id: req.params.id,
        text: req.text,
      });
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }

    // RETURN THE NEWLY CREATED USER POST
    // this needs a middleware to verify user id
    // and another middleware to check that the request body is valid
  }
);

router.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    customMessage: "bad things happened in posts",
    message: err.message,
    stack: err.stack,
  });
});

// do not forget to export the router
module.exports = router;
