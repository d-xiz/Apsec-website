const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const Member = require("../Database/member");

const memberSignup = async (req,res,role) => {

    const { name, email, password } = req.body;
  
    // Field validation
    if (!name || !email || !password ) {
      return res.status(400).json({ message: "All fields are required." });
    }
    
    try {
        let nameNotTaken = await validateMemberName(name);
        if (!nameNotTaken) return res.status(400).json({ message: "Member is already registered." });

        let emailNotRegistered = await validateEmail(email);
        if (!emailNotRegistered) return res.status(400).json({ message: "Email is already registered." });

        const hashedPassword = await bcrypt.hash(password, 12);
        const newMember = new Member({
            name,
            email,
            password: hashedPassword,
            role,
        });

        await newMember.save();
        return res.status(201).json({ message: "Hurray! You are now successfully registered. Please login." });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const validateMemberName = async name => {
    let member = await Member.findOne({ name });
    return member ? false : true;
};

const validateEmail = async email => {
    let member = await Member.findOne({ email });
    return member ? false : true;
};

const memberLogin = async (req, res,role) => {
    const { name, password } = req.body;
  
    if (!name || !password ) {
      return res.status(400).json({ message: "All fields are required." });
    }
  
    const member = await Member.findOne({ 
        $or: [{ name }, { email: name }] 
      });
    if (!member) {
        return res.status(400).json({ message: "Member not found." });
    }
    if (member.role !== role) {
        return res.status(403).json({ message: "You are not authorized to login." });
    }
    let isMatch = await bcrypt.compare(password, member.password);
    if (isMatch) {
        let token = jwt.sign(
            { role: member.role, name: member.name, email: member.email },
            process.env.APP_SECRET,
            { expiresIn: "3d" }
        );
        let result = {
            token: token,
            name: member.name,
            email: member.email,
            role: member.role,
            expiresIn: 72// expiresIn in hours (3 days)
        };
        return res.status(200).json({ ...result, message: "Login successful." });
    } else {
        return res.status(400).json({ message: "Invalid credentials." });
    }
};

module.exports = { memberSignup, memberLogin };
