import React from 'react';
import { FocusCatcher } from '@tenon-io/tenon-ui';

const FocusCatcherExample = () => (
    <div tabIndex="-1" id="toBeFocusedFromCode">
        <FocusCatcher>
            <label htmlFor="focusCatch">Click me</label>
            <input id="focusCatch" />
        </FocusCatcher>
    </div>
);

export default FocusCatcherExample;
