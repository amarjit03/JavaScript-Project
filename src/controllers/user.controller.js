import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User, uset}   from "../models/user.model.js"
import {uploadCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { response } from "express";


const registerUser = asyncHandler(async (req, res) => {
    // get user detail from frontend
    // data validation
    // not empty
    // chef if user already exist
    // check for images and avatar
    // upload them to cloudinary,avatar
    // create user object
    // creaete DB call
    // remove password and refresh token field from response
    // check for user creation
    // return response


    const {fullname,username,password,email} = req.body
    console.log("email",email);

    // if (fullname === "") {
    //     throw new ApiError(400,"fullname is required")       
    // }
    if (
        [fullname,email,username,password].some((field) => 
        field?.trim() === "")

    ) {
        throw new ApiError(400,"fullname is required")
    }
    const existedUser = User.findOne({
        $or: [{username},{email}]
    })
    
    if (existedUser) {
        throw new ApiError(409, "User with email or username exist")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400,"Avatar image id required")
    }

    const avatar = await uploadCloudinary(avatarLocalPath)
    const coverImage = await uploadCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400,"Avatar image id required")
    }

    await User.create({
        fullname,
        avatar:avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()
    })

    const createdUser = await User.findById(username._id).select(
        "-password -refreshToken" 
    )

    if (!createdUser){
        throw new ApiError(500,"Something went wrong while regestring user")
        
    }

    return response(201).json(
        new ApiResponse(200, createdUser, "User register Sucessfully")
    )


});

export { registerUser };
