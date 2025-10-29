import React, { useEffect } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DataProvider, useData } from './DataContext';

describe('DataContext fetchItems', () => {
  const mockPayload = {
    items: [{ id: 1, name: 'Alpha' }, { id: 2, name: 'Beta' }],
    total: 2,
    page: 1,
    pageSize: 20,
  };

  beforeEach(() => {
    global.fetch = jest.fn(async () => ({
      ok: true,
      status: 200,
      json: async () => mockPayload,
    }));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  function Probe() {
    const { items, total, fetchItems } = useData();

    useEffect(() => {
      fetchItems({ q: '', page: 1, pageSize: 20 });
    }, [fetchItems]);

    return (
      <div>
        <div data-testid="count">{items.length}</div>
        <div data-testid="total">{total}</div>
      </div>
    );
  }

  test('loads items and updates state', async () => {
    render(
      <DataProvider>
        <Probe />
      </DataProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('count')).toHaveTextContent('2');
      expect(screen.getByTestId('total')).toHaveTextContent('2');
    });
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch.mock.calls[0][0]).toMatch('/api/items');
  });
});
