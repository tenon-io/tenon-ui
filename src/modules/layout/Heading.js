import React, { createContext, forwardRef } from 'react';
import PropTypes from 'prop-types';

const LevelContext = createContext(1);

export const LevelBoundary = ({ children, levelOverride }) => (
    <LevelContext.Consumer>
        {level => (
            <LevelContext.Provider
                value={levelOverride ? parseInt(levelOverride, 10) : level + 1}
            >
                {children}
            </LevelContext.Provider>
        )}
    </LevelContext.Consumer>
);

LevelBoundary.displayName = 'Heading.LevelBoundary';

LevelBoundary.propTypes = {
    levelOverride: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export const H = forwardRef((props, ref) => (
    <LevelContext.Consumer>
        {level => {
            const Heading = `h${Math.min(level, 6)}`;
            return <Heading ref={ref} {...props} />;
        }}
    </LevelContext.Consumer>
));

H.displayName = 'Heading.H';

/**
 * @component
 * An automatic heading management compound component. Keeps
 * track of the heading levels in the application and renders
 * the correct <h> tag.
 *
 * By default the first level that will be rendered will be
 * <h2> but this can be overriden by setting the
 * levelOverride prop
 *
 * @prop {string | number} levelOverride: Optional override
 *              prop to hard set the current level.
 *
 * @example
 * <h1>Heading 1</h1>
 * <Heading.LevelBoundary>
 *     <Heading.H>Heading 2</Heading.H>
 *     <Heading.LevelBoundary>
 *          <Heading.H>Heading 3</Heading.H>
 *     </Heading.LevelBoundary>
 *     <Heading.LevelBoundary>
 *          <Heading.H>Heading 3</Heading.H>
 *          <Heading.LevelBoundary>
 *              <Heading.H>Heading 4</Heading.H>
 *          </Heading.LevelBoundary>
 *     </Heading.LevelBoundary>
 * </Heading.LevelBoundary>
 */
class Heading {
    static LevelBoundary = LevelBoundary;

    static H = H;
}

export default Heading;
