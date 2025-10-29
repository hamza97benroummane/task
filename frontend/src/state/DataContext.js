import { createContext, useCallback, useContext, useState } from 'react';

const DataContext = createContext();



export function DataProvider({ children }) {
  const [items, setItems] = useState([]);

  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const fetchItems = useCallback(async ({ q = '', page = 1, pageSize = 20, signal } = {}) => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    params.set('page', String(page));
    params.set('pageSize', String(pageSize));
    const res = await fetch(`/api/items?${params.toString()}`, { signal });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`API ${res.status} – ${text.slice(0, 200)}`);
    }
    const json = await res.json();
    setItems(json.items || []);
    setTotal(json.total ?? 0);
    setPage(json.page ?? 1);
    setPageSize(json.pageSize ?? pageSize);
  }, []);

  return (
    <DataContext.Provider value={{ items, total, page, pageSize, fetchItems }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);