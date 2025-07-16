import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {User} from '../Models/user.model.js';
import {uploadonCloudinary} from '../utils/cloudinary.js';
import {ApiResponse} from '../utils/ApiResponse.js';

const generateAccessAndRefreshTokens = async (userId) =>{
    try {
        const user = await User.findById(userId);
        const accessToken =user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return {
            accessToken,
            refreshToken
        };
    } catch (error) {
        throw new ApiError(500, "Error generating tokens");
    }
}

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
    // const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
    
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage)&& req.files.coverImage.length>0) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }
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

const loginUser = asyncHandler(async (req,res) => {
    // get user data from frontend
    // validate user data
    // check if user exists
    // check password
    // generate access token
    // send response to frontend
    const {email,username,password}= req.body;
    if (!email && !username) {
        throw new ApiError(400, "Email or email is required");
    }

    if (!password) {
        throw new ApiError(400, "Password is required");
    }

    const user= await User.findOne({
        $or: [{username}, {email}]
    })
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isPassordValid= await user.isPasswordCorrect(password)
    if (!isPassordValid) {
        throw new ApiError(401, "Invalid password");
    }

    const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(user._id);

    const userResponse = await User.findById(user._id).select(
        "-password -refreshToken"
    ); // Exclude password and refreshToken from the response

    const options = {
        httpOnly: true,
        secure: true
    }
    console.log("User logged in successfully:", userResponse);
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(ApiResponse.success(userResponse, "User logged in successfully", 
        {
            user: loginUser,accessToken,refreshToken
        }
    ));


})

const logOutUser = asyncHandler(async (req, res) => {
   await User.findByIdAndUpdate(
    req.user._id,
    {
        $set: {
            refreshToken: undefined
        }
    }
   )

   const options = {
    httpOnly: true,
    secure: true
   }

   return res
    .status(200)
    .cookie("accessToken", "", options)
    .cookie("refreshToken", "", options)
    .json(ApiResponse.success(null, "User logged out successfully"));
})


const refreshAccessToken = asyncHandler(async (req,res)=>{
    const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken
    if (!incomingRefreshToken) {
        throw new ApiError(401, "Refresh token is required");
    }

try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    
        const user = await User.findById(decodedToken?._id);
        if (!user) {
            throw new ApiError(401, "Invalid refresh token");
        }
        if (user?.refreshToken !== incomingRefreshToken) {
            throw new ApiError(401, "Invalid refresh token");
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken,newRefreshToken}=await generateAccessAndRefreshTokens(user._id)
    
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(ApiResponse.success(200, "Access token refreshed successfully", {
                accessToken,
                refreshToken: newRefreshToken
            },
            "Access token refreshed successfully"
        ));
}   catch (error) {
        console.error("Error refreshing access token:", error);
        throw new ApiError(500, "Error refreshing access token");
    }
})


const changePassword = asyncHandler(async (req, res) => {
   const {oldPassword, newPassword,confPassword} = req.body;

   if (!(newPassword === confPassword)) {
       throw new ApiError(400, "New password and confirm password do not match");
   }

   const user = await User.findById(req.user._id);
   const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    if (!isPasswordCorrect) {
         throw new ApiError(401, "Old password is incorrect");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res
    .status(200)
    .json(ApiResponse.success(null, "Password changed successfully"));

})


const getCurrentUser = asyncHandler(async (req, res) => {
    return res
    .status(200)
    .json(ApiResponse.success(req.user, "Current user fetched successfully"));
})

const updateAccount = asyncHandler(async (req,res) => {
    const {fullName, username, email} = req.body;

    if ([fullName, username, email].some(field => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                fullName: fullName,
                username: username.toLowerCase(),
                email: email
            }
        },
        {
            new: true,
            runValidators: true
        }.select("-password -refreshToken")
    );

    return res
    .status(200)
    .json(ApiResponse.success(200,user, "User account updated successfully"));
})


const updateAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required");
    }

    const avatar = await uploadonCloudinary(avatarLocalPath);
    if (!avatar.url) {
        throw new ApiError(400, "Error uploading avatar");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        {new: true}
    ).select("-password");

    await user.save({ validateBeforeSave: false });
    
    return res
    .status(200)
    .json(ApiResponse.success(user, "Avatar updated successfully"));
})


const updateCoverImage = asyncHandler(async (req, res) => {
    const coverImageLocalPath = req.file?.path;
    if (!coverImageLocalPath) {
        throw new ApiError(400, "Cover image is required");
    }
    const coverImage = await uploadonCloudinary(coverImageLocalPath);
    if (!coverImage.url) {
        throw new ApiError(400, "Error uploading cover image");
    }
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverImage: coverImage.url
            }
        },
        {new: true}
    ).select("-password");

    await user.save({ validateBeforeSave: false });
    return res
    .status(200)
    .json(ApiResponse.success(200,user, "Cover image updated successfully"));
})


const getUserChannelProfile = asyncHandler(async (req, res) => {
    const {username}=req.params
    if (!username?.trim()) {
        throw new ApiError(400, "Username is required");
    }

    const channel = await User.aggregate([
        {
            $match: {
                username: username.toLowerCase()
            }
        },
        {
            $lookup: {
                from:"Subscription",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "Subscription",
                LocalField: "_id",
                foreignField: "subscriber",
                as: "subscriptions"
            }
        },
        {
            $addFields: {
                subscriberCount: { $size: "$subscribers" },
                subscriptionCount: { $size: "$subscriptions" }
                isSubscribed: {
                    $cond: {
                        if: {
                            $in :[req.user?._id, "$subscriptions.subscriber"]
                        },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                fullName: 1,
                username: 1,
                avatar: 1,
                coverImage: 1,
                subscriberCount: 1,
                subscriptionCount: 1,
                isSubscribed: 1
            }
        }
    ])

    if(!channel?.length) {
        throw new ApiError(404, "Channel not found");
    }

    return res
    .status(200)
    .json(ApiResponse.success(channel[0], "Channel profile fetched successfully"));
})
    







export {
    registerUser,
    loginUser,
    logOutUser,
    refreshAccessToken,
    changePassword,
    getCurrentUser,
    updateAccount,
    updateAvatar,
    updateCoverImage,
    getUserChannelProfile
}; 