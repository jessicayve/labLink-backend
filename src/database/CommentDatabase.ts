import {
  CommentWithCreatorDB,
  CommentDB,
  LikeDislikeCommentDB,
  COMMENT_LIKE
} from "../types.js"
import { BaseDatabase } from "./BaseDatabase.js"

export class CommentDatabase extends BaseDatabase {
  public static TABLE_COMMENTS = "comments"
  public static TABLE_LIKES_DISLIKES_COMMENTS = "likes_dislikes_comments"

  public findById = async (id: string): Promise<CommentDB | undefined> => {
    const [result]: CommentDB[] = await BaseDatabase
      .connection(CommentDatabase.TABLE_COMMENTS)
      .select("*")
      .where({ id })

    return result
  }

  public getCommentWithCreators = async (): Promise<CommentWithCreatorDB[]> => {
    const result: CommentWithCreatorDB[] = await BaseDatabase
      .connection(CommentDatabase.TABLE_COMMENTS)
      .select(
        "comments.id",
        "comments.content",
        "comments.post_id",
        "comments.creator_id",
        "comments.likes",
        "comments.dislikes",
        "comments.created_at",
        "comments.updated_at",
        "users.name as creator_name"
      )
      .join("users", "comments.creator_id", "=", "users.id")

    return result
  }

  public findCommentWithCreatorById = async (
    commentId: string
  ): Promise<CommentWithCreatorDB | undefined> => {
    const [result]: CommentWithCreatorDB[] = await BaseDatabase
      .connection(CommentDatabase.TABLE_COMMENTS)
      .select(
        "comments.id",
        "comments.content",
        "comments.post_id",
        "comments.creator_id",
        "comments.likes",
        "comments.dislikes",
        "comments.created_at",
        "comments.updated_at",
        "users.name as creator_name"
      )
      .join("users", "comments.creator_id", "=", "users.id")
      .where("comments.id", commentId)

    return result
  }

  public insertComment = async (commentDB: CommentDB): Promise<void> => {
    await BaseDatabase
      .connection(CommentDatabase.TABLE_COMMENTS)
      .insert(commentDB)
  }

  public updateComment = async (
    commentDB: CommentDB,
    id: string
  ): Promise<void> => {
    await BaseDatabase
      .connection(CommentDatabase.TABLE_COMMENTS)
      .update(commentDB)
      .where({ id })
  }

  public findLikeDislike = async (
    likeDislikeDB: LikeDislikeCommentDB
  ): Promise<COMMENT_LIKE | null> => {
    const [result]: LikeDislikeCommentDB[] = await BaseDatabase
      .connection(CommentDatabase.TABLE_LIKES_DISLIKES_COMMENTS)
      .select("*")
      .where({
        user_id: likeDislikeDB.user_id,
        comment_id: likeDislikeDB.comment_id
      })

    if (!result) return null

    return result.like === 1
      ? COMMENT_LIKE.ALREADY_LIKED
      : COMMENT_LIKE.ALREADY_DISLIKED
  }

  public likeDislikeComment = async (
    likeDislikeDB: LikeDislikeCommentDB
  ): Promise<void> => {
    await BaseDatabase
      .connection(CommentDatabase.TABLE_LIKES_DISLIKES_COMMENTS)
      .insert(likeDislikeDB)
  }

  public updateLikeDislike = async (
    likeDislikeDB: LikeDislikeCommentDB
  ): Promise<void> => {
    await BaseDatabase
      .connection(CommentDatabase.TABLE_LIKES_DISLIKES_COMMENTS)
      .update({
        like: likeDislikeDB.like
      })
      .where({
        user_id: likeDislikeDB.user_id,
        comment_id: likeDislikeDB.comment_id
      })
  }

  public removeLikeDislike = async (
    likeDislikeDB: LikeDislikeCommentDB
  ): Promise<void> => {
    await BaseDatabase
      .connection(CommentDatabase.TABLE_LIKES_DISLIKES_COMMENTS)
      .delete()
      .where({
        user_id: likeDislikeDB.user_id,
        comment_id: likeDislikeDB.comment_id
      })
  }
}