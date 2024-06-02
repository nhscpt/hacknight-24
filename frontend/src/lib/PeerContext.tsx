import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import Peer from 'peerjs';

interface PeerProviderProps {
  children: ReactNode;
}

const PeerContext = createContext<Peer | null>(null);

export const PeerProvider: React.FC<PeerProviderProps> = ({ children }) => {
  const [peer, setPeer] = useState<Peer | null>(null);

  useEffect(() => {
    const newPeer = new Peer({
      host: '0.peerjs.com',
      port: 443,
      secure: true,
    });

    setPeer(newPeer);

    return () => {
      newPeer.destroy();
    };
  }, []);

  return (
    <PeerContext.Provider value={peer}>
      {children}
    </PeerContext.Provider>
  );
};

export const usePeer = () => useContext(PeerContext);
