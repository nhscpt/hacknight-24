import React, { useEffect, useRef, useState } from 'react';
import { usePeer } from '../../lib/PeerContext';

export default function VideoCall(props: {
  peerID: string,
  getMyID: (myID: string) => void
}) {
  const peer = usePeer();
  const [myID, setMyID] = useState<string | null>(null);
  const myVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    console.log("Received peerID:", props.peerID); // Debugging log
    if (props.peerID) {
      callPeer(props.peerID);
    }
  }, [props.peerID]);

  useEffect(() => {
    if (!peer) return;

    peer.on('open', (id) => {
      setMyID(id);
      props.getMyID(id);
    });

    peer.on('call', (call) => {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
        if (myVideoRef.current) {
          myVideoRef.current.srcObject = stream;
          myVideoRef.current.play();
        }
        call.answer(stream);
        call.on('stream', (remoteStream) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
            remoteVideoRef.current.play();
          }
        });
      });
    });
  }, [peer]);

  const callPeer = (id: string) => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      if (myVideoRef.current) {
        myVideoRef.current.srcObject = stream;
        myVideoRef.current.play();
      }
      const call = peer!.call(id, stream);
      call.on('stream', (remoteStream) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.play();
        }
      });
    }).catch((error) => {
      console.error('Error accessing media devices.', error);
    });
  };

  return (
    <div>
      <div>
        <video ref={myVideoRef} muted playsInline />
        <video ref={remoteVideoRef} playsInline />
      </div>
    </div>
  );
}
