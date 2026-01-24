import { Suspense } from 'react';
import UserProfile from "@/components/page/UserProfile/UserProfile";

export default function Page() {
    return (
        <Suspense fallback={<div>Loading profile...</div>}>
            <UserProfile />
        </Suspense>
    );
}
