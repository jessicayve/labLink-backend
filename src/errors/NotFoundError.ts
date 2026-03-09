import { BaseError } from "./BaseError.js";

export class NotFoundError extends BaseError {
    constructor(
        message: string = "Recurso não encontrado"
    ) {
        super(404, message)
    }
}