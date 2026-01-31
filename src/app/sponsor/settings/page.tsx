'use client';

import { SettingsForm } from '@/components/settings/SettingsForm';

export default function SponsorSettingsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
                Settings
            </h1>
            <SettingsForm />
        </div>
    );
}
