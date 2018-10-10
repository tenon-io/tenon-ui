import React, { Component } from 'react';
import { graphql } from 'gatsby';
import CodeBlock from '@tenon-io/tenon-codeblock';

import MDXRenderer from 'gatsby-mdx/mdx-renderer';
import { MDXProvider } from '@mdx-js/tag';

export default class MDXRuntimeTest extends Component {
    render() {
        const { children, data, ...props } = this.props;

        return (
            <MDXProvider
                components={{
                    h1: ({ children, ...props }) => (
                        <h1 {...props}>Provided: {children}</h1>
                    ),
                    wrapper: 'section',
                    code: ({ children, ...props }) => (
                        <div>
                            {JSON.stringify(props)}
                            <CodeBlock
                                codeString={children}
                                onReset={() => {
                                    console.log('reset');
                                }}
                            />
                        </div>
                    )
                }}
            >
                <div>
                    <h1>Uses MDXRenderer</h1>
                    <div>{children}</div>
                    <MDXRenderer {...props}>{data.mdx.code.body}</MDXRenderer>
                </div>
            </MDXProvider>
        );
    }
}

export const pageQuery = graphql`
    query($id: String!) {
        mdx(id: { eq: $id }) {
            id
            code {
                body
            }
        }
    }
`;
