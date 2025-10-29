import React, { useEffect, useState } from 'react';
import { useData } from '../state/DataContext';
import { Link } from 'react-router-dom';

function Items() {
  const { items, total, page, pageSize, fetchItems } = useData();
  const [q, setQ] = useState('');

  // init load
  useEffect(() => {
    const controller = new AbortController();
    fetchItems({ q, page: 1, pageSize, signal: controller.signal }).catch((err) => {
      if (err?.name !== 'AbortError') console.error(err);
    });
    return () => controller.abort();
  }, []); 

  useEffect(() => {
    const controller = new AbortController();
    const t = setTimeout(() => {
      fetchItems({ q, page: 1, pageSize, signal: controller.signal }).catch((err) => {
        if (err?.name !== 'AbortError') console.error(err);
      });
    }, 300);
    return () => {
      controller.abort();
      clearTimeout(t);
    };
  }, [q, pageSize, fetchItems]);

  const maxPage = Math.max(1, Math.ceil(total / pageSize));
  const goPrev = () => {
    if (page > 1) fetchItems({ q, page: page - 1, pageSize });
  };
  const goNext = () => {
    if (page < maxPage) fetchItems({ q, page: page + 1, pageSize });
  };

  if (!items.length && !q) return <p>Loading...</p>;

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name…"
          style={{ padding: 8, flex: 1 }}
        />
        <span>
          Page {page} / {maxPage} (total {total})
        </span>
        <button onClick={goPrev} disabled={page <= 1}>
          Prev
        </button>
        <button onClick={goNext} disabled={page >= maxPage}>
          Next
        </button>
      </div>

      {items.length === 0 ? (
        <p>No items found.</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              <Link to={'/items/' + item.id}>{item.name}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Items;
