import React from 'react';
import { Heading } from '../../src/index';

const Panel = ({ heading, children }) => (
    <Heading.LevelBoundary>
        <section className="pane-section">
            <Heading.H>{heading}</Heading.H>
            <Heading.LevelBoundary>{children}</Heading.LevelBoundary>
        </section>
    </Heading.LevelBoundary>
);

export default Panel;
