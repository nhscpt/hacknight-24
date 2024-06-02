import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../../lib/interfaces';
import Button from '../../components/Button';
import './Dashboard.css';
import { enterQueue, getUser, addFriend } from '../../lib/api';
import VideoCall from '../videocall/VideoCall';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>({
    id: '',
    username: '',
    langsFluent: [],
    langsLearning: [],
    friendList: []
  });
  const [friends, setFriends] = useState<User[]>([]);
  const [peerCallerId, setPeerCallerId] = useState<string>('');
  const [peerUserId, setPeerUserId] = useState<string>('');
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const cookie = document.cookie.split(";")[0].split("=")[1];
    checkUser(cookie);
  }, []);
  
  async function checkUser(uuid: string) {  
    try {
      const userData = await getUser(uuid);
      if (userData) {
        setUser(userData);
      } else {
        throw new Error('User does not exist');
      }
    } catch (error) {
      console.log(error);
      navigate('/login');
    }
  }

  useEffect(() => {
    if (user && user.friendList) {
      user.friendList.  forEach(async (friend_id) => {
        try {
          
        } catch (error) {
          console.error(`Failed to fetch friend with id ${friend_id}:`, error);
        }
      });
    }
  }, [user.friendList]);

  async function getCaller(myCallerId: string) {
    try {
      const res = await enterQueue(myCallerId);
      console.log(res)
      console.log("Setting peerCallerId to:", res.caller_id); // Debugging log
      setPeerCallerId(res.caller_id);
      setPeerUserId(res.user_id);
    } catch (error) {
      console.log('Error getting a peer caller ID', error);
    }
  }

  async function handleAddFriend() {
    try {
      const friendData = await getUser((user.id === '427ad35b-52c5-4b8e-bff9-52e730e306ff' ? '9b94c6c0-dcfc-4ff8-b249-9294aa8b2840' : '427ad35b-52c5-4b8e-bff9-52e730e306ff'));
      setFriends((prevFriends) => [...prevFriends, friendData]);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='dashboard'>
      <div className="side-navbar">
        <div className="profile-section">
          <div className="profile-picture">{user?.username ? user.username.slice(0, 2).toUpperCase() : 'NA'}</div>
          <div className="profile-name">{user?.username || ''}</div>
        </div>
        <hr />
        <div className="friends-list">
          {friends.map((friend: User, index: number) => (
            <div key={index} className="friend-item">
              <div className="profile-picture">{friend.username ? friend.username.slice(0, 2).toUpperCase() : ''}</div>
              <div className="profile-name">{friend.username}</div>
              <button className="call-button">Call</button>
            </div>
          ))}
        </div>
      </div>
      <div className='main-content'>
            <Button label='Add friend' onClick={handleAddFriend} />

            <VideoCall 
            peerID={peerCallerId}
            getMyID={(myId) => getCaller(myId)}
            />
        
      </div>
    </div>
  );
}
