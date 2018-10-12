import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { graphql, StaticQuery } from 'gatsby';
import Header from './header';
import { MDXProvider } from '@mdx-js/tag';
import ExampleBlock from '../components/ExampleBlock';
import SideNav from '../components/SideNav';

import '@tenon-io/tenon-ui/lib/styles/tenon-ui.css';
import '../styles/ui-docs.scss';

const Layout = ({ children }) => (
    <StaticQuery
        query={graphql`
            query SiteTitleQuery {
                site {
                    siteMetadata {
                        title
                    }
                }
            }
        `}
        render={data => (
            <>
                <Helmet
                    title={data.site.siteMetadata.title}
                    meta={[
                        { name: 'description', content: 'Sample' },
                        { name: 'keywords', content: 'sample, something' }
                    ]}
                >
                    <html lang="en" />
                </Helmet>
                <Header siteTitle={data.site.siteMetadata.title} />
                <div className="main-panel">
                    <aside className="nav-panel">
                        <section>
                            <SideNav />
                        </section>
                    </aside>
                    <main id="main" className="viewport">
                        <MDXProvider
                            components={{
                                wrapper: 'section',
                                strong: 'b',
                                code: ({ children, className }) => (
                                    <ExampleBlock
                                        language={
                                            className
                                                ? className.split('-')[1]
                                                : null
                                        }
                                        resetMessage="Changes to this code block has been reset."
                                        resetActionText="Close message"
                                        codeString={children}
                                    />
                                )
                            }}
                        >
                            <>{children}</>
                        </MDXProvider>
                    </main>
                </div>
            </>
        )}
    />
);

Layout.propTypes = {
    children: PropTypes.node.isRequired
};

export default Layout;
