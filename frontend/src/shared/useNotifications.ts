import { useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { API } from '../constants';
import type { Notification } from '../types';

export function useNotifications(userId: number | undefined, token: string | null) {
  const [liveNotifications, setLiveNotifications] = useState<Notification[]>([]);
  const [liveCount, setLiveCount] = useState(0);
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    if (!userId || !token) return;

    const client = new Client({
      webSocketFactory: () => new SockJS(`${API}/ws`),
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe(`/topic/notifications/${userId}`, (msg) => {
          const notification: Notification = JSON.parse(msg.body);
          setLiveNotifications(prev => [notification, ...prev]);
          setLiveCount(prev => prev + 1);
        });
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
      clientRef.current = null;
    };
  }, [userId, token]);

  const resetCount = () => setLiveCount(0);

  return { liveNotifications, liveCount, resetCount };
}
