import React, { Component, StrictMode } from 'react';
import { I18n } from 'react-i18next';
import logo from './logo.png';
import SideNav from './nav/SideNav';
import { Router } from '@reach/router';
import Welcome from './Welcome';
import { Heading } from '../../src/index';
import AsyncLoader from './AsyncLoader';

const FormsGuideAsync = AsyncLoader({
    loader: () => import('./guides/FormsGuide')
});
const TabsGuideAsync = AsyncLoader({
    loader: () => import('./guides/TabsGuide')
});
const HeadingGuideAsync = AsyncLoader({
    loader: () => import('./guides/HeadingGuide')
});
const NotificationGuideAsync = AsyncLoader({
    loader: () => import('./guides/NotificationGuide')
});
const SpinnerButtonGuideAsync = AsyncLoader({
    loader: () => import('./guides/SpinnerButtonGuide')
});

class App extends Component {
    render() {
        return (
            <StrictMode>
                <I18n>
                    {(t, { i18n }) => (
                        <Heading.LevelBoundary levelOverride={1}>
                            <header className="App">
                                <a className="skip-link" href="#main">
                                    {t('skipText')}
                                </a>
                                <header className="App-header">
                                    <img
                                        src={logo}
                                        className="App-logo"
                                        alt="logo"
                                    />
                                    <Heading.H className="App-title">
                                        {t('titles.main')}
                                    </Heading.H>
                                </header>
                            </header>
                            <div className="main-panel">
                                <aside className="nav-panel">
                                    <Heading.LevelBoundary>
                                        <section>
                                            <Heading.H>
                                                {t('titles.nav')}
                                            </Heading.H>
                                            <SideNav />
                                        </section>

                                        <section className="language-container">
                                            <Heading.H>
                                                {t('titles.lang')}
                                            </Heading.H>
                                            <button
                                                onClick={() =>
                                                    i18n.changeLanguage('af')
                                                }
                                            >
                                                Afrikaans
                                            </button>
                                            <button
                                                onClick={() =>
                                                    i18n.changeLanguage('en')
                                                }
                                            >
                                                English
                                            </button>
                                            <button
                                                onClick={() =>
                                                    i18n.changeLanguage(
                                                        'pseudo'
                                                    )
                                                }
                                            >
                                                Pseudolocalize
                                            </button>
                                        </section>
                                    </Heading.LevelBoundary>
                                </aside>
                                <main id="main" className="viewport">
                                    <Router>
                                        <Welcome path="/" />
                                        <TabsGuideAsync path="/tabs" />
                                        <FormsGuideAsync path="/forms" />
                                        <HeadingGuideAsync path="/heading" />
                                        <NotificationGuideAsync path="/notification" />
                                        <SpinnerButtonGuideAsync path="/spinner-button" />
                                    </Router>
                                </main>
                            </div>
                        </Heading.LevelBoundary>
                    )}
                </I18n>
            </StrictMode>
        );
    }
}

export default App;
