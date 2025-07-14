import React, { useState, useEffect, useRef } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

const defaultData = [
  { name: "John Doe", age: 28, email: "john@example.com" },
  { name: "Jane Smith", age: 34, email: "jane@example.com" },
  { name: "Alice Brown", age: 25, email: "alice@example.com" },
];

const Spreadsheet = () => {
  const [data, setData] = useState([...defaultData]);
  const [editingCell, setEditingCell] = useState(null);
  const [columnVisibility, setColumnVisibility] = useState({
    name: true,
    age: true,
    email: true,
  });

  const columns = [
    {
      accessorKey: "name",
      header: "Name",
      enableResizing: true,
      size: 200,
      minSize: 100,
      maxSize: 400,
      cell: ({ getValue, row }) =>
        isEditing(row.index, "name") ? (
          <input
            type="text"
            value={getValue()}
            onChange={(e) => updateCell(row.index, "name", e.target.value)}
            onBlur={() => setEditingCell(null)}
            className="w-full px-2 py-1 border border-gray-300"
            autoFocus
          />
        ) : (
          <div
            className="cursor-pointer px-2"
            onClick={() => setEditingCell({ row: row.index, column: "name" })}
          >
            {getValue()}
          </div>
        ),
    },
    {
      accessorKey: "age",
      header: "Age",
      enableResizing: true,
      size: 100,
      minSize: 60,
      maxSize: 200,
      cell: ({ getValue, row }) =>
        isEditing(row.index, "age") ? (
          <input
            type="number"
            value={getValue()}
            onChange={(e) => updateCell(row.index, "age", parseInt(e.target.value) || 0)}
            onBlur={() => setEditingCell(null)}
            className="w-full px-2 py-1 border border-gray-300"
            autoFocus
          />
        ) : (
          <div
            className="cursor-pointer px-2"
            onClick={() => setEditingCell({ row: row.index, column: "age" })}
          >
            {getValue()}
          </div>
        ),
    },
    {
      accessorKey: "email",
      header: "Email",
      enableResizing: true,
      size: 300,
      minSize: 150,
      maxSize: 600,
      cell: ({ getValue, row }) =>
        isEditing(row.index, "email") ? (
          <input
            type="email"
            value={getValue()}
            onChange={(e) => updateCell(row.index, "email", e.target.value)}
            onBlur={() => setEditingCell(null)}
            className="w-full px-2 py-1 border border-gray-300"
            autoFocus
          />
        ) : (
          <div
            className="cursor-pointer px-2"
            onClick={() => setEditingCell({ row: row.index, column: "email" })}
          >
            {getValue()}
          </div>
        ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: "onChange",
    state: {
      columnVisibility,
    },
    onColumnVisibilityChange: setColumnVisibility,
  });

  function updateCell(rowIndex, column, value) {
    const updated = [...data];
    updated[rowIndex][column] = value;
    setData(updated);
  }

  function isEditing(row, column) {
    return editingCell?.row === row && editingCell?.column === column;
  }

  const tableRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (!editingCell) return;
      const { row, column } = editingCell;
      const colOrder = ["name", "age", "email"];
      const currentIndex = colOrder.indexOf(column);
      let nextRow = row;
      let nextCol = column;

      if (e.key === "ArrowDown" && row < data.length - 1) nextRow++;
      else if (e.key === "ArrowUp" && row > 0) nextRow--;
      else if (e.key === "ArrowRight" && currentIndex < colOrder.length - 1)
        nextCol = colOrder[currentIndex + 1];
      else if (e.key === "ArrowLeft" && currentIndex > 0)
        nextCol = colOrder[currentIndex - 1];
      else return;

      e.preventDefault();
      setEditingCell({ row: nextRow, column: nextCol });
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [editingCell, data]);

  return (
    <div className="space-y-4">
      {/* Column Toggle Controls */}
      <div className="flex gap-4 px-2">
        {["name", "age", "email"].map((key) => (
          <label key={key} className="flex items-center gap-1 text-sm">
            <input
              type="checkbox"
              checked={columnVisibility[key]}
              onChange={(e) =>
                setColumnVisibility((prev) => ({
                  ...prev,
                  [key]: e.target.checked,
                }))
              }
            />
            Show {key.charAt(0).toUpperCase() + key.slice(1)}
          </label>
        ))}
      </div>

      {/* Table */}
      <div
        ref={tableRef}
        className="overflow-auto border border-gray-300 rounded text-sm"
      >
        <table className="w-full border-collapse">
          <thead className="bg-gray-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    style={{ width: header.getSize() }}
                    className="border px-4 py-2 text-left font-medium text-gray-700 relative"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}

                    {/* Resizer */}
                    {header.column.getCanResize() && (
                      <div
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        className="absolute right-0 top-0 h-full w-1 cursor-col-resize bg-gray-400 select-none"
                      />
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-100">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="border px-4 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Spreadsheet;
