import { CommentModel } from "../types.js"

export interface GetCommentsInputDTO {
  token: string | undefined
}

export type GetCommentOutputDTO = CommentModel[]

export interface CreateCommentInputDTO {
  postId: string
  content: unknown
  token: string | undefined
}

export interface LikeDislikeCommentInputDTO {
  idToLikeOrDislike: string
  like: unknown
  token: string | undefined
}

export interface UpdateCommentInputDTO {
  idToEdit: string
  content: unknown
  token: string | undefined
}