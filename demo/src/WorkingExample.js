import React, { Fragment } from 'react';
import { Heading } from '../../src/index';

const WorkingExample = ({ heading, children }) => (
    <Fragment>
        <Heading.H>{heading}</Heading.H>
        <Heading.LevelBoundary>
            <div className="working-example">{children}</div>
        </Heading.LevelBoundary>
    </Fragment>
);

export default WorkingExample;
