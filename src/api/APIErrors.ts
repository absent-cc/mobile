/* eslint-disable max-classes-per-file */

export class APIError extends Error {
    caller: string;

    description?: string;

    constructor(message: string, caller: string, description?: string) {
        super(message);
        this.name = this.constructor.name;
        this.caller = caller;
        this.description = description;
    }
}

export class BadTokenError extends APIError {
    constructor(caller: string) {
        super(
            'Sorry, your token has expired.',
            caller,
            'Unexpected failure to verify token.',
        );
    }
}

export class AuthenticationError extends APIError {
    constructor(caller: string, description: string) {
        super(
            'Sorry, your token has expired. Please log in again.',
            caller,
            description,
        );
    }
}

export class ServerError extends APIError {
    constructor(caller: string) {
        super(
            'Sorry, there was an error with the server. Please try again.',
            caller,
        );
    }
}

export class NetworkError extends APIError {
    constructor(caller: string, wasTimeout = false) {
        super(
            `Sorry, there was a network error. ${
                wasTimeout
                    ? 'Your request took too long to complete.'
                    : "Please make sure you're connected to the internet."
            }`,
            caller,
        );
    }
}

export class ValidationError extends APIError {
    constructor(caller: string, details: string) {
        super(
            'Sorry, there was an error with the data sent to the server. Please try again.',
            caller,
            details,
        );
    }
}

export class UnknownError extends APIError {
    constructor(caller: string, description?: string) {
        super(
            'Sorry, there was an unknown error. Please try again.',
            caller,
            description,
        );
    }
}
