import React from 'react';
import './VisibilitySettings.css'

function SectionSetting({
  sectionName,
  selected,
  onChange,
}) {
  return (
    <label className="section-setting">
      {sectionName}
      <input
        id={`${sectionName}-is-visible-checkbox`}
        type="checkbox"
        checked={selected}
        onChange={(e) => onChange(sectionName, e.target.checked)}
      />
    </label>
  );
}

export default function VisibilitySettings({
  sectionsShown,
  onChange,
}) {
  return (
    <div className="visibility-settings">
      {Object.entries(sectionsShown).map(([sectionName, selected]) => (
        <SectionSetting
          key={sectionName}
          sectionName={sectionName}
          selected={selected}
          onChange={(sectionName, checked) => onChange({
            ...sectionsShown,
            [sectionName]: checked,
          })}
        />
      ))}
    </div>
  );
}
