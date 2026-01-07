export default function DataTable({ columns, data, onRowClick }) {
    return (
        <div style={styles.container}>
            <table style={styles.table}>
                <thead>
                    <tr>
                        {columns.map((col, index) => (
                            <th key={index} style={styles.th}>{col.header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr
                            key={row.id || rowIndex}
                            style={styles.tr}
                            onClick={() => onRowClick && onRowClick(row)}
                        >
                            {columns.map((col, colIndex) => (
                                <td key={colIndex} style={styles.td}>
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

const styles = {
    container: {
        overflowX: 'auto',
        borderRadius: '12px',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    th: {
        padding: '14px 16px',
        textAlign: 'left',
        background: 'rgba(255, 255, 255, 0.03)',
        fontWeight: '600',
        fontSize: '12px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        color: 'rgba(240, 240, 245, 0.6)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    },
    tr: {
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
    td: {
        padding: '14px 16px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        fontSize: '14px',
        color: 'rgba(240, 240, 245, 0.9)',
    },
};
