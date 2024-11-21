export const getPagesToShow = (currentPage, totalPages) => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
  
    if (currentPage <= 3) {
      const maxPage = Math.min(5, totalPages);
      return Array.from({ length: maxPage }, (_, i) => i + 1);
    }
  
    if (currentPage >= totalPages - 2) {
      const startPage = totalPages - 4 > 0 ? totalPages - 4 : 1;
      return Array.from({ length: 5 }, (_, i) => startPage + i);
    }
  
    return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
  };
