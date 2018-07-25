import Tabs from '@tenon-io/tenon-ui';
import React from 'react';

const TabsExample = () => (
    <Tabs>
        <Tabs.Tab title="Panel 1">
            <p>"You are on panel 1."</p>
        </Tabs.Tab>
        <Tabs.Tab title="Panel 2">
            <p>You are one panel 2.</p>
        </Tabs.Tab>
        <Tabs.Tab title="Panel 3">
            <p>You are on panel 3.</p>
        </Tabs.Tab>
        <Tabs.Tab title="Panel 4">
            <p>You are on panel 4.</p>
        </Tabs.Tab>
    </Tabs>
);

export default TabsExample;
