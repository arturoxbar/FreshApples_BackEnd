import type { Request, Response, NextFunction } from "express";
import passport from "../config/passport";
import User from "../models/User";
import { generateToken, decryptToken } from "../utils/jwt";

interface AuthRequest extends Request {
  user?: any;
}

interface PassportInfo {
  message: string;
}

const singIn = async (req: Request, res: Response, next: NextFunction) => {
  await passport.authenticate(
    "signup",
    (err: Error | null, user: any | false, info: PassportInfo) => {
      if (err) {
        return res.status(500).json({ message: "errors", error: err.message });
      }
      if (!user) {
        return res.status(400).json(info);
      }
      return res.json({ message: "User created", user });
    }
  )(req, res, next);
};

const login = async (req: AuthRequest, res: Response, next: NextFunction) => {
  await passport.authenticate(
    "login",
    (err: Error | null, user: any | false, info: PassportInfo) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Internal server error", error: err.message });
      }
      if (!user) {
        return res.status(401).json(info);
      }
      try {
        req.login(user, { session: false }, async (error: Error) => {
          if (error) {
            return next(error);
          }
          const body = { _id: user._id };
          const token = generateToken(body);
          return res.json({ user: user, token });
        });
      } catch (error) {
        return next(error);
      }
    }
  )(req, res, next);
};

const deleteUser = async (req: AuthRequest, res: Response) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const user = await User.findById(req.user._id).exec();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await User.findByIdAndDelete(req.user._id).exec();
    return res.json({ message: "User deleted", user });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const EditUser = async (req: AuthRequest, res: Response) => {
  const { email, username, password } = req.body;
  try {
    const currentUser = await User.findById(req.user._id).exec();
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }
    if (currentUser._id.toString() !== req.user._id) {
      return res.status(401).json({
        message: "You can't edit this user",
        CurrentUser: currentUser._id,
        payload: req.user._id,
      });
    }
    if (currentUser.email !== email) {
      try {
        const existingEmail = await User.findOne({ email: email }).exec();
        if (existingEmail) {
          return res.status(400).json({ message: "Email already exists" });
        }
      } catch (error) {
        return res.status(500).json({
          message: "Internal server error",
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }
    if (email) currentUser.email = email;
    if (username) currentUser.username = username;
    if (password) currentUser.password = password;
    await currentUser.save();
    return res.json({ message: "User edited", currentUser });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const getUserInfo = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user._id).exec();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json({ message: "User found", user });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};



export { singIn, login, EditUser, deleteUser, getUserInfo };
