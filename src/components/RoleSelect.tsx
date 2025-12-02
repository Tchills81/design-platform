import React from "react";
import { useSeasonalTone } from "../themes/useSeasonalTone";



type RoleSelectProps = {
  value: "background" | "element";
  onChange: (value: "background" | "element") => void;
  label?: string;
  className?: string;
};

const RoleSelect: React.FC<RoleSelectProps> = ({
  value,
  onChange,
  label = "Role",
  className = "",
}) => {


   
    
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}:</label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as "background" | "element")}
        className="border rounded px-2 py-1 text-sm bg-transparent focus:not-only:not-[]:"
      >
        <option value="background">Background</option>
        <option value="element">Element</option>
      </select>
    </div>
  );
};

export default RoleSelect;
