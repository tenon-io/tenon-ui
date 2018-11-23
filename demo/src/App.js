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
const SpinnerGuideAsync = AsyncLoader({
    loader: () => import('./guides/SpinnerGuide')
});
const FocusCatcherGuideAsync = AsyncLoader({
    loader: () => import('./guides/FocusCatcherGuide')
});
const DisclosureGuideAsync = AsyncLoader({
    loader: () => import('./guides/DisclosureGuide')
});

class App extends Component {
    render() {
        return (
            <StrictMode>
                <I18n>
                    {(t, { i18n }) => (
                        <Heading.LevelBoundary levelOverride={1}>
                            <header className="app">
                                <a className="skip-link" href="#main">
                                    {t('skipText')}
                                </a>
                                <header className="app-header">
                                    <img
                                        src={logo}
                                        className="app-logo"
                                        alt="Logo of Tenon.io"
                                    />
                                    <Heading.H className="app-title">
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
                                                className="secondary"
                                                onClick={() =>
                                                    i18n.changeLanguage('af')
                                                }
                                            >
                                                Afrikaans
                                            </button>
                                            <button
                                                className="secondary"
                                                onClick={() =>
                                                    i18n.changeLanguage('en')
                                                }
                                            >
                                                English
                                            </button>
                                            <button
                                                className="secondary"
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
                                        <DisclosureGuideAsync path="/disclosure" />
                                        <TabsGuideAsync path="/tabs" />
                                        <FormsGuideAsync path="/forms" />
                                        <HeadingGuideAsync path="/heading" />
                                        <NotificationGuideAsync path="/notification" />
                                        <SpinnerButtonGuideAsync path="/spinner-button" />
                                        <SpinnerGuideAsync path="/spinner" />
                                        <FocusCatcherGuideAsync path="/focus-catcher" />
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
