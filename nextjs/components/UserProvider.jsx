'use client';

import {useEffect, useState} from 'react';
import {UserContext} from '@/context/UserContext';
import useToken from '@/hooks/useToken';
import { get } from '@/lib/api';

export default function UserProvider({children}) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const token = await useToken('token');
            const response = await get({endpoint: 'profile', bearerToken: token});
            if (response.status) {
                setUser(response.user);
            }
        };

        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={user}>
            {children}
        </UserContext.Provider>
    );
}
