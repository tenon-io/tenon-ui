import React from 'react';
import {
    DataTableNestingContext,
    DataTableRowContext,
    parentType
} from './DataTableContexts';

export const Th = ({ children, property, ...props }) => (
    <DataTableNestingContext.Consumer>
        {parent => {
            if (parent === parentType.thead) {
                return (
                    <th {...props} scope="col">
                        {typeof children === 'function' ? children() : children}
                    </th>
                );
            }
            if (parent === parentType.tbody) {
                return (
                    <DataTableRowContext.Consumer>
                        {row => (
                            <th scope="row" {...props}>
                                {typeof children === 'function'
                                    ? children(row[property], row)
                                    : row[property]}
                            </th>
                        )}
                    </DataTableRowContext.Consumer>
                );
            }
        }}
    </DataTableNestingContext.Consumer>
);

export default Th;
