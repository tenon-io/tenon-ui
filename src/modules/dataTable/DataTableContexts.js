import { createContext } from 'react';

export const parentType = {
    tbody: 'tbody',
    thead: 'thead'
};

export const DataTableContext = createContext();
export const DataTableNestingContext = createContext();
export const DataTableRowContext = createContext();
