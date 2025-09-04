const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User.model");

// Used for local testing purposes only. Remove or protect in production!
router.post("/create-admin", (req, res) => {
  const { email, password, name } = req.body;

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  User.create({ email, password: hashedPassword, name, role: "admin" })
    .then(admin => res.status(201).json({ admin }))
    .catch(err => res.status(500).json({ error: err.message }));
});

module.exports = router;