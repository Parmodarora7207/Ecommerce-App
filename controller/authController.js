import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import usermodel from "../models/usermodel.js";
import JWT from "jsonwebtoken";
import router from "../routes/authRoute.js";
import orderModel from "../models/orderModel.js";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;
    // validationapi
    if (!name) {
      res.send({ message: "Name is Required" });
    }
    if (!email) {
      res.send({ message: "Email is Required" });
    }
    if (!password) {
      res.send({ message: "Password is Required" });
    }
    if (!phone) {
      res.send({ message: "Phone No is Required" });
    }
    if (!address) {
      res.send({ message: "Address is Required" });
    }
    if (!answer) {
      res.send({ message: "Answer  is Required" });
    }
    // check user
    const existingUser = await usermodel.findOne({ email });
    // existing user
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "User Already Registered Please Login To Continue",
      });
    }
    // register user
    const hashedPassword = await hashPassword(password);
    // save password
    const user = await new usermodel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      answer,
    }).save();
    res.status(201).send({
      success: true,
      message: "User Registered Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Registeration",
      error,
    });
  }
};

// POST LOGIN
export const LoginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    // validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid Email or Password",
      });
    }
    // check user
    const user = await usermodel.findOne({ email });
    if (!user) {
      res.status(404).send({
        success: false,
        message: "Email is not registered",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }
    // token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "Login Sucecssfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Login",
      error,
    });
  }
};

// forgotPasswordController

export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      res.status(400).send({
        message: "Email Is Required",
      });
    }
    if (!answer) {
      res.status(400).send({
        message: "Answer Is Required",
      });
    }
    if (!newPassword) {
      res.status(400).send({
        message: "New Password Is Required",
      });
    }
    // check email or answer
    const user = await usermodel.findOne({ email, answer });
    // validation
    if (!user) {
      res.status(500).send({
        success: false,
        message: "Wrong Email or Answer",
      });
    }
    const hashed = await hashPassword(newPassword);
    await usermodel.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "Password reset Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something Went Wrong",
      error,
    });
  }
};
// test controller
export const testController = (req, res) => {
  try {
    res.send("protected Routes");
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
};

// update Profile

export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    const user = await usermodel.findById(req.user._id);
    // password
    if (password && password.length < 6) {
      return res.json({ error: "Password is Required And 6 Character long" });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await usermodel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile Updated Successfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error While Updating Profile",
      error,
    });
  }
};

// orders

export const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Getting Orders",
      error,
    });
  }
};

// All Orders
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: "-1" });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Getting Orders",
      error,
    });
  }
};

// orderStatusController

export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Updating Order",
      error,
    });
  }
};
