export const  handleSort = ({ column, state, setState }) => {
    let updatedColumns = [...state];
    const existingColumn = updatedColumns.find((item) => item.column === column);
  
    if (existingColumn) {
      existingColumn.order = existingColumn.order === 'asc' ? 'desc' : 'asc';
    } else {
      updatedColumns.push({ column, order: 'asc' });
    }
  
    setState(updatedColumns);
  }
  


 export const getSortSymbol =({column,state}) => {
    const columnInfo = state.find((item) => item.column === column);
    return columnInfo ? (columnInfo.order === 'asc' ? '↑' : '↓') : '';
  }