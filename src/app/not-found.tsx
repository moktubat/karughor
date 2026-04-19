import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="bg-white w-full min-h-screen flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">

                <div className="text-8xl font-bold text-[#E4E9EE] mb-4 select-none">
                    404
                </div>

                <div className="text-5xl mb-6">🧵</div>

                <h1 className="text-2xl font-bold text-[#0B0F0E] mb-3">
                    Page Not Found
                </h1>

                <p className="text-[#818B9C] mb-8 leading-relaxed">
                    Looks like this thread got lost. The page you&apos;re looking for
                    doesn&apos;t exist or has been moved.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href="/">
                        <button className="px-6 py-3 bg-[#C85A3A] text-white rounded-lg font-semibold hover:bg-[#A84830] transition-colors w-full sm:w-auto">
                            Go Home
                        </button>
                    </Link>
                    <Link href="/products">
                        <button className="px-6 py-3 border border-[#E4E9EE] text-[#0B0F0E] rounded-lg font-semibold hover:border-[#C85A3A] hover:text-[#C85A3A] transition-colors w-full sm:w-auto">
                            Browse Products
                        </button>
                    </Link>
                </div>

            </div>
        </div>
    );
}