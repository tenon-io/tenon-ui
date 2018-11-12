import React from 'react';

const AsyncLoadingView = ({ error, timedOut, pastDelay }) => {
    if (error || timedOut) {
        return <span>Error loading...</span>;
    } else if (pastDelay) {
        return <p>Loading...</p>;
    } else {
        return null;
    }
};

export default AsyncLoadingView;
