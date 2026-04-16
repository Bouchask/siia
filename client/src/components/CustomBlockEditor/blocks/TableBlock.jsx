import React from 'react';
import { useEditor } from '../EditorContext';
import { Plus, Minus } from 'lucide-react';

const TableBlock = ({ block }) => {
  const { updateBlock } = useEditor();
  const data = block.data || [['', ''], ['', '']];

  const updateCell = (rowIndex, colIndex, html) => {
    const newData = data.map((row, rIdx) => 
      rIdx === rowIndex ? row.map((cell, cIdx) => cIdx === colIndex ? html : cell) : row
    );
    updateBlock(block.id, { data: newData });
  };

  const addRow = () => {
    const cols = data[0]?.length || 2;
    updateBlock(block.id, { data: [...data, Array(cols).fill('')] });
  };

  const removeRow = () => {
    if (data.length <= 1) return;
    updateBlock(block.id, { data: data.slice(0, -1) });
  };

  const addColumn = () => {
    updateBlock(block.id, { data: data.map(row => [...row, '']) });
  };

  const removeColumn = () => {
    if (data[0]?.length <= 1) return;
    updateBlock(block.id, { data: data.map(row => row.slice(0, -1)) });
  };

  return (
    <div style={{ margin: '10px 0' }}>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        <button onClick={addRow} className="btn-table"><Plus size={14}/> Row</button>
        <button onClick={removeRow} className="btn-table"><Minus size={14}/> Row</button>
        <button onClick={addColumn} className="btn-table"><Plus size={14}/> Col</button>
        <button onClick={removeColumn} className="btn-table"><Minus size={14}/> Col</button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #cbd5e1' }}>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => (
                <td key={colIndex} style={{ border: '1px solid #cbd5e1', padding: '8px' }}>
                  <div
                    contentEditable
                    onBlur={(e) => updateCell(rowIndex, colIndex, e.currentTarget.innerHTML)}
                    onInput={(e) => updateCell(rowIndex, colIndex, e.currentTarget.innerHTML)}
                    style={{ outline: 'none', minHeight: '20px' }}
                    dangerouslySetInnerHTML={{ __html: cell }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <style>{`
        .btn-table {
          display: flex;
          align-items: center;
          gap: 4px;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 700;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-table:hover {
          background: #e2e8f0;
          color: #1e293b;
        }
      `}</style>
    </div>
  );
};

export default TableBlock;