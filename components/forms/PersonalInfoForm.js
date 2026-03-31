"use client"

import { DatePicker } from "@/components/ui/date-picker"
import { isoToDate, dateToISO } from "@/lib/utils"
import dialCodes from "@/lib/dialCodes"
import { DEFAULT_CV_DATA } from "@/lib/constants"

function parsePhone(phone) {
  if (!phone) return { prefix: "", localNumber: "" };
  if (phone.startsWith("+")) {
    const spaceIdx = phone.indexOf(" ");
    if (spaceIdx !== -1) {
      return { prefix: phone.slice(0, spaceIdx), localNumber: phone.slice(spaceIdx + 1) };
    }
    return { prefix: phone, localNumber: "" };
  }
  return { prefix: "+420", localNumber: phone };
}

export default function PersonalInfoForm({ data, onUpdate }) {
  const handleDateChange = (date) => {
    const isoDate = date ? dateToISO(date) : "";
    onUpdate("personal", "dateOfBirth", isoDate);
  };

  const { prefix, localNumber } = parsePhone(data.phone);
  const isCustomPrefix = prefix !== "" && !dialCodes.some(d => d.code === prefix);
  const selectValue = prefix === "" ? "none" : isCustomPrefix ? "custom" : prefix;

  const handlePrefixSelect = (e) => {
    const val = e.target.value;
    if (val === "none") {
      onUpdate("personal", "phone", "");
    } else if (val === "custom") {
      onUpdate("personal", "phone", "+ " + localNumber);
    } else {
      onUpdate("personal", "phone", val + " " + localNumber);
    }
  };

  const handleCustomPrefix = (e) => {
    let val = e.target.value.replace(/[^\d+]/g, "");
    if (val && !val.startsWith("+")) val = "+" + val;
    onUpdate("personal", "phone", val + " " + localNumber);
  };

  const handleLocalNumber = (e) => {
    const digits = e.target.value.replace(/[^\d ]/g, "");
    if (prefix) {
      onUpdate("personal", "phone", prefix + " " + digits);
    } else {
      onUpdate("personal", "phone", digits);
    }
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
          placeholder={DEFAULT_CV_DATA.personal.name}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1.5">Profesní titul</label>
        <input 
          type="text" 
          className="w-full p-2 border-2 rounded bg-sidebar-accent text-sidebar-accent-foreground focus:border-sidebar-ring focus:outline-none transition-all"
          value={data.title}
          onChange={(e) => onUpdate("personal", "title", e.target.value)}
          placeholder={DEFAULT_CV_DATA.personal.title}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1.5">Email</label>
        <input 
          type="email" 
          className="w-full p-2 border-2 rounded bg-sidebar-accent text-sidebar-accent-foreground focus:border-sidebar-ring focus:outline-none transition-all"
          value={data.email}
          onChange={(e) => onUpdate("personal", "email", e.target.value)}
          placeholder={DEFAULT_CV_DATA.personal.email}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1.5">Telefon</label>
        <div className="space-y-2">
          <select
            value={selectValue}
            onChange={handlePrefixSelect}
            className="w-full p-2 border-2 rounded bg-sidebar-accent text-sidebar-accent-foreground focus:border-sidebar-ring focus:outline-none transition-all text-sm"
          >
            <option value="none">— Bez předvolby —</option>
            {dialCodes.map((d) => (
              <option key={d.label} value={d.code}>{d.label}</option>
            ))}
            <option value="custom">Vlastní (+???)</option>
          </select>
          {isCustomPrefix && (
            <input
              type="text"
              value={prefix}
              onChange={handleCustomPrefix}
              placeholder="+000"
              maxLength={6}
              className="w-full p-2 border-2 rounded bg-sidebar-accent text-sidebar-accent-foreground focus:border-sidebar-ring focus:outline-none transition-all text-sm"
            />
          )}
          <input
            type="tel"
            value={localNumber}
            onChange={handleLocalNumber}
            placeholder="123 456 789"
            className="w-full p-2 border-2 rounded bg-sidebar-accent text-sidebar-accent-foreground focus:border-sidebar-ring focus:outline-none transition-all"
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">Formát: +420 123 456 789</p>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1.5">Adresa</label>
        <input 
          type="text" 
          className="w-full p-2 border-2 rounded bg-sidebar-accent text-sidebar-accent-foreground focus:border-sidebar-ring focus:outline-none transition-all"
          value={data.address}
          onChange={(e) => onUpdate("personal", "address", e.target.value)}
          placeholder={DEFAULT_CV_DATA.personal.address}
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
