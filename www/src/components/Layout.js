import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { graphql, StaticQuery, Link } from 'gatsby';
import Header from './header';
import { MDXProvider } from '@mdx-js/tag';
import ExampleBlock from '../components/ExampleBlock';
import SideNav from '../components/SideNav';

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
                                ),
                                a: ({ href, children, ...props }) => {
                                    if (
                                        href.indexOf('http') === -1 &&
                                        href.indexOf('https') === -1
                                    ) {
                                        return (
                                            <Link to={href} {...props}>
                                                {children}
                                            </Link>
                                        );
                                    } else {
                                        return (
                                            <a href={href} {...props}>
                                                {children}
                                            </a>
                                        );
                                    }
                                }
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
