import ResponseCodeMessage from "../enum/ResponseCodeMessage";

export class UnauthorizedError extends Error {
    public readonly code = ResponseCodeMessage.UNAUTHORIZED_REQUEST_CODE;

    constructor(message?: string) {
        super(ResponseCodeMessage.UNAUTHORIZED_REQUEST_MSG + message);
    }
}

export class NotFoundError extends Error {
    public readonly code = ResponseCodeMessage.NOT_FOUND_CODE;

    constructor(message?: string) {
        super(ResponseCodeMessage.NOT_FOUND_MSG + message);
    }
}

export class RequestConflictError extends Error {
    public readonly code = ResponseCodeMessage.REQUEST_CONFLICT_CODE;

    constructor(message?: string) {
        super(ResponseCodeMessage.REQUEST_CONFLICT_MSG + message);
    }
}
