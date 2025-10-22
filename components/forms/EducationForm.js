export default function EducationForm({ items, onUpdate, onAdd, onRemove }) {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2 border-b border-sidebar-border pb-1">
        <h2 className="text-lg font-semibold">Vzdělání</h2>
        <button 
          className="px-2 py-1 bg-sidebar-primary text-sidebar-primary-foreground rounded text-sm"
          onClick={() => onAdd("education")}
        >
          Přidat
        </button>
      </div>
      
      {items.map((edu) => (
        <div key={edu.id} className="mb-4 p-3 border border-sidebar-border rounded">
          <div className="flex justify-between mb-2">
            <h3 className="font-medium">Vzdělání #{edu.id}</h3>
            <button 
              className="text-destructive text-sm"
              onClick={() => onRemove("education", edu.id)}
            >
              Odstranit
            </button>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Titul/Stupeň</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded bg-sidebar-accent text-sidebar-accent-foreground"
                value={edu.degree}
                onChange={(e) => onUpdate("education", "degree", e.target.value, edu.id)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Škola</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded bg-sidebar-accent text-sidebar-accent-foreground"
                value={edu.school}
                onChange={(e) => onUpdate("education", "school", e.target.value, edu.id)}
              />
            </div>
            
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Od</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded bg-sidebar-accent text-sidebar-accent-foreground"
                  value={edu.startDate}
                  onChange={(e) => onUpdate("education", "startDate", e.target.value, edu.id)}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Do</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded bg-sidebar-accent text-sidebar-accent-foreground"
                  value={edu.endDate}
                  onChange={(e) => onUpdate("education", "endDate", e.target.value, edu.id)}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Popis</label>
              <textarea 
                className="w-full p-2 border rounded bg-sidebar-accent text-sidebar-accent-foreground min-h-[80px]"
                value={edu.description}
                onChange={(e) => onUpdate("education", "description", e.target.value, edu.id)}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
