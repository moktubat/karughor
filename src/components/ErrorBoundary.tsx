'use client';

import React, { ErrorInfo, ReactNode } from 'react';
import Link from 'next/link';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    message: string;
}

export class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            message: '',
        };
    }

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            message: error.message || 'Something went wrong',
        };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error('[ErrorBoundary]', error, info);
    }

    handleRefresh = () => {
        this.setState({ hasError: false, message: '' });
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-white flex items-center justify-center px-4">
                    <div className="max-w-md w-full text-center">
                        <div className="text-6xl mb-6">😕</div>

                        <h1 className="text-2xl font-bold text-[#0B0F0E] mb-3">
                            Something went wrong
                        </h1>

                        <p className="text-[#818B9C] mb-2 text-sm">
                            {this.state.message}
                        </p>

                        <p className="text-[#818B9C] mb-8 text-xs">
                            Try refreshing the page or go back home.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={this.handleRefresh}
                                className="px-6 py-3 bg-[#C85A3A] text-white rounded-lg font-semibold hover:bg-[#A84830] transition-colors"
                            >
                                Refresh Page
                            </button>

                            <Link href="/" className="w-full sm:w-auto">
                                <button className="px-6 py-3 border border-[#E4E9EE] text-[#0B0F0E] rounded-lg font-semibold hover:border-[#C85A3A] hover:text-[#C85A3A] transition-colors w-full">
                                    Go Home
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}