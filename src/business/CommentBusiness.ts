import { CommentDatabase } from "../database/CommentDatabase.js"
import { PostDatabase } from "../database/PostDatabase.js"
import {
  GetCommentOutputDTO,
  GetCommentsInputDTO,
  CreateCommentInputDTO,
  LikeDislikeCommentInputDTO,
  UpdateCommentInputDTO
} from "../dtos/commentDTO.js"
import { BadRequestError } from "../errors/BadRequestError.js"
import { NotFoundError } from "../errors/NotFoundError.js"
import { Comment } from "../models/Comment.js"
import { IdGenerator } from "../services/IdGenerator.js"
import { TokenManager } from "../services/TokenManager.js"
import {
  CommentWithCreatorDB,
  LikeDislikeCommentDB,
  COMMENT_LIKE
} from "../types.js"

export class CommentBusiness {
  constructor(
    private commentDatabase: CommentDatabase,
    private postDatabase: PostDatabase,
    private idGenerator: IdGenerator,
    private tokenManager: TokenManager
  ) {}

  public getComment = async (
    input: GetCommentsInputDTO
  ): Promise<GetCommentOutputDTO> => {
    const { token } = input

    if (token === undefined) {
      throw new BadRequestError("token é necessário")
    }

    const payload = this.tokenManager.getPayload(token)

    if (payload === null) {
      throw new BadRequestError("'token' inválido")
    }

    const commentsWithCreatorsDB: CommentWithCreatorDB[] =
      await this.commentDatabase.getCommentWithCreators()

    const comments = commentsWithCreatorsDB.map((commentWithCreatorDB) => {
      const comment = new Comment(
        commentWithCreatorDB.id,
        commentWithCreatorDB.post_id,
        commentWithCreatorDB.creator_id,
        commentWithCreatorDB.content,
        commentWithCreatorDB.likes,
        commentWithCreatorDB.dislikes,
        commentWithCreatorDB.created_at,
        commentWithCreatorDB.updated_at
      )

      return {
        ...comment.toBusinessModel(),
        creator: {
          id: commentWithCreatorDB.creator_id,
          name: commentWithCreatorDB.creator_name
        }
      }
    })

    return comments
  }

  public createComment = async (input: CreateCommentInputDTO): Promise<void> => {
    const { postId, content, token } = input

    if (token === undefined) {
      throw new BadRequestError("token ausente")
    }

    const payload = this.tokenManager.getPayload(token)

    if (payload === null) {
      throw new BadRequestError("'token' inválido")
    }

    const postDBExists = await this.postDatabase.findById(postId)

    if (postDBExists === null) {
      throw new NotFoundError("'id' não encontrado")
    }

    if (typeof content !== "string" || content.trim().length === 0) {
      throw new BadRequestError("'content' deve ser uma string não vazia")
    }

    const newId = this.idGenerator.generate()
    const now = new Date().toISOString()

    const newComment = new Comment(
      newId,
      postId,
      payload.id,
      content.trim(),
      0,
      0,
      now,
      now
    )

    const newCommentDB = newComment.toDBModel()

    await this.commentDatabase.insertComment(newCommentDB)
  }

  public likeOrDislikeComment = async (
    input: LikeDislikeCommentInputDTO
  ): Promise<void> => {
    const { idToLikeOrDislike, token, like } = input

    if (token === undefined) {
      throw new BadRequestError("token é necessário")
    }

    const payload = this.tokenManager.getPayload(token)

    if (payload === null) {
      throw new BadRequestError("token inválido")
    }

    if (typeof like !== "boolean") {
      throw new BadRequestError("'like' deve ser boolean")
    }

    const commentWithCreatorDB =
      await this.commentDatabase.findCommentWithCreatorById(idToLikeOrDislike)

    if (!commentWithCreatorDB) {
      throw new NotFoundError("'id' não encontrado")
    }

    const userId = payload.id
    const likeSQLite = like ? 1 : 0

    const likeDislikeDB: LikeDislikeCommentDB = {
      comment_id: commentWithCreatorDB.id,
      post_id: commentWithCreatorDB.post_id,
      user_id: userId,
      like: likeSQLite
    }

    const comment = new Comment(
      commentWithCreatorDB.id,
      commentWithCreatorDB.post_id,
      commentWithCreatorDB.creator_id,
      commentWithCreatorDB.content,
      commentWithCreatorDB.likes,
      commentWithCreatorDB.dislikes,
      commentWithCreatorDB.created_at,
      commentWithCreatorDB.updated_at
    )

    const likeDislikeExists = await this.commentDatabase.findLikeDislike(
      likeDislikeDB
    )

    if (likeDislikeExists === COMMENT_LIKE.ALREADY_LIKED) {
      if (like) {
        await this.commentDatabase.removeLikeDislike(likeDislikeDB)
        comment.removeLike()
      } else {
        await this.commentDatabase.updateLikeDislike(likeDislikeDB)
        comment.removeLike()
        comment.addDislike()
      }
    } else if (likeDislikeExists === COMMENT_LIKE.ALREADY_DISLIKED) {
      if (like) {
        await this.commentDatabase.updateLikeDislike(likeDislikeDB)
        comment.removeDislike()
        comment.addLike()
      } else {
        await this.commentDatabase.removeLikeDislike(likeDislikeDB)
        comment.removeDislike()
      }
    } else {
      await this.commentDatabase.likeDislikeComment(likeDislikeDB)
      like ? comment.addLike() : comment.addDislike()
    }

    const updatedCommentDB = comment.toDBModel()

    await this.commentDatabase.updateComment(updatedCommentDB, idToLikeOrDislike)
  }

  public updateComment = async (input: UpdateCommentInputDTO): Promise<void> => {
    const { idToEdit, content, token } = input

    if (token === undefined) {
      throw new BadRequestError("token ausente")
    }

    const payload = this.tokenManager.getPayload(token)

    if (payload === null) {
      throw new BadRequestError("'token' inválido")
    }

    if (typeof content !== "string" || content.trim().length === 0) {
      throw new BadRequestError("'content' deve ser uma string não vazia")
    }

    const commentDB = await this.commentDatabase.findById(idToEdit)

    if (!commentDB) {
      throw new NotFoundError("comentário não encontrado")
    }

    if (commentDB.creator_id !== payload.id) {
      throw new BadRequestError("somente o criador do comentário pode editá-lo")
    }

    const updatedAt = new Date().toISOString()

    const comment = new Comment(
      commentDB.id,
      commentDB.post_id,
      commentDB.creator_id,
      content.trim(),
      commentDB.likes,
      commentDB.dislikes,
      commentDB.created_at,
      updatedAt
    )

    const updatedCommentDB = comment.toDBModel()

    await this.commentDatabase.updateComment(updatedCommentDB, idToEdit)
  }
}