exports.UnauthorizationError = class UnauthorizationError extends Error {
    constructor( message ) {
        super(message);
        this.status = 401;
    }
}