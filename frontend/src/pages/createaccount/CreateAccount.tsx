import './CreateAccount.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { accountProps } from '../../lib/interfaces';
import { authenticate, createAccount } from '../../lib/api';
import TextField from '../../components/TextField'
import Button from '../../components/Button';
import SelectLanguage from '../selectlanguage/SelectLanguage';

export default function CreateAccount() {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [langsFluent, setLangsFluent] = useState<number[]>([])
    const [langsLearning, setLangsLearning] = useState<number[]>([])

    async function handleSubmit() {
        // authenticate(username, password);
        
        try {
            const userData: accountProps = {
                username: username,
                password: password,
                flangs: langsFluent,
                llangs: langsLearning
            }

            console.log(langsLearning)

            let created: boolean = false;

            let accountCreated = await createAccount(userData).then(function() {
                created = true;
            })

            if (!created) {
                throw new Error('account not created')
            }

            try {
                let loggedIn = await authenticate(username, password);
    
                if (loggedIn) {
                    console.log('logged in')
    
                    navigate('/');
                }
            } catch (error) {
                console.log(error);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='main'>
            
                <div className='panel'>
                <h1 className='title'>Create Account</h1>

                    <TextField label='Username' value={username} secret={false} onChange={setUsername}/>
                    <TextField label='Password' value={password} secret={true} onChange={setPassword}/>

                    <SelectLanguage 
                        setLangsFluent={(langsFluent) => {setLangsFluent(langsFluent)}} 
                        setLangsLearning={(langsLearning) => {setLangsLearning(langsLearning)}} />
                    <Button label='Create Account' onClick={handleSubmit}/>
                </div>
        </div>
    )
}