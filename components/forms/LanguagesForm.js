export default function LanguagesForm({ items, onUpdate, onAdd, onRemove }) {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2 border-b border-sidebar-border pb-1">
        <h2 className="text-lg font-semibold">Jazyky</h2>
        <button 
          className="px-2 py-1 bg-sidebar-primary text-sidebar-primary-foreground rounded text-sm"
          onClick={() => onAdd("languages")}
        >
          Přidat
        </button>
      </div>
      
      {items.map((language) => (
        <div key={language.id} className="mb-3 p-3 border border-sidebar-border rounded">
          <div className="flex justify-between gap-2 mb-2">
            <div className="flex-1">
              <input 
                type="text" 
                className="w-full p-2 border rounded bg-sidebar-accent text-sidebar-accent-foreground"
                value={language.name}
                onChange={(e) => onUpdate("languages", "name", e.target.value, language.id)}
                placeholder="Název jazyka"
              />
            </div>
            <div className="flex-1">
              <input 
                type="text" 
                className="w-full p-2 border rounded bg-sidebar-accent text-sidebar-accent-foreground"
                value={language.level}
                onChange={(e) => onUpdate("languages", "level", e.target.value, language.id)}
                placeholder="Úroveň"
              />
            </div>
            <button 
              className="text-destructive text-sm"
              onClick={() => onRemove("languages", language.id)}
            >
              X
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
