import React, { Fragment } from 'react';
import { Heading } from '../../src/index';

const WorkingExample = ({ heading, children }) => (
    <Fragment>
        <Heading.H>{heading}</Heading.H>
        <div className="working-example">{children}</div>
    </Fragment>
);

export default WorkingExample;
