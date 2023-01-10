import express from "express";
import User from "../models/User.js";
import path from 'path'
import multer from 'multer'

const router = express.Router()

router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("Account Deleted Succesfully");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).send("You can Only Update Your Account");
  }
});

router.get("/id/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, updatedAt, ...remaining } =
      user._doc; /* user._doc => JSON that is resulted */
    res
      .status(200)
      .json(user); /* Removing uneccesary fields for the response JSON */
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
});

router.get("/:wallet", async (req, res) => {
  try {
    const user = await User.findOne({
      wallet: req.params.wallet
    });
    res
      .status(200)
      .json(user); /* Removing uneccesary fields for the response JSON */
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
});

router.get("/", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.query.username });
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

export default router;
