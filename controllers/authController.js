import { comparePassword, hashPassword } from '../helpers/authHelper.js';
import userModel from '../models/userModel.js'
import JWT from 'jsonwebtoken';

//Registering
export const registerController = async (req, res) => {
    try {
        const { name, email, password, phone, address, answer } = req.body;
        if (!name) {
            return res.send({ message: 'Name is Required' });
        }
        if (!email) {
            return res.send({ message: 'Email is Required' });
        }
        if (!password) {
            return res.send({ message: 'Password is Required' });
        }
        if (!phone) {
            return res.send({ message: 'Phone Number is Required' });
        }
        if (!address) {
            return res.send({ message: 'Address is Required' });
        }
        if (!answer) {
            return res.send({ message: 'Answer is Required' });
        }

        //Check for existing user
        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            return res.status(200).send({
                success: false,
                message: "Already Registered please Login"
            })
        }

        //Register User
        const hashedPassword = await hashPassword(password);
        const user = await new userModel({ name, email, phone, address, password: hashedPassword,answer }).save();

        res.status(201).send({
            success: true,
            message: "User Registered Sucessfully",
            user
        });
    }
    catch {
        console.error();
        res.status(500).send({
            success: false,
            message: "Error in Registration"
        })
    }
};


//Login
export const loginController = async (req, res) => {
    try {
        const {email,password} = req.body;
        //validation
        if(!email || !password){
            return res.status(404).send({
                success:false,
                message: "Invalid Email or Password",
            })
        }

        //Checking if user is there or not
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(404).send({
                success:false,
                message: "Please Register first",
            })
        }

        const match = await comparePassword(password,user.password);

        //if user present but password not matching
        if(!match){
            return res.status(200).send({
                success:false,
                message: "Incorrect Credentials",
            })
        }

        //if user also and password also matching then create the token
        const token = await JWT.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'});
        res.status(200).send({
            success:true,
            message: "Login Successfully",
            user:{
                _id: user._id,
                name:user.name,
                email:user.email,
                phone: user.phone,
                address:user.address,
                role:user.role,
            },
            token,
        });
    }
    catch {
        console.error();
        res.status(500).send({
            success: false,
            message: "Error in Login",
            error
        })
    }
}

//Testing
export const testController = async(req,res)=>{
    res.status(200).send({
        success:true,
        message:"Protected Route"
    })
}

//Forgot Password
export const forgotPasswordController = async (req, res) => {
    try {
        const { email, answer, newPassword } = req.body;

        // Check if required fields are provided
        if (!email) {
            return res.send({ message: 'Email is Required' });
        }
        if (!answer) {
            return res.send({ message: 'Answer is Required' });
        }
        if (!newPassword) {
            return res.send({ message: 'New Password is Required' });
        }

        // Find the user based on email and answer
        const user = await userModel.findOne({ email, answer });

        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Wrong email or answer"
            });
        }

        // Hash the new password
        const hashed = await hashPassword(newPassword);

        // Update user's password in the database
        await userModel.findByIdAndUpdate(user._id, { password: hashed });

        res.status(200).send({
            success: true,
            message: "Password Reset Successfully"
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Something went wrong",
            error
        });
    }
};