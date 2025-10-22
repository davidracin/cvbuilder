export default function ExperienceForm({ items, onUpdate, onAdd, onRemove }) {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2 border-b border-sidebar-border pb-1">
        <h2 className="text-lg font-semibold">Pracovní zkušenosti</h2>
        <button 
          className="px-2 py-1 bg-sidebar-primary text-sidebar-primary-foreground rounded text-sm"
          onClick={() => onAdd("experience")}
        >
          Přidat
        </button>
      </div>
      
      {items.map((exp) => (
        <div key={exp.id} className="mb-4 p-3 border border-sidebar-border rounded">
          <div className="flex justify-between mb-2">
            <h3 className="font-medium">Zkušenost #{exp.id}</h3>
            <button 
              className="text-destructive text-sm"
              onClick={() => onRemove("experience", exp.id)}
            >
              Odstranit
            </button>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Pozice</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded bg-sidebar-accent text-sidebar-accent-foreground"
                value={exp.title}
                onChange={(e) => onUpdate("experience", "title", e.target.value, exp.id)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Společnost</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded bg-sidebar-accent text-sidebar-accent-foreground"
                value={exp.company}
                onChange={(e) => onUpdate("experience", "company", e.target.value, exp.id)}
              />
            </div>
            
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Od</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded bg-sidebar-accent text-sidebar-accent-foreground"
                  value={exp.startDate}
                  onChange={(e) => onUpdate("experience", "startDate", e.target.value, exp.id)}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Do</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded bg-sidebar-accent text-sidebar-accent-foreground"
                  value={exp.endDate}
                  onChange={(e) => onUpdate("experience", "endDate", e.target.value, exp.id)}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Popis</label>
              <textarea 
                className="w-full p-2 border rounded bg-sidebar-accent text-sidebar-accent-foreground min-h-[80px]"
                value={exp.description}
                onChange={(e) => onUpdate("experience", "description", e.target.value, exp.id)}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
