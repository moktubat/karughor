export default function ProductDetailsSkeleton() {
    return (
        <div className="max-w-300 mx-auto px-6 py-10 animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="aspect-square bg-gray-200 rounded-lg" />
                <div className="flex flex-col gap-4">
                    <div className="h-8 bg-gray-200 rounded w-3/4" />
                    <div className="h-6 bg-gray-200 rounded w-1/4" />
                    <div className="h-24 bg-gray-200 rounded" />
                    <div className="h-12 bg-gray-200 rounded w-1/2" />
                </div>
            </div>
        </div>
    );
}