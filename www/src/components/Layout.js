import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { graphql, StaticQuery, Link } from 'gatsby';
import Header from './Header';
import { MDXProvider } from '@mdx-js/tag';
import ExampleBlock from '../components/ExampleBlock';
import SideNav from '../components/SideNav';
import Disclosure from '../components/Disclosure';

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
                        {
                            name: 'description',
                            content: 'Tenon UI documentation'
                        },
                        {
                            name: 'keywords',
                            content:
                                'tenon-ui, react, components, accessibility'
                        }
                    ]}
                >
                    <html lang="en" />
                </Helmet>
                <Header siteTitle={data.site.siteMetadata.title} />
                <div className="main-panel">
                    <aside className="nav-panel">
                        <section className="desktop-menu">
                            <SideNav />
                        </section>
                        <section className="mobile-menu">
                            <Disclosure>
                                <Disclosure.Trigger className="primary">
                                    {expanded =>
                                        expanded ? 'Hide menu' : 'Show menu'
                                    }
                                </Disclosure.Trigger>
                                <Disclosure.Target>
                                    <SideNav />
                                </Disclosure.Target>
                            </Disclosure>
                        </section>
                    </aside>
                    <main id="main" className="viewport">
                        <MDXProvider
                            components={{
                                wrapper: 'section',
                                strong: 'b',
                                inlineCode: ({ children }) => (
                                    <span className="text-highlight">
                                        {children}
                                    </span>
                                ),
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
                                h3: ({ children, ...props }) => {
                                    if (typeof children === 'string') {
                                        const idString = children
                                            .replace(/ /g, '-')
                                            .toLowerCase();
                                        return (
                                            <h3 id={idString} {...props}>
                                                {children}
                                            </h3>
                                        );
                                    } else {
                                        return <h3 {...props}>{children}</h3>;
                                    }
                                },
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
