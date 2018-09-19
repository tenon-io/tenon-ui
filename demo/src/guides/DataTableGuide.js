import React, { Component } from 'react';
import { I18n } from 'react-i18next';
import Pane from '../Pane';
import WorkingExample from '../WorkingExample';
import CodeExample from '../CodeExample';

const data = [
    {
        name: 'Dory',
        type: 'Cat',
        description: 'A cute little dangerous cat',
        color: 'Brown',
        eatsAt: 'Morning, Night'
    },
    {
        name: 'Shifu',
        type: 'Cat',
        description: 'A serious cuddle cat',
        color: 'Black',
        eatsAt: 'Morning, Noon, Night'
    },
    {
        name: 'Emmy',
        type: 'Dog',
        description: 'The moat monster',
        color: 'Brown',
        eatsAt: 'Morning, Noon, Night and then some'
    }
];

class DataTableGuide extends Component {
    render() {
        return (
            <I18n>
                {t => (
                    <Pane heading={t('dataTable.demo.heading')}>
                        <WorkingExample
                            heading={t('dataTable.demo.example.heading')}
                        />

                        <CodeExample
                            file="/examples/spinner/spinnerExample.js"
                            heading={t('dataTable.demo.code.heading')}
                            resetMessage={t('dataTable.demo.code.reset')}
                            resetActionText={t(
                                'dataTable.demo.code.resetAction'
                            )}
                        />
                    </Pane>
                )}
            </I18n>
        );
    }
}

export default DataTableGuide;
