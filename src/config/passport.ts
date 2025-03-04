import { Request, Response } from "express";
import passport from "passport";
import localStrategy from "passport-local";
import JWTStrategy, { ExtractJwt } from "passport-jwt";
import User from "../models/User";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

const verifyPassword = async (password: string, email: string) => {
  const usuario = await User.findOne({
    email: email,
  }).exec();
  console.log(usuario);
  if (!usuario) {
    return false;
  }
  const result = await bcrypt.compare(password, usuario.password);
  console.log(result);
  return result;
};

passport.use(
  "signup",
  new localStrategy.Strategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      const { username, secret } = req.body;
      try {
        const existingEmail = await User.findOne({ email: email }).exec();
        if (existingEmail) {
          return done(null, false, {
            message: "The email is already register",
          });
        }
        const existingUsername = await User.findOne({
          username: username,
        }).exec();
        if (existingUsername) {
          return done(null, false, {
            message: "The username is already register",
          });
        }
        const newUser = new User({ email, password, username, secret });
        await newUser.save();
        return done(null, newUser);
      } catch (error) {
        console.log(error);
        return done(error);
      }
    }
  )
);

passport.use(
  "login",
  new localStrategy.Strategy(
    { usernameField: "userInfo", passwordField: "password" },
    async (userInfo, password, done) => {
      try {
        const ExistingUser = await User.findOne({
          $or: [
            { email: userInfo },
            { username: userInfo }
          ]
        }).exec();
        if (!ExistingUser) {
          return done(null, false, { message: "The user cannot be found" });
        }
        const validate = await verifyPassword(password, ExistingUser.email);
        if (!validate) {
          return done(null, false, { message: "the password doesn't match" });
        }
        return done(null, ExistingUser, { message: "Logged in successfully" });
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  new JWTStrategy.Strategy(
    {
      secretOrKey: process.env.SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);

export default passport;
