export default function PersonalInfoForm({ data, onUpdate }) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2 border-b border-sidebar-border pb-1">
        Osobní údaje
      </h2>
      
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">Jméno</label>
          <input 
            type="text" 
            className="w-full p-2 border rounded bg-sidebar-accent text-sidebar-accent-foreground"
            value={data.name}
            onChange={(e) => onUpdate("personal", "name", e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Profesní titul</label>
          <input 
            type="text" 
            className="w-full p-2 border rounded bg-sidebar-accent text-sidebar-accent-foreground"
            value={data.title}
            onChange={(e) => onUpdate("personal", "title", e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input 
            type="email" 
            className="w-full p-2 border rounded bg-sidebar-accent text-sidebar-accent-foreground"
            value={data.email}
            onChange={(e) => onUpdate("personal", "email", e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Telefon</label>
          <input 
            type="text" 
            className="w-full p-2 border rounded bg-sidebar-accent text-sidebar-accent-foreground"
            value={data.phone}
            onChange={(e) => onUpdate("personal", "phone", e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Adresa</label>
          <input 
            type="text" 
            className="w-full p-2 border rounded bg-sidebar-accent text-sidebar-accent-foreground"
            value={data.address}
            onChange={(e) => onUpdate("personal", "address", e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">O mně</label>
          <textarea 
            className="w-full p-2 border rounded bg-sidebar-accent text-sidebar-accent-foreground min-h-[100px]"
            value={data.about}
            onChange={(e) => onUpdate("personal", "about", e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Datum narození</label>
          <input 
            type="text" 
            className="w-full p-2 border rounded bg-sidebar-accent text-sidebar-accent-foreground"
            value={data.dateOfBirth}
            onChange={(e) => onUpdate("personal", "dateOfBirth", e.target.value)}
            placeholder="DD.MM.YYYY"
          />
        </div>
      </div>
    </div>
  );
}
