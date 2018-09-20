import React, { Children, cloneElement, Component } from 'react';
import {
    DataTableContext,
    DataTableNestingContext,
    DataTableRowContext,
    parentType
} from './DataTableContexts';

class TBody extends Component {
    render() {
        const { children } = this.props;
        return (
            <DataTableNestingContext.Provider value={parentType.tbody}>
                <tbody>
                    <DataTableContext.Consumer>
                        {data =>
                            data.map((row, i) => (
                                <DataTableRowContext.Provider
                                    key={i}
                                    value={row}
                                >
                                    <tr>
                                        {Children.map(children, (child, i) =>
                                            cloneElement(child, {
                                                key: i
                                            })
                                        )}
                                    </tr>
                                </DataTableRowContext.Provider>
                            ))
                        }
                    </DataTableContext.Consumer>
                </tbody>
            </DataTableNestingContext.Provider>
        );
    }
}

export default TBody;
