'use client';

import { useState, useEffect } from 'react';

export default function CookieBanner() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const dismissed = localStorage.getItem('cookieConsent');
        if (!dismissed) {
            setVisible(true);
        }
    }, []);

    const handleDismiss = () => {
        localStorage.setItem('cookieConsent', 'true');
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] max-w-lg bg-gray-800 text-white px-4 py-3 rounded-lg shadow-lg z-50">
            <p className="text-sm">
                Tento web používá k zajištění funkčnosti pouze nezbytně nutné (technické) soubory cookies. Tyto soubory cookies jsou nutné pro správné fungování webu a nelze je vypnout. Žádné analytické ani reklamní cookies nepoužíváme.
            </p>
            <button
                className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded"
                onClick={handleDismiss}
            >
                Rozumím
            </button>
        </div>
    );
}