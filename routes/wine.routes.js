const express = require("express");
const router = express.Router();
const Wine = require("../models/Wine.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const { isAdmin } = require("../middleware/admin.middleware");

//GET request for /wines, for all Wines (public)
router.get("/", (req, res) => {
    Wine.find()
    .then((wines) => res.status(200).json({ data: wines}))
    .catch((error) => res.status(500).json({ error: "Failed to fetch wines", details: error })
);
});

//POST request to /wines, add new wines to the API (Admins only)
router.post("/", isAuthenticated, isAdmin, (req, res) => {
    Wine.create(req.body)
    .then((newWine) => res.status(201).json({ data: newWine}))
    .catch((error) => res.status(400).json({ error: "Failed to add new wine"})
);
});

//PUT request to /Wines/:id, Update a wine by ID (Admins only)
router.put("/:id", isAuthenticated, isAdmin, (req, res) => {
    Wine.findByIdAndUpdate(req.params.id, req.body, { new:true })
    .then((updatedWine) => {
        if(!updatedWine) return res.status(404).json({ error: "Wine not found" });
        res.status(200).json({ data: updatedWine });
    })
    .catch((error) => {
        res.status(400).json({ error: "Failed to update Wine", details: error })
    });
});

// DELETE request to /wines/:id, deletes a wine by ID (Admins only)
router.delete("/:id", isAuthenticated, isAdmin, (req, res) => {
    Wine.findByIdAndDelete(req.params.id)
    .then((deletedWine) => {
        if (!deletedWine) return res.status(404).json({ error: "Wine not found "});
        res.status(200).json({ message: "Wine has been successfully deleted "});
    })
    .catch((error) => {
        res.status(400).json({ error: "failed to delete wine", details: error })
    });
});

module.exports = router;