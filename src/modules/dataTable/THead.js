import React from 'react';
import { DataTableNestingContext, parentType } from './DataTableContexts';

export const THead = ({ children }) => (
    <DataTableNestingContext.Provider value={parentType.thead}>
        <thead>
            {typeof children === 'function' ? children() : <tr>{children}</tr>}
        </thead>
    </DataTableNestingContext.Provider>
);

export default THead;
