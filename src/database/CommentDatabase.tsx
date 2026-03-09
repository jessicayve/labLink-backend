import { CommentWithCreatorDB,CommentDB, LikeDislikeCommentDB,COMMENT_LIKE } from "../types";
import { BaseDatabase } from "./BaseDatabase";

export class CommentDatabase extends BaseDatabase {

    public static TABLE_COMMENTS = "comments"
    public static TABLE_LIKES_DISLIKES = "likes_dislikes"
    public static TABLE_LIKES_DISLIKES_COMMENTS = "likes_dislikes_comments"

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
                "users.name AS creator_name"
            )
            .join("users", "comments.creator_id", "=", "users.id")

        return result
    }
    public async insertComment(newCommentDB: CommentDB): Promise<void> {
        await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENTS)
            .insert(newCommentDB)
    }

   
    public findCommentWithCreatorById = async (
        commentId: string
     ): Promise<CommentWithCreatorDB | undefined> => {
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
                "users.name AS creator_name"
             )
             .join("users", "comments.creator_id", "=", "users.id")
             .where("comments.id", commentId)
 
         return result[0]
     }
   

    public updateComment = async (newCommentDB: CommentDB, id: string): Promise<void> => {
        await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENTS)
            .update(newCommentDB)
            .where({ id })
    }

    public deleteComment = async(id: string): Promise<void> => {
        await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENTS)
            .delete()
            .where({ id })
    }
    public findLikeDislike = async (likeDislikeDBToFind: LikeDislikeCommentDB): Promise<COMMENT_LIKE | null> => {
        const [likeDislikeDB]: LikeDislikeCommentDB[] = await BaseDatabase
            .connection(CommentDatabase.TABLE_LIKES_DISLIKES_COMMENTS)
            .select()
            .where({
                post_id: likeDislikeDBToFind.post_id,
                user_id: likeDislikeDBToFind.user_id,
                comment_id: likeDislikeDBToFind.comment_id
            })

        if (likeDislikeDB) {
            return likeDislikeDB.like === 1
                ? COMMENT_LIKE.ALREADY_LIKED
                : COMMENT_LIKE.ALREADY_DISLIKED

        } else {
            return null
        }
    }

    public removeLikeDislike = async (likeDislikeDB: LikeDislikeCommentDB): Promise<void> => {
        await BaseDatabase
            .connection(CommentDatabase.TABLE_LIKES_DISLIKES_COMMENTS)
            .delete()
            .where({
                post_id: likeDislikeDB.post_id,
                user_id: likeDislikeDB.user_id,
                comment_id: likeDislikeDB.comment_id
            })
    }

    public updateLikeDislike = async (likeDislikeDB: LikeDislikeCommentDB) => {
        await BaseDatabase
            .connection(CommentDatabase.TABLE_LIKES_DISLIKES_COMMENTS)
            .update(likeDislikeDB)
            .where({
                post_id: likeDislikeDB.post_id,
                user_id: likeDislikeDB.user_id,
                comment_id: likeDislikeDB.comment_id
            })
    }
    public likeDislikeComment = async (likeDislike: LikeDislikeCommentDB): Promise<void> => {
        await BaseDatabase
            .connection(CommentDatabase.TABLE_LIKES_DISLIKES_COMMENTS)
            .insert(likeDislike)
    }
}