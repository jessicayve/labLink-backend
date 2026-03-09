import express from "express"

import { UserBusiness } from "../business/UserBusiness.js"
import { UserController } from "../controller/UserController.js"
import { UserDatabase } from "../database/UserDatabase.js"
import { HashManager } from "../services/HashManager.js"
import { IdGenerator } from "../services/IdGenerator.js"
import { TokenManager } from "../services/TokenManager.js"

export const userRouter = express.Router()

const userController = new UserController(
    new UserBusiness(
        new UserDatabase(),
        new IdGenerator(),
        new TokenManager(),
        new HashManager()
    )
)

userRouter.post("/signup", userController.signup)
userRouter.post("/login", userController.login)