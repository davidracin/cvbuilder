'use client';

import { usePathname } from 'next/navigation';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';

const FOOTER_ROUTES = ['/', '/templates', '/settings'];
const HIDE_BANNER_PREFIXES = ['/editor'];

export default function LayoutShell({ children }) {
    const pathname = usePathname();

    const showFooter = FOOTER_ROUTES.includes(pathname);
    const showBanner = !HIDE_BANNER_PREFIXES.some((prefix) => pathname.startsWith(prefix));

    return (
        <>
            {children}
            {showBanner && <CookieBanner />}
            {showFooter && <Footer />}
        </>
    );
}
