import React, { Component } from 'react';
import { I18n } from 'react-i18next';
import Pane from './Pane';

class Welcome extends Component {
    render() {
        return (
            <I18n>
                {t => (
                    <Pane heading={t('welcome.heading')}>
                        <p>{t('welcome.p1')}</p>
                    </Pane>
                )}
            </I18n>
        );
    }
}

export default Welcome;
