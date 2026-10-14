const path = require('path');
const User = require('../models/user');
const fs = require('fs/promises');

const createUser = async (req, res) => {
  try {
    const imagePath = req.file 
      ? "uploads/" + req.body.email + path.extname(req.file.originalname) 
      : null;
      
    console.log('Received file:', imagePath);

    const user = new User({
      username: req.body.username,
      email: req.body.email,
      phone: req.body.phone,
      userProfile: imagePath 
    });

    const savedUser = await user.save();
    res.json(savedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const findOneUser = async (req,res) => {
  try {
    const email = req.params.email;
    const user_data = await User.findOne({email : email});
    res.json(user_data);
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }

}
const showUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;
    const users = await User.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const updateUser = async (req, res) => {
  try {
    const { username, phone } = req.body;
    const email = req.params.email;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updateData = { username, phone };

    if (req.file) {
      updateData.userProfile = req.file.path;
    }

    const updatedUser = await User.findOneAndUpdate(
      { email: email },
      { $set: updateData },
      { new: true }
    );
    
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const deleteUser = async (req, res) => {
  try {
    const email = req.params.email;
    const user = await User.findOne({email:email})
    const deletedUser = await User.findOneAndDelete({ email: email });
    if(user.userProfile){
      const imagePath = path.join(__dirname,'..',user.userProfile);
      try{
        await fs.unlink(imagePath);
        console.log('Successfully deleted image file:', imagePath);
      }
      catch(err){
        console.error('Error deleting file :', fileErr.message);
      }
    }

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const searchUsers = async (req, res) => {
  try {
    const searchTerm = req.query.q;
    const page = parseInt(req.query.page) || 1;
    const limit = 5; // Keep this consistent with your showUsers limit
    const skip = (page - 1) * limit;

    const users = await User.find({
      $or: [
        { username: { $regex: searchTerm, $options: 'i' } },
        { email: { $regex: searchTerm, $options: 'i' } }
      ]
    }).sort({ createdAt: -1 }).skip(skip).limit(limit);

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { showUsers, findOneUser, createUser , updateUser, deleteUser, searchUsers};