import {asyncHandler} from '../utils/asyncHandler.js';


const registerUser = asyncHandler( async (requestAnimationFrame,res) => {
    res.status(200).json({
        message: "User registered successfully"  
    });
});





export {registerUser}; // Exporting the registerUser function for use in other parts of the application