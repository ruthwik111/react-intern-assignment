import React from "react";
import Toolbar from "./components/Toolbar";
import Spreadsheet from "./components/Spreadsheet";

const App = () => {
  return (
    <div className="h-screen w-screen bg-white text-gray-900">
      <Toolbar />
      <div className="p-4">
        <Spreadsheet />
      </div>
    </div>
  );
};

export default App;
