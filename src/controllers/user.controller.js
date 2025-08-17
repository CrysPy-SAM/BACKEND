import { asyncHandler } from "../utils/asyncHandler.js";
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
    
});

export { registerUser };
