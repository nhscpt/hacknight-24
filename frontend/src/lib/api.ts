import { User, accountProps, queueResponse } from './interfaces'

export const API = 'http://localhost:8000';

export async function getUser(id: string): Promise<User> {
    try {
        const response = await fetch(`${API}/get_user`, {
            method: "POST",
            headers: new Headers({'content-type': 'application/json'}),
            credentials: 'include',
            body: JSON.stringify({user_uuid: id})
        });

        const data = await response.json();

        let userData: User = {
            id: data.uuid,
            username: data.username,
            langsFluent: data.flangs,
            langsLearning: data.llangs,
            friendList: data.friends
        };

        return Promise.resolve(userData);
    } catch (error) {
        return Promise.reject(error)
    }
}

export async function authenticate(name: string, pass: string): Promise<boolean> {
    try {
        const credBody = {user: name, password: pass};


        const response = await fetch(`${API}/authenticate`, {
            credentials: 'include',
            headers: new Headers({'content-type': 'application/json'}),
            method: 'POST',
            body: JSON.stringify(credBody)
        })
        console.log('hello')


        const responseJson: {authenticated: boolean} = await response.json();

        

        return Promise.resolve(responseJson.authenticated);
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function enterQueue(callerid: string): Promise<queueResponse> {
    try {
        const response = await fetch(`${API}/enter_queue`, {
            credentials: 'include',
            method: 'POST',
            headers: new Headers({'content-type': 'application/json'}),
            body: JSON.stringify({caller_id: callerid}) 
        });

        const data = await response.json() as object as queueResponse;


        let userData: queueResponse = {
            caller_id: data.caller_id,
            user_id: data.user_id
        };

        return Promise.resolve(userData);
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function createAccount(props: accountProps): Promise<void> {
    try {
        const response = await fetch(`${API}/create_user`, {
            credentials: 'include',
            method: 'POST',
            headers: new Headers({'content-type': 'application/json'}),
            body: JSON.stringify(props)
        });

        if (response.status === 200) {
            return Promise.resolve();
        } else {
            throw new Error('not created')
        }
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function addFriend(uuid: string): Promise<void> {
    try {
        const response = await fetch(`${API}/add_friend`, {
            credentials: 'include',
            method: 'POST',
            headers: new Headers({'content-type': 'application/json'}),
            body: JSON.stringify({user_uuid: uuid})
        });

        return Promise.resolve();
    } catch (error) {
        return Promise.reject(error);
    }
}