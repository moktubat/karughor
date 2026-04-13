'use client';

import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { FaSave, FaSpinner } from 'react-icons/fa';
import { adminAuthHeaders } from '@/lib/adminAuth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://karughor-backend.onrender.com/api';



interface ISettings {
    codEnabled: boolean;
    maxCodAmount: number;
    insideDhakaCharge: number;
    outsideDhakaCharge: number;
    taxPercentage: number;
    autoCancel: boolean;
    autoCancelHours: number;
}

const DEFAULT: ISettings = {
    codEnabled: true,
    maxCodAmount: 50000,
    insideDhakaCharge: 70,
    outsideDhakaCharge: 120,
    taxPercentage: 0,
    autoCancel: false,
    autoCancelHours: 48,
};

const Settings = () => {
    const queryClient = useQueryClient();
    const [local, setLocal] = useState<ISettings>(DEFAULT);
    const [hasChanges, setHasChanges] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    const { data, isLoading } = useQuery({
        queryKey: ['admin-settings'],
        queryFn: async () => {
            const res = await axios.get(`${API_URL}/settings`);
            return res.data.data.settings as ISettings;
        },
    });

    useEffect(() => {
        if (data) {
            setLocal(data);
            setHasChanges(false);
        }
    }, [data]);

    const saveMutation = useMutation({
        mutationFn: async (settings: ISettings) => {
            const res = await axios.put(`${API_URL}/settings`, settings, {
                headers: adminAuthHeaders(),
                withCredentials: true,
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
            setHasChanges(false);
            setSuccessMsg('Settings saved!');
            setTimeout(() => setSuccessMsg(''), 3000);
        },
    });

    const handleChange = (key: keyof ISettings, value: boolean | number) => {
        setLocal(prev => ({ ...prev, [key]: value }));
        setHasChanges(true);
    };

    const handleReset = () => {
        if (data) { setLocal(data); setHasChanges(false); }
    };

    const Toggle = ({ field }: { field: 'codEnabled' | 'autoCancel' }) => (
        <button
            onClick={() => handleChange(field, !local[field])}
            className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors ${local[field] ? 'bg-[#C85A3A]' : 'bg-gray-300'}`}
        >
            <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${local[field] ? 'translate-x-9' : 'translate-x-1'}`} />
        </button>
    );

    if (isLoading) {
        return (
            <div className="bg-[#F7F7F7] min-h-screen flex items-center justify-center">
                <FaSpinner className="animate-spin w-8 h-8 text-[#C85A3A]" />
            </div>
        );
    }

    return (
        <div className="bg-[#F7F7F7] min-h-screen p-6">
            <div className="max-w-250 mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#0B0F0E] mb-2">Settings</h1>
                    <p className="text-[#818B9C]">Configure your store settings</p>
                </div>

                {successMsg && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 font-medium">
                        ✅ {successMsg}
                    </div>
                )}

                <div className="space-y-6">
                    {/* COD */}
                    <div className="bg-white border border-[#E4E9EE] rounded-lg p-6 md:p-8">
                        <h2 className="text-xl font-bold text-[#0B0F0E] mb-6">Cash on Delivery (COD)</h2>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-[#F7F7F7] rounded-lg">
                                <div>
                                    <h3 className="font-semibold text-[#0B0F0E] mb-1">Enable COD</h3>
                                    <p className="text-sm text-[#818B9C]">Allow customers to pay on delivery</p>
                                </div>
                                <Toggle field="codEnabled" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-base font-medium text-[#0B0F0E]">Maximum COD Order Amount (৳)</label>
                                <input
                                    type="number"
                                    value={local.maxCodAmount}
                                    onChange={e => handleChange('maxCodAmount', parseInt(e.target.value))}
                                    disabled={!local.codEnabled}
                                    className="px-4 py-3 border border-[#E4E9EE] rounded-lg text-base focus:outline-none focus:border-[#C85A3A] focus:ring-2 focus:ring-[#C85A3A]/20 disabled:bg-[#F7F7F7] disabled:cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Delivery Charges */}
                    <div className="bg-white border border-[#E4E9EE] rounded-lg p-6 md:p-8">
                        <h2 className="text-xl font-bold text-[#0B0F0E] mb-6">Delivery Charges</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-base font-medium text-[#0B0F0E]">Inside Dhaka (৳)</label>
                                <input
                                    type="number"
                                    value={local.insideDhakaCharge}
                                    onChange={e => handleChange('insideDhakaCharge', parseInt(e.target.value))}
                                    className="px-4 py-3 border border-[#E4E9EE] rounded-lg text-base focus:outline-none focus:border-[#C85A3A] focus:ring-2 focus:ring-[#C85A3A]/20"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-base font-medium text-[#0B0F0E]">Outside Dhaka (৳)</label>
                                <input
                                    type="number"
                                    value={local.outsideDhakaCharge}
                                    onChange={e => handleChange('outsideDhakaCharge', parseInt(e.target.value))}
                                    className="px-4 py-3 border border-[#E4E9EE] rounded-lg text-base focus:outline-none focus:border-[#C85A3A] focus:ring-2 focus:ring-[#C85A3A]/20"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Tax */}
                    <div className="bg-white border border-[#E4E9EE] rounded-lg p-6 md:p-8">
                        <h2 className="text-xl font-bold text-[#0B0F0E] mb-6">Tax Settings</h2>
                        <div className="flex flex-col gap-2">
                            <label className="text-base font-medium text-[#0B0F0E]">Tax Percentage (%)</label>
                            <input
                                type="number"
                                step="0.1"
                                value={local.taxPercentage}
                                onChange={e => handleChange('taxPercentage', parseFloat(e.target.value))}
                                className="px-4 py-3 border border-[#E4E9EE] rounded-lg text-base focus:outline-none focus:border-[#C85A3A] focus:ring-2 focus:ring-[#C85A3A]/20"
                            />
                            <p className="text-sm text-[#818B9C]">Set to 0 to disable tax</p>
                        </div>
                    </div>

                    {/* Auto-Cancel */}
                    <div className="bg-white border border-[#E4E9EE] rounded-lg p-6 md:p-8">
                        <h2 className="text-xl font-bold text-[#0B0F0E] mb-6">Order Auto-Cancel</h2>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-[#F7F7F7] rounded-lg">
                                <div>
                                    <h3 className="font-semibold text-[#0B0F0E] mb-1">Enable Auto-Cancel</h3>
                                    <p className="text-sm text-[#818B9C]">Automatically cancel unconfirmed orders</p>
                                </div>
                                <Toggle field="autoCancel" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-base font-medium text-[#0B0F0E]">Auto-Cancel After (Hours)</label>
                                <input
                                    type="number"
                                    value={local.autoCancelHours}
                                    onChange={e => handleChange('autoCancelHours', parseInt(e.target.value))}
                                    disabled={!local.autoCancel}
                                    className="px-4 py-3 border border-[#E4E9EE] rounded-lg text-base focus:outline-none focus:border-[#C85A3A] focus:ring-2 focus:ring-[#C85A3A]/20 disabled:bg-[#F7F7F7] disabled:cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sticky save bar */}
                {hasChanges && (
                    <div className="sticky bottom-6 mt-8 bg-white border border-[#E4E9EE] rounded-lg p-6 shadow-lg">
                        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                            <p className="text-[#818B9C]">You have unsaved changes</p>
                            <div className="flex gap-4">
                                <button
                                    onClick={handleReset}
                                    className="px-6 py-3 border border-[#E4E9EE] text-[#818B9C] rounded-lg font-semibold hover:bg-[#F7F7F7] transition-all"
                                >
                                    Reset
                                </button>
                                <button
                                    onClick={() => saveMutation.mutate(local)}
                                    disabled={saveMutation.isPending}
                                    className="flex items-center gap-2 px-6 py-3 bg-[#C85A3A] text-white rounded-lg font-semibold hover:bg-[#A84830] transition-all disabled:opacity-50"
                                >
                                    {saveMutation.isPending ? <FaSpinner className="animate-spin" /> : <FaSave />}
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Settings;