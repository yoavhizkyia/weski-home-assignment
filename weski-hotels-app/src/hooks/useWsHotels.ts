import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

import { Hotel } from '../models/Hotel';
import { SearchPayload } from '../models/SearchPayload';

const WS_URL = 'http://localhost:8080';

export function useHotelWS(searchParams: SearchPayload | null) {
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [isError, setIsError] = useState(false);
    const socketRef = useRef<Socket | null>(null);
    const clientIdRef = useRef<string>(uuidv4());

    useEffect(() => {        
        const socket = io(WS_URL, {
            reconnectionAttempts: 3,
            timeout: 3000,
        });

        socketRef.current = socket;
        console.log("Socket connected");

        socket.on('connect_error', (err) => {
            console.error('Connection error:', err.message);
            setIsError(true);
        });

        socket.on('hotelResults', (data: Hotel[]) => {
            console.log("Received hotel results:", data);
            setHotels(data);
        });

        socket.on('done', () => {
            console.log("Search finished");
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (searchParams && socketRef.current) {
            setHotels([]);
            setIsError(false);

            socketRef.current.emit('startSearch', {
                ...searchParams,
                clientId: clientIdRef.current,
            });
        }
    }, [searchParams]);

    return { hotels, isError };
}
