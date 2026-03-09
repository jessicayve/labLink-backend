import express from "express"
import { PostBusiness } from "../business/PostBusiness.js"
import { PostController } from "../controller/PostController.js"
import { PostDatabase } from "../database/PostDatabase.js"
import { IdGenerator } from "../services/IdGenerator.js"
import { TokenManager } from "../services/TokenManager.js"

export const postRouter = express.Router()

const postController = new PostController(
    new PostBusiness(
        new PostDatabase(),
        new IdGenerator(),
        new TokenManager()
    )
)

postRouter.get("/", postController.getPost)
postRouter.post("/", postController.createPost)
postRouter.put("/:id", postController.editPost)
postRouter.delete("/:id", postController.deletePost)
postRouter.put("/:id/like", postController.likeOrDislikePost)
postRouter.get("/comments", postController.getPostComment)