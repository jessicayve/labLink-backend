import { Request, Response } from "express"
import { CommentBusiness } from "../business/CommentBusiness.js"
import {
  GetCommentsInputDTO,
  CreateCommentInputDTO,
  LikeDislikeCommentInputDTO,
  UpdateCommentInputDTO
} from "../dtos/commentDTO.js"
import { BaseError } from "../errors/BaseError.js"

export class CommentController {
  constructor(private commentBusiness: CommentBusiness) {}

  public getComment = async (req: Request, res: Response) => {
    try {
      const input: GetCommentsInputDTO = {
        token: req.headers.authorization
      }

      const output = await this.commentBusiness.getComment(input)

      res.status(200).send(output)
    } catch (error) {
      console.log(error)

      if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message)
      } else {
        res.status(500).send("Erro inesperado")
      }
    }
  }

  public CreateComment = async (req: Request, res: Response) => {
    try {
      const input: CreateCommentInputDTO = {
        postId: String(req.params.id),
        content: req.body.content,
        token: req.headers.authorization
      }

      await this.commentBusiness.createComment(input)

      res.status(201).send({ message: "Comentário criado com sucesso" })
    } catch (error) {
      console.log(error)

      if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message)
      } else {
        res.status(500).send("Erro inesperado")
      }
    }
  }

  public likeDislike = async (req: Request, res: Response) => {
    try {
      const input: LikeDislikeCommentInputDTO = {
        idToLikeOrDislike: String(req.params.id),
        like: req.body.like,
        token: req.headers.authorization
      }

      await this.commentBusiness.likeOrDislikeComment(input)

      res.status(200).send({ message: "Interação realizada com sucesso" })
    } catch (error) {
      console.log(error)

      if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message)
      } else {
        res.status(500).send("Erro inesperado")
      }
    }
  }

  public updateComment = async (req: Request, res: Response) => {
    try {
      const input: UpdateCommentInputDTO = {
        idToEdit: String(req.params.id),
        content: req.body.content,
        token: req.headers.authorization
      }

      await this.commentBusiness.updateComment(input)

      res.status(200).send({ message: "Comentário editado com sucesso" })
    } catch (error) {
      console.log(error)

      if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message)
      } else {
        res.status(500).send("Erro inesperado")
      }
    }
  }
}