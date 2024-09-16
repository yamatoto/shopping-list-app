import React from 'react';
import { useRouter } from 'expo-router';

import Configure from '@/features/configure';
import { ConfigurePath } from '@/features/configure/bugReport/constants/path';

export default function ConfigureScreen() {
    const router = useRouter();

    const handleRoute = (path: ConfigurePath) => {
        router.push(`/configure/${path}`);
    };

    return <Configure handleRoute={handleRoute} />;
}
