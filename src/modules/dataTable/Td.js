import React from 'react';
import { DataTableRowContext } from './DataTableContexts';

export const Td = ({ property, children, ...props }) => (
    <DataTableRowContext.Consumer>
        {row => (
            <td {...props}>
                {typeof children === 'function'
                    ? children(row[property], row)
                    : row[property]}
            </td>
        )}
    </DataTableRowContext.Consumer>
);

export default Td;
