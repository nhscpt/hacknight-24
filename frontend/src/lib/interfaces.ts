export interface User {
    id: string;
    username: string;
    langsFluent: number[];
    langsLearning: number[];
    friendList: string[]
}

export interface accountProps {
    username: string;
    password: string;
    flangs: number[];
    llangs: number[];
}

export interface queueResponse {
    caller_id: string;
    user_id: string;
};