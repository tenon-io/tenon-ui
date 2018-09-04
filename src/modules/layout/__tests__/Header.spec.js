import React from 'react';
import { render } from 'react-testing-library';
import Heading from '../Heading';

describe('Heading', () => {
    it('should auto render the correct heading hierarchies starting at 2 and maxing out at level 6', () => {
        const { container } = render(
            <div>
                <h1>Main heading</h1>
                <Heading.LevelBoundary>
                    <section id="section-level-2">
                        <Heading.H>Second level heading</Heading.H>
                        <Heading.LevelBoundary>
                            <section id="section-level-3">
                                <Heading.H>Third level heading</Heading.H>
                                <Heading.LevelBoundary>
                                    <section id="section-level-4">
                                        <Heading.H>
                                            Fourth level heading
                                        </Heading.H>
                                        <Heading.LevelBoundary>
                                            <section id="section-level-5">
                                                <Heading.H>
                                                    Fifth level heading
                                                </Heading.H>
                                                <Heading.LevelBoundary>
                                                    <section id="section-level-6">
                                                        <Heading.H>
                                                            Sixth level heading
                                                        </Heading.H>
                                                        <Heading.LevelBoundary>
                                                            <section id="section-level-7">
                                                                <Heading.H>
                                                                    Seventh
                                                                    level
                                                                    heading
                                                                </Heading.H>
                                                            </section>
                                                        </Heading.LevelBoundary>
                                                    </section>
                                                </Heading.LevelBoundary>
                                            </section>
                                        </Heading.LevelBoundary>
                                    </section>
                                </Heading.LevelBoundary>
                            </section>
                        </Heading.LevelBoundary>
                    </section>
                </Heading.LevelBoundary>
            </div>
        );

        expect(
            container.querySelector('section#section-level-2 h2').innerHTML
        ).toBe('Second level heading');
        expect(
            container.querySelector('section#section-level-3 h3').innerHTML
        ).toBe('Third level heading');
        expect(
            container.querySelector('section#section-level-4 h4').innerHTML
        ).toBe('Fourth level heading');
        expect(
            container.querySelector('section#section-level-5 h5').innerHTML
        ).toBe('Fifth level heading');
        expect(
            container.querySelector('section#section-level-6 h6').innerHTML
        ).toBe('Sixth level heading');
        expect(
            container.querySelector('section#section-level-7 h6').innerHTML
        ).toBe('Seventh level heading');
    });

    it('should override the default heading level and then calculate from there', () => {
        const { container } = render(
            <div>
                <Heading.LevelBoundary levelOverride="1">
                    <section id="section-level-1">
                        <Heading.H>First level heading</Heading.H>
                        <Heading.LevelBoundary>
                            <section id="section-level-2">
                                <Heading.H>Second level heading</Heading.H>
                                <Heading.LevelBoundary>
                                    <section id="section-level-3">
                                        <Heading.H>
                                            Third level heading
                                        </Heading.H>
                                        <Heading.LevelBoundary>
                                            <section id="section-level-4">
                                                <Heading.H>
                                                    Fourth level heading
                                                </Heading.H>
                                                <Heading.LevelBoundary>
                                                    <section id="section-level-5">
                                                        <Heading.H>
                                                            Fifth level heading
                                                        </Heading.H>
                                                        <Heading.LevelBoundary>
                                                            <section id="section-level-6">
                                                                <Heading.H>
                                                                    Sixth level
                                                                    heading
                                                                </Heading.H>
                                                            </section>
                                                        </Heading.LevelBoundary>
                                                    </section>
                                                </Heading.LevelBoundary>
                                            </section>
                                        </Heading.LevelBoundary>
                                    </section>
                                </Heading.LevelBoundary>
                            </section>
                        </Heading.LevelBoundary>
                    </section>
                </Heading.LevelBoundary>
            </div>
        );

        expect(
            container.querySelector('section#section-level-1 h1').innerHTML
        ).toBe('First level heading');
        expect(
            container.querySelector('section#section-level-2 h2').innerHTML
        ).toBe('Second level heading');
        expect(
            container.querySelector('section#section-level-3 h3').innerHTML
        ).toBe('Third level heading');
        expect(
            container.querySelector('section#section-level-4 h4').innerHTML
        ).toBe('Fourth level heading');
        expect(
            container.querySelector('section#section-level-5 h5').innerHTML
        ).toBe('Fifth level heading');
        expect(
            container.querySelector('section#section-level-6 h6').innerHTML
        ).toBe('Sixth level heading');
    });
});
