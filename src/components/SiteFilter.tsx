import React from "react";

type Site = {
  id: string;
  name: string;
};

interface SiteFilterProps {
  sites: Site[];
  selectedSiteIds: string[];
  onChange: (siteIds: string[]) => void;
}

const SiteFilter: React.FC<SiteFilterProps> = ({
  sites,
  selectedSiteIds,
  onChange,
}) => {
  const toggleSite = (id: string) => {
    const updated = selectedSiteIds.includes(id)
      ? selectedSiteIds.filter((siteId) => siteId !== id)
      : [...selectedSiteIds, id];

    onChange(updated);
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {sites.map((site) => (
        <label
          key={site.id}
          className={`cursor-pointer px-3 py-1 rounded border ${
            selectedSiteIds.includes(site.id)
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-gray-100 text-gray-700 border-gray-300"
          }`}
        >
          <input
            type="checkbox"
            checked={selectedSiteIds.includes(site.id)}
            onChange={() => toggleSite(site.id)}
            className="mr-2"
          />
          {site.name}
        </label>
      ))}
    </div>
  );
};

export default SiteFilter;
