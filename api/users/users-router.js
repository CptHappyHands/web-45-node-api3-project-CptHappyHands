const express = require("express");
const Users = require("./users-model");
const Posts = require("../posts/posts-model");
const {
  logger,
  validateUser,
  validateUserId,
} = require("../middleware/middleware");

// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required

const router = express.Router();

router.get("/", logger, (req, res, next) => {
  Users.get(req.params.id)
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((error) => {
      next(error);
    });
  // RETURN AN ARRAY WITH ALL THE USERS
});

router.get("/:id", logger, validateUserId, async (req, res, next) => {
  Users.getById(req.params.id)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((error) => {
      next(error);
    });
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
});

router.post("/", validateUser, (req, res, next) => {
  Users.insert(req.body)
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((error) => {
      next(error);
    });
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
});

router.put("/:id", validateUserId, validateUser, async (req, res, next) => {
  const { id, name } = req.body;
  if (!id || !name) {
    res.status(400).json({ message: "This isn't working" });
  } else {
    Users.getById(req.params.id)
      .then((user) => {
        if (!user) {
          res.status(404).json({
            message: "The specified Id does not exist",
          });
        } else {
          return Users.insert(req.params.id, req.body);
        }
      })
      .then((data) => {
        if (data) {
          return Users.getById(req.params.id, req.body);
        }
      })
      .then((moreData) => {
        if (moreData) {
          res.json(moreData);
        }
      })
      .catch((error) => {
        next(error);
      });
  }
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
});

router.delete("/:id", validateUserId, (req, res) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
});

router.get("/:id/posts", validateUserId, (req, res) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
});

router.post("/:id/posts", validateUserId, (req, res) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
});

// do not forget to export the router
module.exports = router;
