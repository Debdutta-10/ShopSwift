import { comparePassword, hashPassword } from '../helpers/authHelper.js';
import userModel from '../models/userModel.js'
import JWT from 'jsonwebtoken';

//Registering
export const registerController = async (req, res) => {
    try {
        const { name, email, password, phone, address } = req.body;
        if (!name) {
            return res.send({ error: 'Name is Required' });
        }
        if (!email) {
            return res.send({ error: 'Email is Required' });
        }
        if (!password) {
            return res.send({ error: 'Password is Required' });
        }
        if (!phone) {
            return res.send({ error: 'Phone Number is Required' });
        }
        if (!address) {
            return res.send({ error: 'Address is Required' });
        }

        //Check for existing user
        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            return res.status(200).send({
                success: true,
                message: "Already Registered please Login"
            })
        }

        //Register User
        const hashedPassword = await hashPassword(password);
        const user = await new userModel({ name, email, phone, address, password: hashedPassword }).save();

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
                name:user.name,
                email:user.email,
                phone: user.phone,
                address:user.address,
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

export const testController = async(req,res)=>{
    res.status(200).send({
        success:true,
        message:"Protected Route"
    })
}