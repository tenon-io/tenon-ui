import React, { Component } from 'react';
import { I18n } from 'react-i18next';
import { Tabs } from '../../../src/index';
import Pane from '../Pane';
import WorkingExample from '../WorkingExample';
import CodeExample from '../CodeExample';

class TabsGuide extends Component {
    render() {
        return (
            <I18n>
                {t => (
                    <Pane heading={t('tabs.demo.heading')}>
                        <WorkingExample
                            heading={t('tabs.demo.example.heading')}
                        >
                            <Tabs>
                                <Tabs.Tab
                                    title={t('tabs.demo.example.panel1.title')}
                                >
                                    <p>
                                        {t('tabs.demo.example.panel1.content')}
                                    </p>
                                </Tabs.Tab>
                                <Tabs.Tab
                                    title={t('tabs.demo.example.panel2.title')}
                                >
                                    <p>
                                        {t('tabs.demo.example.panel2.content')}
                                    </p>
                                </Tabs.Tab>
                                <Tabs.Tab
                                    title={t('tabs.demo.example.panel3.title')}
                                >
                                    <p>
                                        {t('tabs.demo.example.panel3.content')}
                                    </p>
                                </Tabs.Tab>
                                <Tabs.Tab
                                    title={t('tabs.demo.example.panel4.title')}
                                >
                                    <p>
                                        {t('tabs.demo.example.panel4.content')}
                                    </p>
                                </Tabs.Tab>
                            </Tabs>
                        </WorkingExample>

                        <CodeExample
                            file="/examples/tabs/tabsExample.js"
                            heading={t('tabs.demo.code.heading')}
                            resetMessage={t('tabs.demo.code.reset')}
                            resetActionText={t('tabs.demo.code.resetAction')}
                        />
                    </Pane>
                )}
            </I18n>
        );
    }
}

export default TabsGuide;
