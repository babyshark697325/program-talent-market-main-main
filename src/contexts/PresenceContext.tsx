/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

interface PresenceContextType {
    onlineUsers: Set<string>;
}

const PresenceContext = createContext<PresenceContextType>({ onlineUsers: new Set() });

export const usePresence = () => useContext(PresenceContext);

export const PresenceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
    const [channel, setChannel] = useState<RealtimeChannel | null>(null);

    useEffect(() => {
        // 1. Join the channel to broadcast own presence and listen to others
        const room = supabase.channel('online-users', {
            config: {
                presence: {
                    key: user?.id,
                },
            },
        });

        room
            .on('presence', { event: 'sync' }, () => {
                const newState = room.presenceState();
                const userIds = new Set(Object.keys(newState));
                // console.log('Presence sync:', userIds);
                setOnlineUsers(userIds);
            })
            .on('presence', { event: 'join' }, ({ key, newPresences }) => {
                // console.log('join', key, newPresences);
                setOnlineUsers((prev) => {
                    const next = new Set(prev);
                    next.add(key);
                    return next;
                });
            })
            .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
                // console.log('leave', key, leftPresences);
                setOnlineUsers((prev) => {
                    const next = new Set(prev);
                    next.delete(key);
                    return next;
                });
            });

        room.subscribe(async (status) => {
            if (status === 'SUBSCRIBED') {
                if (user) {
                    await room.track({
                        user_id: user.id,
                        online_at: new Date().toISOString(),
                    });
                }
            }
        });

        setChannel(room);

        return () => {
            supabase.removeChannel(room);
        };
    }, [user]);

    // Update track info if user changes (e.g. logs in)
    useEffect(() => {
        if (channel && user) {
            channel.track({
                user_id: user.id,
                online_at: new Date().toISOString(),
            });
        } else if (channel && !user) {
            channel.untrack();
        }
    }, [user, channel]);

    return (
        <PresenceContext.Provider value={{ onlineUsers }}>
            {children}
        </PresenceContext.Provider>
    );
};
