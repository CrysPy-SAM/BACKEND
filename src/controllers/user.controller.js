import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponce.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const User = await User.findById(userId);
    const accessToken = await User.createAccessToken();
    const refreshToken = await User.createRefreshToken();

    user.refreshToken = refreshToken;
    await user.save((validateBeforeSave = false));
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

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

  const { fullName, email, username, password } = req.body;
  //console.log("email: ", email);

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }
  //console.log(req.files);

  const avatarLocalPath = req.files?.avatar[0]?.path;
  //const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  //req.body -> data
  //username, email, password
  //find the user in db
  //check password
  //access and refreesh token
  // Send cookie

  const { email, password, username } = req.body;
  if (!(email || username) || !password) {
    throw new ApiError(400, "Email or Username and Password are required");
  }

  const user = await User.findOne({
    $or: [{ email }, { username }],
  });
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }
  const isPasswordvalid = await user.isPasswordMatched(password);
  if (!isPasswordvalid) {
    throw new ApiError(401, "Invalid Password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id,
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully",
      )
    )
});

const logoutUser = asyncHandler(async (req, res) => {
    User.findByIdAndUpdate(req.user._id, 
    { 
      $set: { refreshToken: undefined }
      
     },
    { 
      new: true
    }
 )
        const options = {
            httpOnly: true,   
            secure: true,
        }
    return res
        .status(200)
        .cookie("accessToken", null, options)
        .cookie("refreshToken", null, options)
        .json(new ApiResponse(200, null, "User logged out successfully"))
})

export { registerUser
  , loginUser,
   logoutUser
 };
