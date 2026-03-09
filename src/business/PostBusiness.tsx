import { CommentDatabase } from "../database/CommentDatabase";
import { PostDatabase } from "../database/PostDatabase";
import { UserDatabase } from "../database/UserDatabase";
import { CreatePostInputDTO, DeletePostInputDTO, EditPostInputDTO, GetPostInputDTO, GetPostOutputDTO, LikesDislikesInputDTO } from "../dtos/postDTO";
import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundError } from "../errors/NotFoundError";
import { Post } from "../models/Post";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { LikeDislikeDB, PostWithCreatorDB, POST_LIKE, USER_ROLES } from "../types";

export class PostBusiness {
    constructor(
        private postDatabase: PostDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager
    ) {}
    public getPost = async (input: GetPostInputDTO): Promise<GetPostOutputDTO> => {
        const { token } = input

        if (token === undefined) {
            throw new BadRequestError("'token' ausente")
        }
        const payload = this.tokenManager.getPayload(token)
        if (payload === null) {
            throw new BadRequestError("'token' inválido")
        }

        const postWithCreatorsDB: PostWithCreatorDB[] = await this.postDatabase.getPostWithCreators()

        const posts = postWithCreatorsDB.map((postWithCreatorDB) => {
            const post = new Post(
                postWithCreatorDB.id,
                postWithCreatorDB.content,
                postWithCreatorDB.likes,
                postWithCreatorDB.dislikes,
                postWithCreatorDB.comments,
                postWithCreatorDB.created_at,
                postWithCreatorDB.updated_at,
                postWithCreatorDB.creator_id,
                postWithCreatorDB.creator_name
            )
            return post.toBusinessModel()
        })
        const output: GetPostOutputDTO = posts
        
        return output
    }

    public createPost = async (input:CreatePostInputDTO):Promise<void> =>{

        const {token, content} = input

        if (token === undefined) {
            throw new BadRequestError("'token' ausente")
        }
        const payload = this.tokenManager.getPayload(token)

        if (payload === null) {
            throw new BadRequestError("'token' inválido")
        }

        const id = this.idGenerator.generate()
        const createdAt = new Date().toISOString()
        const updatedAt = new Date().toISOString()
        const creatorId = payload.id
        const creatorName = payload.name
       

        const post = new Post(
            id,
            content,
            0,
            0,
            0,
            createdAt,
            updatedAt,
            creatorId,
            creatorName
        )

        const postDB = post.toDBModel()

        await this.postDatabase.insert(postDB)
    }

    public editPost = async (input: EditPostInputDTO): Promise<void> => {

        const { idToEdit, content, token } = input

        if (token === undefined) {
            throw new BadRequestError("'token' ausente")
        }

        if (typeof token !== "string") {
            throw new BadRequestError("'token' deve ser uma string")
        }

        if (token === null) {
            throw new BadRequestError("'token' ausente")
        }

        const postDB = await this.postDatabase.findById(idToEdit)

        if (!postDB) {
            throw new NotFoundError("'id' não encontrado")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null) {
            throw new BadRequestError("token não encontrado")
        }

        const creatorId = payload.id

        if (postDB.creator_id !== creatorId) {
            throw new BadRequestError("somente quem criou o post pode editar")
        }

        const creatorName = payload.name

        const post = new Post(
            postDB.id,
            postDB.content,
            postDB.likes,
            postDB.dislikes,
            postDB.comments,
            postDB.created_at,
            postDB.updated_at,
            creatorId,
            creatorName
        )

        post.setContent(content)
        post.setUpdatedAt(new Date().toISOString())

        const newPostDB = post.toDBModel()

        await this.postDatabase.update(idToEdit, newPostDB)
    }
    
    public deletePost = async (input: DeletePostInputDTO): Promise<void> => {

        const { idToDelete, token } = input

        if (token === undefined) {
            throw new BadRequestError("'token' ausente")
        }

        if (typeof token !== "string") {
            throw new BadRequestError("'token' deve ser uma string")
        }

        if (token === null) {
            throw new BadRequestError("'token' deve ser informado")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null) {
            throw new BadRequestError("token inválido")
        }

        const postDB = await this.postDatabase.findById(idToDelete)

        if (!postDB) {

            throw new NotFoundError("Id não encontrado")
        }

        const creatorId = payload.id

       if(payload.role !== USER_ROLES.ADMIN && postDB.creator_id !== creatorId){
            throw new BadRequestError("somente quem criou pode deletar")
        }
        await this.postDatabase.deleteById(idToDelete)
    }

    public likeOrDislikePost = async (input: LikesDislikesInputDTO): Promise<void> => {

        const { idToLikeOrDislike, token, like } = input

        if (token === undefined) {
            throw new BadRequestError("'token' ausente")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null) {
            throw new BadRequestError("token inválido")
        }

        if (typeof like !== "boolean") {
            throw new BadRequestError("'like' deve ser um booleano")
        }

        const postWithCreatorDB = await this.postDatabase.findPostWithCreatorsById(idToLikeOrDislike)


        if (!postWithCreatorDB) {
            throw new NotFoundError("'id' não encontrado")
        }

        const userId = payload.id
        const likeSQLite = like ? 1 : 0

        const likeDislikeDB: LikeDislikeDB = {
            user_id: userId,
            post_id: postWithCreatorDB.id,
            like: likeSQLite
        }

        const post = new Post(
            postWithCreatorDB.id,
            postWithCreatorDB.content,
            postWithCreatorDB.likes,
            postWithCreatorDB.dislikes,
            postWithCreatorDB.comments,
            postWithCreatorDB.created_at,
            postWithCreatorDB.updated_at,
            postWithCreatorDB.creator_id,
            postWithCreatorDB.creator_name
        )

        const likeOrDislikeExists = await this.postDatabase.findLikeDislike(likeDislikeDB)

        if (likeOrDislikeExists === POST_LIKE.ALREADY_LIKED) {
            if (like) {
                await this.postDatabase.removeLikeDislike(likeDislikeDB)
                post.removeLike()
            }else{
                await this.postDatabase.updateLikeDislike(likeDislikeDB)
                post.removeLike()
                post.addDislike()

            }

        } else if (likeOrDislikeExists === POST_LIKE.ALREADY_DISLIKED) {
            if (like) {
                await this.postDatabase.updateLikeDislike(likeDislikeDB)
                post.removeDislike()
                post.addLike()
            }else{
                await this.postDatabase.removeLikeDislike(likeDislikeDB)
                post.removeDislike()
               
            }



        } else {
            await this.postDatabase.likeOrDislikePost(likeDislikeDB)

            like ? post.addLike() : post.addDislike 
        }

        const updatedPostDB = post.toDBModel()

        await this.postDatabase.update(idToLikeOrDislike, updatedPostDB)

    }

    public getPostComment = async (input: GetPostInputDTO) =>{
        const {token} = input
        if(token === undefined){
            throw new BadRequestError("token ausente")
        }

        const payload = this.tokenManager.getPayload(token)

        if(payload === null){
            throw new BadRequestError("token inválido")
        }
        const posts = await this.postDatabase.getPostWithCreators()

        const userDatabase = new UserDatabase()

        const users = await userDatabase.getUsers()

        const commentsDatabase = new CommentDatabase()

        const comments = await commentsDatabase.getCommentWithCreators()

        const resultPost = posts.map((post)=>{
            const contador = comments.filter((comment)=>{
                return comment.post_id === post.id

            })

            return{
                id: post.id, 
                content:post.content,
                likes:post.likes,
                dislikes: post.dislikes,
                comments: contador.length,
                created_at: post.created_at,
                creator: resultUser(post.creator_id),
                comentario: contador
            }
        })
        function resultUser(user:string){
            const resultTable = users.find((result)=>{
                return user === result.id
            })
            return{
                id: resultTable?.id,
                name:resultTable?.name
            }
        }

        return ({Postagens: resultPost})
    }
}