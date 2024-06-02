import './Login.css'
import { useState } from 'react'
import { authenticate } from '../../lib/api';
import TextField from '../../components/TextField'
import Button from '../../components/Button';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    function handleSubmit() {
        authenticate(username, password);
    }

    return (
        <div className='main'>
            <div className='panel'>
                <h1 className='title'> Login </h1>

                <TextField label='Username' value={username} secret={false} onChange={setUsername}/>
                <TextField label='Password' value={password} secret={true} onChange={setPassword}/>

                <Button label='Login' onClick={handleSubmit}/>
            </div>
        </div>
    )
}