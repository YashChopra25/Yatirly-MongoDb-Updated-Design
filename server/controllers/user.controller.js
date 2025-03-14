import validator from "validator";
import { generateToken } from "../utils/general.js";
import bcrypt from "bcrypt";
import userModel from "../models/user.models.js";
import URLmodel from "../models/urls.model.js";
import mongoose from "mongoose";
class UserControllerClass {
  async verifyUser(req, res) {
    try {
      const user = req.user;
      return res.json({
        success: true,
        message: "User is verified",
        data: {
          name: user.name,
          email: user.email,
          id: user.id,
        },
      });
    } catch (err) {
      return res.json({
        success: false,
        message: "Something went wrong",
        error: err,
      });
    }
  }
  async signUp(req, res) {
    try {
      const { name, email, password } = req.body;
      if (
        validator.isEmpty(name) ||
        validator.isEmpty(email) ||
        validator.isEmpty(password)
      ) {
        return res.status(400).json({
          message: "All fields are required",
        });
      }
      if (!validator.isEmail(email)) {
        return res.status(404).json({
          success: false,
          message: "Email is not valid",
        });
      }
      const prismaUser = await userModel.create({
        name,
        email,
        password,
      });
      if (!prismaUser) {
        return res.status(501).json({
          success: false,
          message: "User is not created",
          data: prismaUser,
        });
      }
      return res.status(201).json({
        success: true,
        message: "User is created",
        data: {
          name: prismaUser.name,
          email: prismaUser.email,
          id: prismaUser.id,
        },
      });
    } catch (error) {
      console.log("error in the this.signUp", error);
      if (error.code === "P2002" && error.meta?.target?.includes("email")) {
        return res.status(409).json({
          success: false,
          message: "Email already exists",
        });
      }
      return res.status(500).json({
        success: false,
        message: "Something went wrong",
        error,
      });
    }
  }
  async fetchUserUrl(req, res) {
    try {
      const prismaAnalytics = await URLmodel.aggregate([
        {
          $match: {
            ownerId: new mongoose.Types.ObjectId(req.user.id),
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "ownerId",
            foreignField: "_id",
            as: "owner",
          },
        },
        {
          $unwind: {
            path: "$owner",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            _count: {
              visits: { $size: "$visits" },
            },
          },
        },
        {
          $project: {
            ShortURL: true,
            longURL: true,
            _count: true,
            createdAt: true,
            isQR: true,
            owner: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
      ]);
      const result = prismaAnalytics || [];
      return res.status(200).json({
        success: true,
        message: "Url is fetched",
        data: result,
      });
    } catch (error) {
      console.log("error in the fetch user url", error);
      return res.status(500).json({
        success: false,
        message: "Something went wrong",
        error,
      });
    }
  }
  async updateUser(req, res) {
    try {
      const { first_name, last_name } = req.body;
      let updateFieds = {};
      if (first_name || last_name) {
        let name = first_name.trim() + " " + last_name.trim();
        updateFieds.name = name.trim().toLowerCase();
      }
      const prismaUser = await userModel.findOneAndUpdate(
        {
          _id: req.user._id,
        },
        {
          $set: updateFieds,
        },
        {
          new: true,
        }
      );
      if (!prismaUser) {
        return res.status(404).json({
          success: false,
          message: "User is not found",
        });
      }
      return res.status(200).json({
        success: true,
        message: "User is updated",
        data: {
          name: prismaUser.name,
          email: prismaUser.email,
          id: prismaUser.id,
        },
      });
    } catch (error) {
      console.log("error in the update user ", error);
      return res.status(500).json({
        success: false,
        message: "Something went wrong",
        error,
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (validator.isEmpty(email) || validator.isEmpty(password)) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }
      if (!validator.isEmail(email)) {
        return res.status(404).json({
          success: false,
          message: "Email is not valid",
        });
      }
      const prismaUser = await userModel.findOne({ email });

      if (!prismaUser) {
        return res.status(404).json({
          success: false,
          message: "Please enter correct credentials",
        });
      }
      const comparePassword = await bcrypt.compare(
        password,
        prismaUser.password
      );
      if (!comparePassword) {
        return res.status(401).json({
          success: false,
          message: "Please enter correct credentials",
        });
      }
      const token = generateToken(prismaUser);
      res.cookie("token", token, {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      });
      return res.status(200).json({
        success: true,
        message: "User is logged in",
        data: {
          name: prismaUser.name,
          email: prismaUser.email,
          id: prismaUser.id,
        },
      });
    } catch (error) {
      console.log("error in the fetch update  url", error);
      return res.json({
        success: false,
        message: "Something went wrong",
        error,
      });
    }
  }
  async logout(req, res) {
    try {
      res.clearCookie("token");
      return res.json({
        success: true,
        message: "User is logged out",
      });
    } catch (error) {
      console.log("error", error);
      return res.json({
        success: false,
        message: "Something went wrong,Unable to logout",
        error,
      });
    }
  }
}

const UserController = new UserControllerClass();
export default UserController;
