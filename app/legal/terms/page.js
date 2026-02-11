import Link from "next/link";

export default function TermsOfService() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <div className="max-w-none">
                <h1 className="text-3xl font-bold mb-4">VŠEOBECNÉ OBCHODNÍ PODMÍNKY UŽÍVÁNÍ APLIKACE WEBOVÉ APLIKACE PRO TVORBU ŽIVOTOPISŮ (CVBUILDER)</h1>
                
                <p className="text-sm text-muted-foreground mb-8">
                <strong>Verze dokumentu:</strong> 1.0<br />
                <strong>Datum účinnosti:</strong> {new Date().toLocaleDateString('cs-CZ')}
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-4">I. ÚVODNÍ USTANOVENÍ</h2>
                <ol className="list-decimal pl-6 mb-6 space-y-2">
                <li>Tyto Všeobecné obchodní podmínky (dále jen "VOP") upravují vzájemná práva a povinnosti mezi autorem aplikace Davidem Racinem (dále jen „Provozovatel“) a uživatelem aplikace webové aplikace pro tvorbu životopisů (cvbuilder) (dále jen „Uživatel“).</li>
                <li>Aplikace webová aplikace pro tvorbu životopisů (cvbuilder) (dále jen „Aplikace“) je softwarový nástroj určený k tvorbě, úpravě a exportu strukturovaných životopisů.</li>
                <li><strong>Uporzornění na charakter projektu:</strong> Uživatel bere na vědomí, že Aplikace je provozována jako studentský školní projekt (Maturitní práce). Služba není komerčním produktem a je poskytována bezplatně.</li>
                </ol>

                <h2 className="text-2xl font-semibold mt-8 mb-4">II. REGISTRACE A UŽIVATELSKÝ ÚČET</h2>
                <ol className="list-decimal pl-6 mb-6 space-y-2">
                <li>Podmínkou využití funkce ukládání dat je bezplatná registrace Uživatele.</li>
                <li>Uživatel je povinen uvádět při registraci a v profilech pouze pravdivé údaje.</li>
                <li>Uživatel je povinen zabezpečit své přístupové údaje (heslo) před zneužitím třetími osobami. Provozovatel nenese odpovědnost za škody vzniklé v důsledku vyzrazení hesla vinou Uživatele.</li>
                <li>Provozovatel si vyhrazuje právo zrušit účet Uživateli, který porušuje tyto VOP nebo právní předpisy ČR.</li>
                </ol>


                <h2 className="text-2xl font-semibold mt-8 mb-4">III. ODPOVĚDNOST ZA OBSAH A SLUŽBY</h2>
                <ol className="list-decimal pl-6 mb-6 space-y-2">
                <li><strong>Vyloučení záruk (AS-IS): </strong> Služba je poskytována ve stavu „jak stojí a leží“. Provozovatel neposkytuje žádné záruky ohledně funkčnosti, dostupnosti, či bezchybnosti Aplikace.</li>
                <li><strong>Omezení odpovědnosti za škodu: </strong> V maximálním rozsahu povoleném platnými právními předpisy nenese Provozovatel odpovědnost za jakékoli přímé, nepřímé či následné škody vzniklé v souvislosti s užíváním Aplikace, zejména za: </li>
                    <ul className="list-disc pl-6 mb-6 space-y-2">
                        <li><strong>Ztrátu dat: </strong> Uživatel bere na vědomí, že data nejsou zálohována způsobem garantujícím jejich trvalou obnovitelnost. Doporučuje se Uživateli uchovávat si lokální kopie vygenerovaných PDF. </li>
                        <li><strong>Obsahová správnost: </strong> Provozovatel neodpovídá za chyby ve vygenerovaném PDF souboru (formátování, překlepy), které by mohly vést k neúspěchu ve výběrovém řízení.</li>
                        <li><strong>Výpadky služby: </strong> Provozovatel nenese odpovědnost za krátkodobou či trvalou nedostupnost služby z důvodu údržby, technických problémů nebo jiných nepředvídatelných událostí.</li>
                    </ul>
                <li><strong>Odpovědnost Uživatele: </strong> Uživatel je odpovědný za obsah, který do Aplikace vkládá, včetně osobních údajů, informací o vzdělání, pracovních zkušenostech a dalších údajů obsažených v životopisech. Je přísně zakázáno vkládat obsah, který je protiprávní, vulgární, hanlivý nebo porušuje autorská práva či práva třetích osob.</li>    
                </ol>
                

                <h2 className="text-2xl font-semibold mt-8 mb-4">IV. AUTORSKÁ PRÁVA</h2>
                <ol className="list-decimal pl-6 mb-6 space-y-2">
                    <li>Zdrojový kód Aplikace, grafické prvky rozhraní a design šablon jsou autorským dílem Provozovatele a jsou chráněny autorským zákonem.</li>
                    <li>Uživatel má právo používat vygenerované PDF dokumenty (životopisy) pro osobní potřebu (hledání zaměstnání) bez omezení.</li>
                </ol>

                <h2 className="text-2xl font-semibold mt-8 mb-4">V. ZÁVĚREČNÁ USTANOVENÍ</h2>
                <ol className="list-decimal pl-6 mb-6 space-y-2">
                    <li>Právní vztahy vzniklé z užívání Aplikace se řídí právním řádem České republiky.</li>
                    <li>Zpracování osobních údajů se řídí samostatným dokumentem „Zásady zpracování osobních údajů“, se kterým Uživatel vyslovuje souhlas při registraci.</li>
                    <li>Uživatel má možnost kdykoli ukončit užívání služby a smazat svůj účet v sekci Nastavení.</li>
                </ol>

                <div className="mt-12 pt-8 border-t">
                <Link href="/" className="text-blue-600 hover:underline">
                    &larr; Zpět na úvodní stranu
                </Link>
                </div>
            </div>
        </div>
    );
}