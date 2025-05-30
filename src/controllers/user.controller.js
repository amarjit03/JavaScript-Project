import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import uploadCloudinary from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { response } from "express";
import mongoose from "mongoose";

const generateAccessAndRefreshTokens = async(userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found for token generation");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Token generation error:", error); // <--- log the actual error
    throw new ApiError(500, "Something went wrong while generating refresh and access token");
  }
}


const registerUser = asyncHandler(async (req, res) => {

    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res

  const { fullname, username, password, email } = req.body;

  // Validate required fields
  if ([fullname, email, username, password].some((field) => !field || field.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if user with email or username exists
  const existedUser = await User.findOne({
    $or: [{ username: username.toLowerCase() }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

//   console.log(req.files);

  // Check for avatar file presence
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar image is required");
  }

  // Cover image is optional, so safely check path
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  // Upload images to Cloudinary
  const avatar = await uploadCloudinary(avatarLocalPath);
  const coverImage = coverImageLocalPath ? await uploadCloudinary(coverImageLocalPath) : null;

  if (!avatar) {
    throw new ApiError(400, "Failed to upload avatar image");
  }

  // Create user in DB
  const newUser = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  // Find the created user without sensitive fields
  const createdUser = await User.findById(newUser._id).select("-password -refreshToken");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user");
  }

  // Send success response with 201 Created status
  return res.status(201).json(
    new ApiResponse(201, createdUser, "User registered successfully")
  );
});

const loginUser = asyncHandler(async(req,res) => {
  // request body > data
  // username or email
  // find the user
  // match the password
  // generate and return authentication key
  // send in secure cookies
  // send a response login sucessfully

  const {email,username,password} = req.body

  if (!username && !email){
    throw new ApiError(400,"username or password is required")
  }

  const user = await User.findOne({
    $or : [{username},{email}]
  })

  if (!user){
    throw new ApiError(404,"user not found")
  }

  const isPasswordValid = await user.isPasswordCorrect(password)

  if (!isPasswordValid){
    throw new ApiError(401,"Password Incorrect")
  }

  const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(user._id)

  const loggedInUser = await User.findById(user._id).
  select("-password -refreshToken")

  const options = {
    httpOnly : true,
    secure : true,
  }

  return res
  .status(200)
  .cookie("accessToken",accessToken,options)
  .cookie("refreshToken",refreshToken,options)
  .json(
    new ApiResponse(200,
      {
        user:loggedInUser, accessToken, refreshToken
      },
      "user Logged In Sucessfully"
    )
  )
})

const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})


  const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
            
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})


const changeCurrentPassword  = asyncHandler(async(req, res) => {
  const {oldPassword,newPassword} = req.body

  const user = await User.findById(req.user.id)
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

  if(!isPasswordCorrect){
    throw new ApiError(400,"password Incorrect")
  }

  user.password = newPassword

  await user.save({validateBeforeSave:false})

  return res
  .status(200)
  .json(new ApiResponse(200,{},"Password Changed Sucessfully"))
})

const getCurrentUser = asyncHandler(async(req,res) => {
  return res
  .status(200)
  .json(
    new ApiResponse(
      200,
      req.user,
      "Current user fetch Sucessfully"
    )
  )
})


const updateAccountDetails = asyncHandler(async(req,res) => {
  const {full,name} = req.body
  
  if(!fullname || !email){
    throw new ApiError(400,"All field are required")
  }

  const user  = User.findByIdAndUpdate(req.user?._id,
    {
      $set:{
        fullname:fullname,
        email:email,
      }

    },
    {user:true}
  ).select("-password")

  return res.
  status(200)
  .json(new ApiResponse(200,user,"Account details updated sucessfully"))

})

const updateUserAvatar = asyncHandler(async(req,res) => {
  const avataLocalPath = req.file?.path
  if(!avataLocalPath){
    throw new ApiError(400,"unable to find avatar")
  }

  const avatar = await uploadCloudinary(avataLocalPath)

  if (!avatar.url){
    throw new ApiError(400,"Error while  uploading avatar")
  }

  // TODO : delete old-image

  

  await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set:{
        avatar:avatar.url
      }
    },
    {new:true}
  ).select("-password")
})

const updateUserCoverImage = asyncHandler(async(req,res) => {
  const coverImageLocalPath = req.file?.path
  if(!coverImageLocalPath){
    throw new ApiError(400,"unable to find coverImage")
  }

  const coverImage = await uploadCloudinary(coverImageLocalPath)

  if (!coverImage.url){
    throw new ApiError(400,"Error while  uploading coverImage")
  }
  await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set:{
        coverImage:coverImage.url
      }
    },
    {new:true}
  ).select("-password")
})


const getUserChannelProfile = asyncHandler(async(req,res) => {
  const {username} = req.params

  if (!username?.trim()) {
    throw new ApiError(400,"unable to get username")
  }

  const channel = await User.aggregate([
  {
    $match: {
      username: username?.toLowerCase()
    }
  },
  {
    $lookup: {
      from: "subscriptions",
      localField: "_id",
      foreignField: "channel",
      as: "subscribers"
    }
  },
  {
    $lookup: {
      from: "subscriptions",
      localField: "_id",
      foreignField: "subscriber",
      as: "subscribedTo"
    }
  },
  {
    $addFields: {
      subscriberCount: { $size: "$subscribers" },
      channelSubscribedToCount: { $size: "$subscribedTo" },
      isSubscribed: {
        $cond: {
          if: {
            $in: [req.user?._id, {
              $map: {
                input: "$subscribers",
                as: "s",
                in: "$$s.subscriber"
              }
            }]
          },
          then: true,
          else: false
        }
      }
    }
  },
  {
    $project: {
      fullname: 1,
      username: 1,
      subscriberCount: 1,
      channelSubscribedToCount: 1,
      isSubscribed: 1,
      avatar: 1,
      coverImage: 1,
      email: 1
    }
  }
]);

  if (!channel?.length){
    throw new ApiError(400,"unable to get channel data")
  }
  return res
  .status(200)
  .json(new ApiResponse(200,channel[0], "User channel fetched sucessfully"))

})

const getWatchHistory = asyncHandler(async(req,res) => {
  const user = await User.aggregate([
    {
      $match:{
        _id: new mongoose.Types.ObjectId(req.user._id)
      }
    },
    {
      $lookup:{
        from:"videos",
        localField:"watchHistory",
        foreignField:"_id",
        as:"watchHistory",
        pipeline:[
          {
            $lookup:{
              from:"users",
              localField:"owner",
              foreignField:"_id",
              as:"owner",
              pipeline:[
                {
                  $project:{
                    fullname: 1,
                    username: 1,
                    avatar: 1
                  }
                }
              ]
            }
          },
          {
            $addFields:{
              owner:{
                $first:"$owner",
              }
            }
          }
        ]


      }
    }
  ])
  return res
  .status(200)
  .json(
    new ApiResponse(
      200, user[0].watchHistory,
      "watch History fetched Sucessfully"
    )
  )
})

export { registerUser,
         loginUser,
         logoutUser,
         refreshAccessToken,
         changeCurrentPassword,
         getCurrentUser,
         updateAccountDetails,
         updateUserAvatar,
         updateUserCoverImage,
         getUserChannelProfile,
         getWatchHistory,
};
