import React, { Component } from 'react';
import { I18n } from 'react-i18next';
import Pane from '../Pane';
import WorkingExample from '../WorkingExample';
import CodeExample from '../CodeExample';
import { Heading } from '../../../src/index';

class HeadingGuide extends Component {
    render() {
        return (
            <I18n>
                {t => (
                    <Pane heading={t('heading.demo.heading')}>
                        <WorkingExample
                            heading={t('heading.demo.example.heading')}
                        >
                            <Heading.LevelBoundary levelOverride={1}>
                                <h1>{t('heading.demo.example.h1')}</h1>
                                <Heading.LevelBoundary>
                                    <Heading.H>
                                        {t('heading.demo.example.h2')}
                                    </Heading.H>
                                    <Heading.LevelBoundary>
                                        <Heading.H>
                                            {t('heading.demo.example.h3')}
                                        </Heading.H>
                                    </Heading.LevelBoundary>
                                    <Heading.H>
                                        {t('heading.demo.example.h2')}
                                    </Heading.H>
                                </Heading.LevelBoundary>
                            </Heading.LevelBoundary>
                        </WorkingExample>

                        <CodeExample
                            file="/examples/heading/headingExample.js"
                            heading={t('heading.demo.code.heading')}
                            resetMessage={t('heading.demo.code.reset')}
                            resetActionText={t('heading.demo.code.resetAction')}
                        />
                    </Pane>
                )}
            </I18n>
        );
    }
}

export default HeadingGuide;
