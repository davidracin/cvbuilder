"use client"

import { DatePicker } from "@/components/ui/date-picker"
import { isoToDate, dateToISO } from "@/lib/utils"

export default function PersonalInfoForm({ data, onUpdate }) {
  const handleDateChange = (date) => {
    const isoDate = date ? dateToISO(date) : "";
    onUpdate("personal", "dateOfBirth", isoDate);
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium mb-1.5">Jméno</label>
        <input 
          type="text" 
          className="w-full p-2 border-2 rounded bg-sidebar-accent text-sidebar-accent-foreground focus:border-sidebar-ring focus:outline-none transition-all"
          value={data.name}
          onChange={(e) => onUpdate("personal", "name", e.target.value)}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1.5">Profesní titul</label>
        <input 
          type="text" 
          className="w-full p-2 border-2 rounded bg-sidebar-accent text-sidebar-accent-foreground focus:border-sidebar-ring focus:outline-none transition-all"
          value={data.title}
          onChange={(e) => onUpdate("personal", "title", e.target.value)}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1.5">Email</label>
        <input 
          type="email" 
          className="w-full p-2 border-2 rounded bg-sidebar-accent text-sidebar-accent-foreground focus:border-sidebar-ring focus:outline-none transition-all"
          value={data.email}
          onChange={(e) => onUpdate("personal", "email", e.target.value)}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1.5">Telefon</label>
        <input 
          type="text" 
          className="w-full p-2 border-2 rounded bg-sidebar-accent text-sidebar-accent-foreground focus:border-sidebar-ring focus:outline-none transition-all"
          value={data.phone}
          onChange={(e) => onUpdate("personal", "phone", e.target.value)}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1.5">Adresa</label>
        <input 
          type="text" 
          className="w-full p-2 border-2 rounded bg-sidebar-accent text-sidebar-accent-foreground focus:border-sidebar-ring focus:outline-none transition-all"
          value={data.address}
          onChange={(e) => onUpdate("personal", "address", e.target.value)}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1.5">O mně</label>
        <textarea 
          className="w-full p-2 border-2 rounded bg-sidebar-accent text-sidebar-accent-foreground focus:border-sidebar-ring focus:outline-none transition-all min-h-[100px] resize-y"
          value={data.about}
          onChange={(e) => onUpdate("personal", "about", e.target.value)}
          placeholder="Napište krátké představení o sobě..."
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1.5">Datum narození</label>
        <DatePicker
          date={isoToDate(data.dateOfBirth)}
          onDateChange={handleDateChange}
          placeholder="Vyberte datum narození"
        />
      </div>
    </div>
  );
}
