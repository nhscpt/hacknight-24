import React, { useEffect, useRef, useState } from 'react';
import { usePeer } from '../../lib/PeerContext';

export default function VideoCall() {
  const peer = usePeer();
  const [myID, setMyID] = useState<string | null>(null);
  const [remoteID, setRemoteID] = useState<string>('');
  const myVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!peer) return;

    peer.on('open', (id) => {
      setMyID(id);
    });

    peer.on('call', (call) => {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
        myVideoRef.current!.srcObject = stream;
        myVideoRef.current!.play();
        call.answer(stream);
        call.on('stream', (remoteStream) => {
          remoteVideoRef.current!.srcObject = remoteStream;
          remoteVideoRef.current!.play();
        });
      });
    });

  }, [peer]);

  const callPeer = (id: string) => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      myVideoRef.current!.srcObject = stream;
      myVideoRef.current!.play();
      const call = peer!.call(id, stream);
      call.on('stream', (remoteStream) => {
        remoteVideoRef.current!.srcObject = remoteStream;
        remoteVideoRef.current!.play();
      });
    });
  };

  return (
    <div>
      <h1>My ID: {myID}</h1>
      <input
        type="text"
        value={remoteID}
        onChange={(e) => setRemoteID(e.target.value)}
        placeholder="Remote Peer ID"
      />
      <button onClick={() => callPeer(remoteID)}>Call</button>
      <div>
        <video ref={myVideoRef} muted />
        <video ref={remoteVideoRef} />
      </div>
    </div>
  );
};