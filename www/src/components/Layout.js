import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { graphql, Link, StaticQuery } from 'gatsby';
import { Location } from '@reach/router';
import Header from './Header';
import { MDXProvider } from '@mdx-js/tag';
import ExampleBlock from '../components/ExampleBlock';
import SideNav from '../components/SideNav';
import Disclosure from '../components/Disclosure';

import '../styles/ui-docs.scss';

class CustomHeadingThree extends Component {
    constructor(props) {
        super(props);

        this.headingRef = createRef();
    }

    componentDidMount() {
        //This is required as the MDX container rerenders on locations
        //hash change as well which messed up the focus event of the container.
        if (window.location.hash === `#${this.props.id}`) {
            this.headingRef.current.focus();
        }
    }

    render() {
        const { id, children, ...props } = this.props;
        return (
            <h3 id={id} ref={this.headingRef} tabIndex="-1" {...props}>
                {children}
            </h3>
        );
    }
}

class LayoutView extends Component {
    constructor(props) {
        super(props);

        this.mainRef = createRef();
    }

    componentDidMount() {
        const { location } = this.props;
        //This is required as the MDX container rerenders on locations
        //hash change as well which messed up the focus event of the container.
        if (
            window.location.hash === '#content' ||
            (location.state && location.state.focus)
        ) {
            this.mainRef.current.focus();
        }
    }

    render() {
        const { data, children } = this.props;
        return (
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
                    <main
                        id="content"
                        className="viewport"
                        tabIndex="-1"
                        ref={this.mainRef}
                    >
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
                                            <CustomHeadingThree
                                                id={idString}
                                                {...props}
                                            >
                                                {children}
                                            </CustomHeadingThree>
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
                                            <Link
                                                to={href}
                                                {...props}
                                                state={{ focus: true }}
                                            >
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
        );
    }
}

const Layout = ({ children, location }) => (
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
            <LayoutView data={data} location={location}>
                {children}
            </LayoutView>
        )}
    />
);

Layout.propTypes = {
    children: PropTypes.node.isRequired
};

export default ({ children, ...props }) => (
    <Location>
        {({ location }) => (
            <Layout location={location} {...props}>
                {children}
            </Layout>
        )}
    </Location>
);
