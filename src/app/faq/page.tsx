import FAQPage from '@/components/page/FAQ/FAQClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'FAQ — Karughor',
    description: 'Answers to common questions about delivery, payment, returns and our handcrafted products.',
};

export default function page() {
    return (
        <div>
            <FAQPage />
        </div>
    );
}