import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponce.js";


const registerUser = asyncHandler(async (req, res) => {
   //get user detail from frontend
   //validate user data - not empty
   //check if user already exists   
   //check for images, check for avatar
   //upload them to cloudinary, avtar
   //create user obj - create user in db
   // remove password and refresh token feild from response
   //check user for creation
   //return response 

   const {fullName, email, username, password}= req.body
    console.log("email", email);

   if(!fullName || !email || !username || !password) {
       throw new ApiError(400, "Please fill all the fields");   
    }    
    
    const existedUser = await User.find ({
         $or: [{username}, {email}] 
    })
    if(existedUser) {
        throw new ApiError(409, "User already exists with this username or email");
    }


    const avatarLocalPath = req.files.avatar[0]?.path;
    const coverImageLocalPath = req.files.coverImage[0]?.path;
   

    if(!avatarLocalPath) {
        throw new ApiError(400, "Please upload an avatar image");
    } 

    const avtar = await uploadOnCloudinary(avatarLocalPath, "avatars");
    const coverImage = await uploadOnCloudinary (coverImageLocalPath, "coverImages");
     
    if (!avtar || !coverImage) {
        throw new ApiError(500, "Error uploading images to cloudinary");
    } 

   const user = await User.create({
        fullName,   
        avatar: avtar.url,
        coverImage: coverImage?.url || "",
        email,
        username: username.toLowerCase(),
        password, // password will be hashed in the User model pre-save hook
    })

    const createdUser = await User.findById(user._id).select
    ("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong, user not created");
    }

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully")
    );
    
});

export { registerUser };
