import PrivacyPolicyPage from '@/components/page/PrivacyPolicy/PrivacyPolicyPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy — Karughor',
    description: 'How Karughor collects, uses and protects your personal information.',
};

export default function page() {
    return (
        <div>
            <PrivacyPolicyPage />
        </div>
    );
}