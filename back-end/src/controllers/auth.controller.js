import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";


export const signup = async (req, res) => {
    const { fullName, email, phoneNumber, address, birthDate, password } = req.body;

//Check if all fields are filled

    try {

        if (!fullName || !email || !phoneNumber || !address || !birthDate || !password) {
            return res.status(400).json({ message: "All fields are required" });
          }

          if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
          }

//Check if user already exists

      const user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }
      
//Encrypt password

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, 10);

//Create new user

      const newUser = new User({
        fullName,
        email,
        phoneNumber,
        address,
        birthDate,
        password: hashedPassword,
      });

      if (newUser) {
        // generate jwt token here
        generateToken(newUser._id, res);
        await newUser.save();
  
        res.status(201).json({
          _id: newUser._id,
          fullName: newUser.fullName,
          email: newUser.email,
          phoneNumber: newUser.phoneNumber,
          address: newUser.address,
          birthDate: newUser.birthDate,
        });
      } else {
        res.status(400).json({ message: "Invalid user data" });
      } 
    }
    catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
      }
  }

  export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
  
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
  
      generateToken(user._id, res);
  
      res.status(200).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address,
        birthDate: user.birthDate,
      });
    } catch (error) {
      console.log("Error in login controller", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  export const logout = (req, res) => {
    try {
      res.cookie("jwt", "", { maxAge: 0 });
      res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      console.log("Error in logout controller", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
export const checkAuth = (req, res) => {
    try {
      res.status(200).json(req.user);
    } catch (error) {
      console.log("Error in checkAuth controller", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };