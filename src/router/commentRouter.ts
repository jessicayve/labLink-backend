import  express  from "express";
import { CommentBusiness } from "../business/CommentBusiness.js";
import { CommentController } from "../controller/CommentController.js";
import { CommentDatabase } from "../database/CommentDatabase.js";
import { PostDatabase } from "../database/PostDatabase.js";
import { IdGenerator } from "../services/IdGenerator.js";
import { TokenManager } from "../services/TokenManager.js";


export const commentRouter = express.Router()

const commentController = new CommentController(
    new CommentBusiness(
        new CommentDatabase(),
        new PostDatabase(),
        new IdGenerator(),
        new TokenManager(),
        
    )
)

commentRouter.get("/", commentController.getComment)
commentRouter.post("/:id", commentController.CreateComment)
commentRouter.put("/:id/like", commentController.likeDislike)
commentRouter.put("/:id", commentController.updateComment)