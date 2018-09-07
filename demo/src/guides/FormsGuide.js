import React, { Component, Fragment } from 'react';
import {
    Form,
    Input,
    TextArea,
    InputController,
    isLongerThan,
    isRequired,
    validator
} from '../../../src/index';
import ErrorBlock from '../../../src/modules/forms/ErrorBlock';
import { I18n } from 'react-i18next';
import Pane from '../Pane';
import WorkingExample from '../WorkingExample';
import CodeExample from '../CodeExample';

class FormsGuide extends Component {
    onSubmitHandler = submitData => {
        alert(`Data: ${JSON.stringify(submitData)}`);
    };

    render() {
        return (
            <I18n>
                {t => (
                    <Pane heading={t('forms.demo.heading')}>
                        <WorkingExample
                            heading={t('forms.demo.example.heading')}
                        >
                            <Form onSubmit={this.onSubmitHandler}>
                                {({ formControls, validity, hasSubmitted }) => (
                                    <Fragment>
                                        {!validity && hasSubmitted ? (
                                            <ErrorBlock
                                                formControls={formControls}
                                            />
                                        ) : null}

                                        <InputController
                                            name="petName"
                                            validators={[
                                                validator(
                                                    isRequired,
                                                    t(
                                                        'forms.demo.petName.errorMessageRequired'
                                                    )
                                                ),
                                                validator(
                                                    isLongerThan(5),
                                                    t(
                                                        'forms.demo.petName.errorMessageTooShort'
                                                    )
                                                )
                                            ]}
                                        >
                                            {props => (
                                                <Input
                                                    {...props}
                                                    required="required"
                                                    contentHintText={t(
                                                        'forms.demo.petName.contentHint'
                                                    )}
                                                    labelText={t(
                                                        'forms.demo.petName.label'
                                                    )}
                                                />
                                            )}
                                        </InputController>
                                        <InputController
                                            name="petType"
                                            validators={[
                                                validator(
                                                    isRequired,
                                                    t(
                                                        'forms.demo.petType.errorMessageRequired'
                                                    )
                                                )
                                            ]}
                                        >
                                            {props => (
                                                <Input
                                                    {...props}
                                                    require="required"
                                                    labelText={t(
                                                        'forms.demo.petType.label'
                                                    )}
                                                />
                                            )}
                                        </InputController>
                                        <InputController name="petDescription">
                                            {props => (
                                                <TextArea
                                                    {...props}
                                                    rows="10"
                                                    labelText={t(
                                                        'forms.demo.petDescription.label'
                                                    )}
                                                />
                                            )}
                                        </InputController>
                                        <InputController name="testSelect">
                                            {({
                                                getInputProps,
                                                getLabelProps
                                            }) => (
                                                <div className="group">
                                                    <div className="fieldWrapper">
                                                        <label
                                                            {...getLabelProps()}
                                                        >
                                                            This is a select
                                                        </label>
                                                        <select
                                                            {...getInputProps()}
                                                        >
                                                            <option>
                                                                Default
                                                            </option>
                                                            <option value="1">
                                                                Value1
                                                            </option>
                                                            <option value="2">
                                                                Value2
                                                            </option>
                                                            <option value="3">
                                                                Value3
                                                            </option>
                                                        </select>
                                                    </div>
                                                </div>
                                            )}
                                        </InputController>
                                        <p>
                                            Lorem ipsum dolor sit amet,
                                            consectetur adipiscing elit. In
                                            venenatis vel ante in laoreet. Nam
                                            id libero eu ligula volutpat aliquet
                                            vitae sit amet mi. Pellentesque
                                            augue elit, volutpat a dictum at,
                                            fermentum nec libero. Suspendisse
                                            mattis id sapien id eleifend. Fusce
                                            ac orci dapibus, aliquet turpis eu,
                                            condimentum arcu. Vestibulum eu
                                            tortor elit. Aenean et nisi quis
                                            arcu scelerisque sollicitudin vel
                                            sit amet quam. Etiam a euismod
                                            massa, ut iaculis tellus. Sed
                                            accumsan mollis malesuada. Donec
                                            ultrices fringilla orci sed
                                            tincidunt. Sed neque magna, dictum
                                            quis egestas nec, auctor in ligula.
                                        </p>
                                        <button type="submit">
                                            {t('forms.demo.submitButton.label')}
                                        </button>
                                    </Fragment>
                                )}
                            </Form>
                        </WorkingExample>

                        <CodeExample
                            file="/examples/forms/formsExample.js"
                            heading={t('forms.demo.code.heading')}
                            resetMessage={t('forms.demo.code.reset')}
                            resetActionText={t('forms.demo.code.resetAction')}
                        />
                    </Pane>
                )}
            </I18n>
        );
    }
}

export default FormsGuide;
