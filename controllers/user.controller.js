const User= require('../models/user.model');
const bcrypt= require('bcrypt');
const jwt= require('jsonwebtoken');
require('dotenv').config();

const signup= async(req, res)=>{
    try {
        const {name, email, password, age}= req.body;

        if(!name || !email || !password || !age){
            return res.status(400).json({message: 'All fields are required'});
        }

        const userExist= await User.findOne({email});
        if(userExist){
            return res.status(409).json({message: 'User already exist'});
        }

        const hashedPassword= await bcrypt.hash(password, 10);

        const newUser= new User({
            name,
            email,
            password: hashedPassword,
            age
        });

        await newUser.save();
        res.status(201).json({message: 'User created succesfully', user:{name, email, age}});
        
    } catch (error) {
        res.status(500).json({message: 'Internal server error'});
    }
}

const login= async(req, res)=>{
    try {
        const {email, password}= req.body;

       const userExist= await User.findOne({email});
       if(!userExist){
             return res.status(401).json({message: 'Invalid credentials'});
       }

       const isMatch= await bcrypt.compare(password, userExist.password);
       if(!isMatch){
            return res.status(401).json({message: 'Invalid credentials'});
       }

       const token= jwt.sign({id: userExist._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
       res.status(200).json({message: 'User logged in successfully', token});
        
    } catch (error) {
        res.status(500).json({message: 'Internal server error'});
    }
}

const getAllUsers= async(req, res)=>{
    try {
        const users= await User.find({}, '-password');
        res.status(200).json({message: 'User fetched succssfully', users});
        
    } catch (error) {
        res.status(500).json({message: 'Internal server error'});
    }
}

const updateUser= async(req, res)=>{
    try {
        const {name, email, password, age}= req.body;
        const {id}= req.params;

        const updates= {};

        if(name) updates.name= name;
        if(email) updates.email= email;
        if(age) updates.age= age;

        if(password){
            const hashedPassword= await bcrypt.hash(password, 10);
            updates.password= hashedPassword;
        }

        const updateUser= await User.findByIdAndUpdate(id, updates, {new:true}).select('-password');
        if(!updateUser){
            return res.status(404).json({message: 'User not found'});
        }

        res.status(200).json({message: 'User Updated successfully',user: updateUser});
        
    } catch (error) {
        res.status(500).json({message: 'Internal server error'});
    }
}

const deleteuser= async(req, res)=>{
    try {
        const {id}= req.params;

        const deleteUser= await User.findByIdAndDelete(id);
        if(!deleteUser){
            return res.status(404).json({message: 'User not found'});
        }

        res.status(200).json({message: 'User Deleted Successfully'});
        
    } catch (error) {
        res.status(500).json({message: 'Internal server error'});  
    }
}

module.exports= {signup, login, getAllUsers, updateUser, deleteuser};