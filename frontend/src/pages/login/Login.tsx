// import './Login.css'
// import { useState } from 'react'
// import { useNavigate } from 'react-router-dom';
// import { authenticate } from '../../lib/api';
// import TextField from '../../components/TextField'
// import Button from '../../components/Button';

// export default function Login() {
//     const navigate = useNavigate();

//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');

//     async function handleSubmit() {
//         // authenticate(username, password);

//         try {
//             let loggedIn = await authenticate(username, password);

//             if (loggedIn) {
//                 console.log('logged in')

//                 navigate('/');
//             }

//         } catch (error) {
//             console.log(error);
//         }
//     }

//     function handleCreateAccount() {
//         navigate('/createaccount');
//     }

//     return (
//         <div className='main'>
//             <div className='panel'>
//                 <h1 className='title'> Log in </h1>

//                 <TextField label='Username' value={username} secret={false} onChange={setUsername}/>
//                 <TextField label='Password' value={password} secret={true} onChange={setPassword}/>

//                 <Button label='Log in' onClick={handleSubmit}/>

//                 <p className='createAccountButton' onClick={handleCreateAccount}> Create Account </p>
//             </div>
//         </div>
//     )
// }
import './Login.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authenticate } from '../../lib/api';
import TextField from '../../components/TextField';
import Button from '../../components/Button';

export default function Login() {
    const navigate = useNavigate();

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    async function handleSubmit() {
        try {
            let loggedIn = await authenticate(username, password);

            if (loggedIn) {
                console.log('logged in');

                navigate('/');
            }

        } catch (error) {
            console.log(error);
        }
    }

    function handleCreateAccount() {
        navigate('/createaccount');
    }

    return (
        <div className='main'>
            <video autoPlay loop muted>
                <source src="https://svs.gsfc.nasa.gov/vis/a030000/a030800/a030878/BlackMarble_2016_rotate_720p.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div className='panel'>
                <h1 className='title'> Log in </h1>

                <TextField label='Username' value={username} secret={false} onChange={setUsername}/>
                <TextField label='Password' value={password} secret={true} onChange={setPassword}/>

                <Button label='Log in' onClick={handleSubmit}/>

                <p className='createAccountButton' onClick={handleCreateAccount}> Create Account </p>
            </div>
        </div>
    );
}
