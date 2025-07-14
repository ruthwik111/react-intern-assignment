import React from "react";

const Toolbar = () => {
  const tabs = ["File", "Edit", "View", "Insert", "Format", "Data", "Tools", "Help"];

  return (
    <div className="w-full bg-gray-100 border-b px-4 py-2 flex gap-2 shadow-sm">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => console.log(`${tab} clicked`)}
          className="text-sm px-4 py-1 bg-gray-800 text-white border border-gray-700 rounded hover:bg-gray-700 transition"
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default Toolbar;
