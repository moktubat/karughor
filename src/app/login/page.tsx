import { Suspense } from 'react';
import Login from '@/components/page/login/login';

export default function Page() {
    return (
        <Suspense fallback={<div>Loading profile...</div>}>
            <Login />
        </Suspense>
    );
}
