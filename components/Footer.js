import Link from "next/link";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full border-t bg-background py-6 mt-auto">
            <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                <p>&copy; {currentYear} cvbuilder. Studentský projekt (Maturitní práce).</p>
                <div className="mt-2 space-x-4">
                    <Link href="/legal/terms" className="text-blue-600 hover:underline">
                        Obchodní podmínky
                    </Link>
                    <Link href="/legal/privacy" className="text-blue-600 hover:underline">
                        Zásady zpracování osobních údajů
                    </Link>
                </div>
            </div>
        </footer>
    );
}