import Link from "next/link";

export default function PrivacyPolicy() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <div className="max-w-none">
                <h1 className="text-3xl font-bold mb-4">ZÁSADY ZPRACOVÁNÍ OSOBNÍCH ÚDAJŮ</h1>
                
                <p className="text-sm text-muted-foreground mb-8">
                <strong>Verze dokumentu:</strong> 1.0<br />
                <strong>Datum účinnosti:</strong> {new Date().toLocaleDateString('cs-CZ')}
                </p>

                <p className="mb-6">
                V souladu s čl. 13 Nařízení Evropského parlamentu a Rady (EU) 2016/679 o ochraně fyzických osob v souvislosti se zpracováním osobních údajů a o volném pohybu těchto údajů (dále jen <strong>„GDPR“</strong>) a zákonem č. 110/2019 Sb., o zpracování osobních údajů, vydává Správce tento dokument.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-4">I. TOTOŽNOST A KONTAKTNÍ ÚDAJE SPRÁVCE</h2>
                <p className="mb-4">Správcem vašich osobních údajů je autor studentského projektu:</p>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                <li><strong>Jméno a příjmení:</strong> David Racin</li>
                <li><strong>Sídlo:</strong> Uherské Hradiště</li>
                <li><strong>Kontaktní e-mail:</strong> <span className="bg-yellow-200 px-1 text-red-600 font-bold">racin_david@oauh.cz</span></li>
                <li>(dále jen <strong>„Správce“</strong>)</li>
                </ul>

                <h2 className="text-2xl font-semibold mt-8 mb-4">II. ÚČELY ZPRACOVÁNÍ A PRÁVNÍ ZÁKLAD</h2>
                <p className="mb-4">Správce zpracovává vaše osobní údaje v rozsahu nezbytném pro fungování aplikace <strong>Webové aplikace pro tvorbu životopisů (cvbuilder)</strong> (dále jen „Aplikace“).</p>

                <h3 className="text-xl font-medium mt-6 mb-3">1. Poskytování služby (Tvorba a správa životopisů)</h3>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Účel:</strong> Registrace uživatelského účtu, ukládání rozpracovaných životopisů, generování PDF dokumentů a umožnění opětovného přístupu k datům.</li>
                <li><strong>Právní základ:</strong> <strong>Plnění smlouvy</strong> dle čl. 6 odst. 1 písm. b) GDPR. Zpracování je nezbytné pro poskytnutí služby, o kterou jste registrací požádali.</li>
                <li><strong>Rozsah údajů (dle technické specifikace aplikace):</strong>
                    <ul className="list-circle pl-6 mt-2 space-y-1 text-gray-600 dark:text-gray-300">
                    <li><strong>Identifikační údaje účtu:</strong> Jméno, příjmení, e-mailová adresa, heslo (ukládáno jako kryptografický hash).</li>
                    <li><strong>Osobní údaje v CV (Personal Info):</strong> Jméno a příjmení, profesní titul, e-mail, telefonní číslo, fyzická adresa, datum narození, textové pole „O mně“ (bio).</li>
                    <li><strong>Pracovní zkušenosti (Experience):</strong> Názvy pracovních pozic, názvy společností/zaměstnavatelů, data působení (od–do), popisy pracovní náplně.</li>
                    <li><strong>Vzdělání (Education):</strong> Dosažené tituly/stupně vzdělání, názvy škol a institucí, data studia (od–do), popisy studia.</li>
                    <li><strong>Dovednosti (Skills):</strong> Seznam odborných či jazykových dovedností zadaných uživatelem.</li>
                    <li><strong>Další obsah:</strong> Jakékoli další údaje, které uživatel dobrovolně vloží do nepovinných polí nebo vlastních sekcí šablony.</li>
                    </ul>
                </li>
                </ul>

                <h3 className="text-xl font-medium mt-6 mb-3">2. Zabezpečení a technický provoz</h3>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                    <li><strong>Účel:</strong> Zajištění bezpečnosti Aplikace, prevence kybernetických útoků, autentizace uživatelů.</li>
                    <li><strong>Právní základ:</strong> <strong>Oprávněný zájem Správce</strong> dle čl. 6 odst. 1 písm. f) GDPR.</li>
                    <li><strong>Rozsah údajů:</strong> IP adresa, technické cookies (session ID), logy o přihlášení.</li>
                </ul>

                <h2 className="text-2xl font-semibold mt-8 mb-4">III. PŘÍJEMCI OSOBNÍCH ÚDAJŮ (ZPRACOVATELÉ)</h2>
                <p className="mb-4">Správce neposkytuje vaše údaje žádným třetím stranám za účelem marketingu. Pro zajištění technického chodu Aplikace využívá Správce ověřeného zpracovatele:</p>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                    <li><strong>Google Ireland Limited</strong> (Irsko) – Služba Firebase (Authentication, Firestore Database). Společnost Google splňuje požadavky GDPR.</li>
                </ul>

                <h2 className="text-2xl font-semibold mt-8 mb-4">IV. DOBA ULOŽENÍ ÚDAJŮ</h2>
                <p className="mb-4">Osobní údaje jsou zpracovávány a ukládány po dobu trvání vašeho uživatelského účtu.</p>
                <ol className="list-decimal pl-6 mb-6 space-y-2">
                    <li><strong>Smazání uživatelem:</strong> Uživatel má možnost kdykoli v nastavení Aplikace smazat jednotlivé životopisy nebo trvale smazat celý uživatelský účet.</li>
                    <li><strong>Ukončení projektu:</strong> Vzhledem k tomu, že se jedná o studentský projekt, vyhrazuje si Správce právo po ukončení hodnocení projektu nebo po uplynutí přiměřené doby neaktivity (min. 1 rok) data smazat.</li>
                </ol>

                <h2 className="text-2xl font-semibold mt-8 mb-4">V. PRÁVA SUBJEKTU ÚDAJŮ</h2>
                <p className="mb-4">Jako subjekt údajů máte dle GDPR následující práva, která můžete uplatnit na výše uvedeném e-mailu:</p>
                <ol className="list-decimal pl-6 mb-6 space-y-2">
                    <li><strong>Právo na přístup (čl. 15 GDPR)</strong>Máte právo získat potvrzení, zda vaše údaje zpracováváme, a získat kopii těchto údajů (data jsou přístupná přímo v rozhraní Aplikace).</li>
                    <li><strong>Právo na opravu (čl. 16 GDPR)</strong>Máte právo na to, abychom bez zbytečného odkladu opravili nepřesné nebo neúplné osobní údaje. (Editaci provádíte sami v Aplikaci).</li>
                    <li><strong>Právo na výmaz / právo být zapomenut (čl. 17 GDPR)</strong>Máte právo požádat o smazání svých osobních údajů, pokud již nejsou nezbytné pro účely, pro které byly shromážděny, nebo pokud odvoláte souhlas/zrušíte účet. (Smazání provádíte sami v Aplikaci).</li>
                    <li><strong>Právo na omezení zpracování (čl. 18 GDPR)</strong>Máte právo požádat o omezení zpracování svých osobních údajů v určitých situacích, například pokud zpochybňujete přesnost údajů nebo pokud zpracování je protiprávní, ale odmítáte výmaz.</li>
                    <li><strong>Právo na přenositelnost údajů (čl. 20 GDPR)</strong>Máte právo získat své osobní údaje, které jste nám poskytli, v strukturovaném, běžně používaném a strojově čitelném formátu, a máte právo tyto údaje předat jinému správci.</li>
                    <li><strong>Právo vznést stížnost</strong>Pokud se domníváte, že zpracováním vašich údajů bylo porušeno GDPR, máte právo podat stížnost u dozorového úřadu, kterým je v ČR Úřad pro ochranu osobních údajů</li>
                </ol>

                <h2 className="text-2xl font-semibold mt-8 mb-4">VI. COOKIES</h2>
                <p className="mb-6">
                Aplikace používá pouze nezbytně nutné (technické) soubory cookies, které jsou vyžadovány pro přihlášení uživatele a zabezpečení relace. Dle § 89 odst. 3 zákona č. 127/2005 Sb., o elektronických komunikacích, není pro tyto cookies vyžadován aktivní souhlas uživatele (tzv. opt-in), ale pouze informační povinnost. Aplikace nepoužívá analytické ani reklamní cookies.
                </p>

                <div className="mt-12 pt-8 border-t">
                <Link href="/" className="text-blue-600 hover:underline">
                    &larr; Zpět na úvodní stranu
                </Link>
                </div>
            </div>
        </div>
    );
}