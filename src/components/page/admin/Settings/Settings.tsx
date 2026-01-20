'use client';

import React, { useState } from 'react';
import { FaSave, FaToggleOn, FaToggleOff } from 'react-icons/fa';

interface Settings {
    codEnabled: boolean;
    maxCodAmount: number;
    insideDhakaCharge: number;
    outsideDhakaCharge: number;
    taxPercentage: number;
    autoCancel: boolean;
    autoCancelHours: number;
}

const Settings = () => {
    const [settings, setSettings] = useState<Settings>({
        codEnabled: true,
        maxCodAmount: 50000,
        insideDhakaCharge: 70,
        outsideDhakaCharge: 120,
        taxPercentage: 0,
        autoCancel: false,
        autoCancelHours: 48,
    });

    const [hasChanges, setHasChanges] = useState(false);

    const handleChange = (key: keyof Settings, value: boolean | number) => {
        setSettings((prev) => ({ ...prev, [key]: value }));
        setHasChanges(true);
    };

    const handleSave = () => {
        console.log('Settings saved:', settings);
        alert('Settings saved successfully!');
        setHasChanges(false);
    };

    const handleReset = () => {
        setSettings({
            codEnabled: true,
            maxCodAmount: 50000,
            insideDhakaCharge: 70,
            outsideDhakaCharge: 120,
            taxPercentage: 0,
            autoCancel: false,
            autoCancelHours: 48,
        });
        setHasChanges(false);
    };

    return (
        <div className="bg-[#F7F7F7] min-h-screen p-6">
            <div className="max-w-[1000px] mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#0B0F0E] mb-2">Settings</h1>
                    <p className="text-[#818B9C]">Configure your store settings</p>
                </div>

                {/* Settings Cards */}
                <div className="space-y-6">
                    {/* COD Settings */}
                    <div className="bg-white border border-[#E4E9EE] rounded-lg p-6 md:p-8">
                        <h2 className="text-xl font-bold text-[#0B0F0E] mb-6">
                            Cash on Delivery (COD)
                        </h2>

                        <div className="space-y-6">
                            {/* Enable/Disable COD */}
                            <div className="flex items-center justify-between p-4 bg-[#F7F7F7] rounded-lg">
                                <div>
                                    <h3 className="font-semibold text-[#0B0F0E] mb-1">
                                        Enable COD
                                    </h3>
                                    <p className="text-sm text-[#818B9C]">
                                        Allow customers to pay on delivery
                                    </p>
                                </div>
                                <button
                                    onClick={() =>
                                        handleChange('codEnabled', !settings.codEnabled)
                                    }
                                    className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors ${settings.codEnabled ? 'bg-[#C85A3A]' : 'bg-gray-300'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${settings.codEnabled
                                                ? 'translate-x-9'
                                                : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>

                            {/* Max COD Amount */}
                            <div className="flex flex-col gap-2">
                                <label className="text-base font-medium text-[#0B0F0E]">
                                    Maximum COD Order Amount
                                </label>
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl font-semibold text-[#818B9C]">$</span>
                                    <input
                                        type="number"
                                        value={settings.maxCodAmount}
                                        onChange={(e) =>
                                            handleChange('maxCodAmount', parseInt(e.target.value))
                                        }
                                        disabled={!settings.codEnabled}
                                        className="flex-1 px-4 py-3 border border-[#E4E9EE] rounded-lg text-base transition-all duration-300 focus:outline-none focus:border-[#C85A3A] focus:ring-2 focus:ring-[#C85A3A]/20 disabled:bg-[#F7F7F7] disabled:cursor-not-allowed"
                                    />
                                </div>
                                <p className="text-sm text-[#818B9C]">
                                    Orders above this amount will not allow COD
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Charges */}
                    <div className="bg-white border border-[#E4E9EE] rounded-lg p-6 md:p-8">
                        <h2 className="text-xl font-bold text-[#0B0F0E] mb-6">
                            Delivery Charges
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Inside Dhaka */}
                            <div className="flex flex-col gap-2">
                                <label className="text-base font-medium text-[#0B0F0E]">
                                    Inside Dhaka
                                </label>
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl font-semibold text-[#818B9C]">$</span>
                                    <input
                                        type="number"
                                        value={settings.insideDhakaCharge}
                                        onChange={(e) =>
                                            handleChange(
                                                'insideDhakaCharge',
                                                parseInt(e.target.value)
                                            )
                                        }
                                        className="flex-1 px-4 py-3 border border-[#E4E9EE] rounded-lg text-base transition-all duration-300 focus:outline-none focus:border-[#C85A3A] focus:ring-2 focus:ring-[#C85A3A]/20"
                                    />
                                </div>
                            </div>

                            {/* Outside Dhaka */}
                            <div className="flex flex-col gap-2">
                                <label className="text-base font-medium text-[#0B0F0E]">
                                    Outside Dhaka
                                </label>
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl font-semibold text-[#818B9C]">$</span>
                                    <input
                                        type="number"
                                        value={settings.outsideDhakaCharge}
                                        onChange={(e) =>
                                            handleChange(
                                                'outsideDhakaCharge',
                                                parseInt(e.target.value)
                                            )
                                        }
                                        className="flex-1 px-4 py-3 border border-[#E4E9EE] rounded-lg text-base transition-all duration-300 focus:outline-none focus:border-[#C85A3A] focus:ring-2 focus:ring-[#C85A3A]/20"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tax Settings */}
                    <div className="bg-white border border-[#E4E9EE] rounded-lg p-6 md:p-8">
                        <h2 className="text-xl font-bold text-[#0B0F0E] mb-6">Tax Settings</h2>

                        <div className="flex flex-col gap-2">
                            <label className="text-base font-medium text-[#0B0F0E]">
                                Tax Percentage
                            </label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="number"
                                    value={settings.taxPercentage}
                                    onChange={(e) =>
                                        handleChange('taxPercentage', parseFloat(e.target.value))
                                    }
                                    step="0.1"
                                    className="flex-1 px-4 py-3 border border-[#E4E9EE] rounded-lg text-base transition-all duration-300 focus:outline-none focus:border-[#C85A3A] focus:ring-2 focus:ring-[#C85A3A]/20"
                                />
                                <span className="text-2xl font-semibold text-[#818B9C]">%</span>
                            </div>
                            <p className="text-sm text-[#818B9C]">
                                Set to 0 to disable tax on orders
                            </p>
                        </div>
                    </div>

                    {/* Order Auto-Cancel */}
                    <div className="bg-white border border-[#E4E9EE] rounded-lg p-6 md:p-8">
                        <h2 className="text-xl font-bold text-[#0B0F0E] mb-6">
                            Order Auto-Cancel
                        </h2>

                        <div className="space-y-6">
                            {/* Enable Auto-Cancel */}
                            <div className="flex items-center justify-between p-4 bg-[#F7F7F7] rounded-lg">
                                <div>
                                    <h3 className="font-semibold text-[#0B0F0E] mb-1">
                                        Enable Auto-Cancel
                                    </h3>
                                    <p className="text-sm text-[#818B9C]">
                                        Automatically cancel unconfirmed orders
                                    </p>
                                </div>
                                <button
                                    onClick={() =>
                                        handleChange('autoCancel', !settings.autoCancel)
                                    }
                                    className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors ${settings.autoCancel ? 'bg-[#C85A3A]' : 'bg-gray-300'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${settings.autoCancel
                                                ? 'translate-x-9'
                                                : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>

                            {/* Auto-Cancel Time */}
                            <div className="flex flex-col gap-2">
                                <label className="text-base font-medium text-[#0B0F0E]">
                                    Auto-Cancel After (Hours)
                                </label>
                                <input
                                    type="number"
                                    value={settings.autoCancelHours}
                                    onChange={(e) =>
                                        handleChange('autoCancelHours', parseInt(e.target.value))
                                    }
                                    disabled={!settings.autoCancel}
                                    className="px-4 py-3 border border-[#E4E9EE] rounded-lg text-base transition-all duration-300 focus:outline-none focus:border-[#C85A3A] focus:ring-2 focus:ring-[#C85A3A]/20 disabled:bg-[#F7F7F7] disabled:cursor-not-allowed"
                                />
                                <p className="text-sm text-[#818B9C]">
                                    Unconfirmed orders will be cancelled after this many hours
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
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
                                    onClick={handleSave}
                                    className="flex items-center gap-2 px-6 py-3 bg-[#C85A3A] text-white rounded-lg font-semibold hover:bg-[#A84830] transition-all"
                                >
                                    <FaSave />
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