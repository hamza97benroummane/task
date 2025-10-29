import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { DataProvider } from '../state/DataContext';
import Items from './Items';

describe('Items page', () => {
  beforeEach(() => {
    const payload = {
      items: Array.from({ length: 3 }, (_, i) => ({ id: i + 1, name: `Item ${i + 1}` })),
      total: 3,
      page: 1,
      pageSize: 20,
    };
    global.fetch = jest.fn(async () => ({
      ok: true,
      status: 200,
      json: async () => payload,
    }));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('shows Loading then renders fetched items', async () => {
    render(
      <MemoryRouter>
        <DataProvider>
          <Items />
        </DataProvider>
      </MemoryRouter>
    );

    // initial state
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();

    // items appear after fetch resolves
    await waitFor(() => {
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.getByText('Item 3')).toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});
