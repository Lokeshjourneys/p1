import {Router} from 'express';
import {registerUser,loginUser,logOutUser,refreshAccessToken} from '../Controllers/user.controller.js';
import {upload} from '../Middlewares/multer.middleware.js';
import {verifyJWT} from '../Middlewares/auth.middleware.js';
const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser);

router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT, logOutUser);

router.route("/refresh-token").post(refreshAccessToken)
     

export default router;
