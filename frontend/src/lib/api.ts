import { User } from './interfaces'

export const API = 'http://localhost:8000';

export async function getUser(id: string): Promise<User> {
    try {
        const response = await fetch(`${API}/get_user`, {
            method: "GET"
        });

        const data = await response.json();

        let userData: User = {
            id: data.id,
            name: data.name,
            langsFluent: data.langsFluent,
            langsLearning: data.langsLearning,
            friendList: data.friendList
        };

        return Promise.resolve(data);
    } catch (error) {
        return Promise.reject(error)
    }
}

export async function authenticate(name: string, pass: string): Promise<void> {
    try {
        const credBody = {username: name, password: pass};

        const response = await fetch(`${API}/authenticate`, {
            credentials: 'include',
            method: 'POST',
            body: JSON.stringify(credBody)
        })

        return Promise.resolve();
    } catch (error) {
        return Promise.reject(error);
    }
}