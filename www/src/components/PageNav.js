import React from 'react';

const PageNav = ({ targets }) => (
    <nav className="in-page-nav">
        <p>Jump to:</p>
        <ul>
            {targets.map((target, i) => (
                <li key={i}>
                    <a href={`#${target.replace(/ /g, '-').toLowerCase()}`}>
                        {target}
                    </a>
                </li>
            ))}
        </ul>
    </nav>
);

export default PageNav;
