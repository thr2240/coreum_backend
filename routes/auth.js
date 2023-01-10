import express from 'express'
import User from '../models/User.js'
import bcrypt from 'bcrypt'
import path from 'path'
import multer from 'multer'

const router = express.Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

let upload = multer({ storage, fileFilter });

router.post("/photo", upload.single("photo"), async (req, res) => {
    let photo = '';
    if (req.file) {
        photo = req.file.filename;
    }
    try {
        res.status(200).json(photo);
    } catch (err) {
        console.log(err)
        return res.status(500).json(err);
    }
})

router.post("/cover", upload.single("cover"), async (req, res) => {
    let cover = '';
    if (req.file) {
        cover = req.file.filename;
    }
    try {
        res.status(200).json(cover);
    } catch (err) {
        console.log(err)
        return res.status(500).json(err);
    }
})

router.post("/signup", async (req, res) => {
    try {
        const user = await User.findOne({
            wallet: req.body.wallet
        });
        const updates = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            username: req.body.username,
            wallet: req.body.wallet,
            bio: req.body.bio,
            email: req.body.email,
            photo: req.body.photo,
            cover: req.body.cover
        }
        if (user) {
            if (user.username !== req.body.username) {
                const username = await User.findOne({
                    username: req.body.username
                });
                if (username) {
                    res.status(200).json({
                        code: "exist",
                        res: "Username already exist."
                    })
                    return;
                }
            }
            await User.findByIdAndUpdate(user._id, {
                $set: updates,
            });
            res.status(200).json({
                code: "update",
                res: "Succesfully updated the profile."
            });
        } else {
            const username = await User.findOne({
                username: req.body.username
            });
            if (username) {
                res.status(200).json({
                    code: "exist",
                    res: "Username already exist"
                })
                return;
            }
            const newuser = new User(updates);
            /* Save User and Return */
            const user = await newuser.save()
            res.status(200).json({
                code: "register",
                res: "Successfully registered the profile.",
                data: user
            })
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json(err);
    }
})

/* User Registration */
// router.post("/signup", upload.single("photo"), async (req, res) => {
//     try {
//         const user = await User.findOne({
//             email: req.body.email
//         });
//         if (user) {
//             res.status(404).json("User Already Exist");
//             return;
//         }
//         /* Salting and Hashing the Password */
//         const salt = await bcrypt.genSalt(10);
//         const hashedPass = await bcrypt.hash(req.body.password, salt)

//         if (req.file) {
//             /* Create a new user */
//             const newuser = await new User({
//                 username: req.body.username,
//                 email: req.body.email,
//                 password: hashedPass,
//                 photo: req.file.filename
//             });

//             /* Save User and Return */
//             const user = await newuser.save()
//             res.status(200).json(user)
//         }
//         else {
//             /* Create a new user */
//             const newuser = await new User({
//                 username: req.body.username,
//                 email: req.body.email,
//                 password: hashedPass
//             });

//             /* Save User and Return */
//             const user = await newuser.save()
//             res.status(200).json(user)
//         }
//     }
//     catch (err) {
//         console.log(err)
//     }
// })

// /* User Login */
// router.post("/signin", async (req, res) => {
//     try {
//         const user = await User.findOne({
//             email: req.body.email
//         });
//         !user && res.status(404).json("User not found");

//         const validPass = await bcrypt.compare(req.body.password, user.password)
//         !validPass && res.status(400).json("Wrong Password")

//         res.status(200).json(user)

//     } catch (err) {
//         console.log(err)
//     }
// })

export default router