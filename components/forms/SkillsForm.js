export default function SkillsForm({ items, onUpdate, onAdd, onRemove }) {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2 border-b border-sidebar-border pb-1">
        <h2 className="text-lg font-semibold">Dovednosti</h2>
        <button 
          className="px-2 py-1 bg-sidebar-primary text-sidebar-primary-foreground rounded text-sm"
          onClick={() => onAdd("skills")}
        >
          Přidat
        </button>
      </div>
      
      {items.map((skill) => (
        <div key={skill.id} className="mb-3 p-3 border border-sidebar-border rounded">
          <div className="flex justify-between mb-2">
            <div className="flex-1">
              <input 
                type="text" 
                className="w-full p-2 border rounded bg-sidebar-accent text-sidebar-accent-foreground"
                value={skill.name}
                onChange={(e) => onUpdate("skills", "name", e.target.value, skill.id)}
                placeholder="Název dovednosti"
              />
            </div>
            <button 
              className="ml-2 text-destructive text-sm"
              onClick={() => onRemove("skills", skill.id)}
            >
              X
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
