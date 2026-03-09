import { CommentDB, CommentModel } from "../types.js"

export class Comment {
  constructor(
    private id: string,
    private postId: string,
    private creatorId: string,
    private content: string,
    private likes: number,
    private dislikes: number,
    private createdAt: string,
    private updatedAt: string
  ) {}

  public getId(): string {
    return this.id
  }

  public getPostId(): string {
    return this.postId
  }

  public getCreatorId(): string {
    return this.creatorId
  }

  public getContent(): string {
    return this.content
  }

  public getLikes(): number {
    return this.likes
  }

  public getDislikes(): number {
    return this.dislikes
  }

  public getCreatedAt(): string {
    return this.createdAt
  }

  public getUpdatedAt(): string {
    return this.updatedAt
  }

  public setContent(newContent: string): void {
    this.content = newContent
  }

  public setUpdatedAt(newUpdatedAt: string): void {
    this.updatedAt = newUpdatedAt
  }

  public addLike(): void {
    this.likes++
  }

  public removeLike(): void {
    this.likes--
  }

  public addDislike(): void {
    this.dislikes++
  }

  public removeDislike(): void {
    this.dislikes--
  }

  public toDBModel(): CommentDB {
    return {
      id: this.id,
      post_id: this.postId,
      creator_id: this.creatorId,
      content: this.content,
      likes: this.likes,
      dislikes: this.dislikes,
      created_at: this.createdAt,
      updated_at: this.updatedAt
    }
  }

  public toBusinessModel(): CommentModel {
    return {
      id: this.id,
      postId: this.postId,
      creatorId: this.creatorId,
      content: this.content,
      likes: this.likes,
      dislikes: this.dislikes,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }
  }
}