import React, { Component } from 'react';
import { DataTableContext } from './DataTableContexts';

import TBody from './TBody';
import THead from './THead';
import Td from './Td';
import Th from './Th';

class DataTable extends Component {
    static TBody = TBody;
    static THead = THead;
    static Td = Td;
    static Th = Th;

    render() {
        return (
            <DataTableContext.Provider value={this.props.data}>
                <table>{this.props.children}</table>
            </DataTableContext.Provider>
        );
    }
}

// class DataTable extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             tabIndex: null
//         };
//
//         this.tableContainer = createRef();
//     }
//     componentDidMount() {
//         let scrollable =
//             this.tableContainer.current.scrollWidth >
//             this.tableContainer.current.clientWidth;
//         this.setState({
//             tabIndex: scrollable ? '0' : null
//         });
//     }
//     render() {
//         return (
//             <div
//                 className="table-container"
//                 ref={this.tableContainer}
//                 tabIndex={this.state.tabIndex}
//             >
//                 <table>
//                     <thead>
//                         <tr>
//                             {this.props.config.headers.map((header, i) => (
//                                 <th scope="col" key={i}>
//                                     {header}
//                                 </th>
//                             ))}
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {this.props.config.data.map((row) => (
//                             <tr key={this.props.config.identity(row)}>
//                                 {Object.keys(row).map((cellProp, i) => (
//                                     <td key={i}>{row[cellProp]}</td>
//                                 ))}
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         );
//     }
// }

export default DataTable;
