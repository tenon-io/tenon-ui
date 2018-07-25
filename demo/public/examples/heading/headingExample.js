import React from 'react';
import { Heading } from '@tenon-io/tenon-ui';

const HeaderDemo = () => (
    <Heading.LevelBoundary levelOverride={1}>
        <h1>This is an h1</h1>
        <Heading.LevelBoundary>
            <Heading.H>This is an h2</Heading.H>
            <Heading.LevelBoundary>
                <Heading.H>This is an h3</Heading.H>
            </Heading.LevelBoundary>
            <Heading.H>This is an h2</Heading.H>
        </Heading.LevelBoundary>
    </Heading.LevelBoundary>
);

export default HeaderDemo;
