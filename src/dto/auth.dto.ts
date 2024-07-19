export interface UserLoginInput {
    email: string;
    password: string;
};

export interface UserPayload {
    _id: string;
    email: string;
    verified: boolean;
}