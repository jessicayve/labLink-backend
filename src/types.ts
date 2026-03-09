export enum USER_ROLES {
    NORMAL = "NORMAL",
    ADMIN = "ADMIN"
}

export interface TokenPayload{
    id:string,
    name:string,
    role:USER_ROLES
}

export interface UserDB {
    id: string,
    name: string,
    email:string,
    password: string,
    role: USER_ROLES,
    created_at:string,
    updated_at:string
}

export interface UserModel {
    id: string,
    name: string,
    email:string,
    password: string,
    role: USER_ROLES,
    createdAt:string,
    updatedAt:string
}

export interface PostDB {
    id: string,
    creator_id:string,
    content:string,
    likes:number,
    dislikes:number,
    comments:number,
    created_at:string,
    updated_at:string
}

export interface PostWithCreatorDB extends PostDB{
    creator_name: string
}

export interface PostModel{
    id: string,
    content: string,
    likes: number,
    dislikes: number,
    comments: number,
    createdAt: string,
    updatedAt: string,
    creator:{
        creatorId: string,
        creatorName: string
    }
}

export interface LikeDislikeDB{
    user_id: string,
    post_id: string,
    like: number
}

export enum POST_LIKE{
    ALREADY_LIKED = "ALREADY LIKED",
    ALREADY_DISLIKED = "ALREADY DISLIKED"
}

export interface CommentDB {
    id: string,
    post_id: string,
    creator_id: string,
    content: string,
    likes: number,
    dislikes: number,
    created_at: string
}


export interface CommentWithCreatorDB extends CommentDB {
    creator_name: string
}

export interface CommentModel {
    id: string,
    postId: string,
    creatorId: string,
    content: string,
    likes: number,
    dislikes: number,
    createdAt: string
}

export interface LikeDislikeCommentDB {
    post_id: string,
    comment_id: string,
    user_id: string,
    like: number
}
export enum COMMENT_LIKE{
    ALREADY_LIKED = "ALREADY LIKED",
    ALREADY_DISLIKED = "ALREADY DISLIKED"

}