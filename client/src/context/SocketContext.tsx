import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { useToast } from '../utils/toast';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  unreadNotificationsCount: number;
  decrementUnread: () => void;
  resetUnread: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState<number>(0);
  const { token, isAuthenticated } = useAuth();
  const toast = useToast();

  useEffect(() => {
    if (!isAuthenticated || !token) {
      if (socket) socket.disconnect();
      return;
    }

    const s = io(window.location.origin, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    s.on('connect', () => {
      setIsConnected(true);
    });

    s.on('disconnect', () => {
      setIsConnected(false);
    });

    s.on('new_notification', (data: any) => {
      setUnreadNotificationsCount((prev) => prev + 1);
      toast.info(`🔔 ${data.title}: ${data.message}`);
    });

    s.on('order_status_changed', (data: any) => {
      toast.info(`📦 Order Status: Now ${data.orderStatus.replace(/_/g, ' ')}`);
    });

    s.on('new_seller_order', (data: any) => {
      toast.success(`🎉 New Order Received! Order #${data.orderNumber} for ₹${data.totalAmount}`);
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, [isAuthenticated, token]);

  const decrementUnread = () => setUnreadNotificationsCount((prev) => Math.max(0, prev - 1));
  const resetUnread = () => setUnreadNotificationsCount(0);

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        unreadNotificationsCount,
        decrementUnread,
        resetUnread,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error('useSocket must be used within a SocketProvider');
  return context;
};
