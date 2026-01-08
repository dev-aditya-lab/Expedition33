export default function DataTable({ columns, data, onRowClick }) {
    return (
        <div className="overflow-x-auto rounded-xl">
            <table className="w-full border-collapse">
                <thead>
                    <tr>
                        {columns.map((col, index) => (
                            <th
                                key={index}
                                className="py-3 px-3 sm:px-4 text-left bg-white/5 font-semibold text-[11px] sm:text-xs uppercase tracking-wide text-gray-400 border-b border-white/10 whitespace-nowrap"
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr
                            key={row.id || rowIndex}
                            className="cursor-pointer transition-all hover:bg-violet-500/5"
                            onClick={() => onRowClick && onRowClick(row)}
                        >
                            {columns.map((col, colIndex) => (
                                <td
                                    key={colIndex}
                                    className="py-3 px-3 sm:px-4 border-b border-white/5 text-xs sm:text-sm text-gray-200"
                                >
                                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
