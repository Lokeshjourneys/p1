import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {User} from '../Models/user.model.js';
import {uploadonCloudinary} from '../utils/cloudinary.js';
import {ApiResponse} from '../utils/ApiResponse.js';


const registerUser = asyncHandler( async (req,res) => {
    // get user data from fontend
    // validate user data
    // check if user already exists
    //check for images, avatar and cover image
    // upload images to cloudinary
    // create user in database
    // remove password from response
    // check if user is created successfully
    // send response to frontend
    const {username, email, password, fullName} = req.body;
    console.log("Registering user:", {username, email, fullName});
    if (
        [username, email, password, fullName].some(field => 
            field?.trim==="")
    ) {
        throw new ApiError(400, "All fields are required");
    }
    const existedUser= await User.findOne({
        $or: [
           { username },{ email }
        ]
    })
    if (existedUser) {
        throw new ApiError(409, "User already exists");
    }
    console.log(req.files);
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    if(!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required");
    }
    const avatar = await uploadonCloudinary(avatarLocalPath);
    const coverImage = await uploadonCloudinary(coverImageLocalPath);
    if(!avatar) {
         throw new ApiError(400, "Avatar is required");
    }
    const user = await User.create({
        fullName,
        avatar: avatar?.url,
        coverImage: coverImage?.url || "",
        username : username.toLowerCase(),
        email,
        password
    })

    const createdUser =await User.findById(user._id).select(
        "-password -refreshToken"
    ); // Exclude password and refreshToken from the response

    if(!createdUser) {
        throw new ApiError(500, "Something went wrong while creating user");
    }

    return res.status(201).json(ApiResponse.created(createdUser));
});



export {registerUser}; // Exporting the registerUser function for use in other parts of the application