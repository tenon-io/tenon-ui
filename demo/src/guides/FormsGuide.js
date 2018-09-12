import React, { Component, Fragment } from 'react';
import {
    Form,
    Input,
    isLongerThan,
    isRequired,
    RadioGroup,
    Select,
    TextArea,
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
                                        <Form.TextInputController
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
                                        </Form.TextInputController>
                                        <Form.TextInputController
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
                                                    required="required"
                                                    labelText={t(
                                                        'forms.demo.petType.label'
                                                    )}
                                                />
                                            )}
                                        </Form.TextInputController>
                                        <Form.TextareaController name="petDescription">
                                            {props => (
                                                <TextArea
                                                    {...props}
                                                    rows="10"
                                                    labelText={t(
                                                        'forms.demo.petDescription.label'
                                                    )}
                                                />
                                            )}
                                        </Form.TextareaController>
                                        <Form.SelectController
                                            name="petWeight"
                                            validators={[
                                                validator(
                                                    isRequired,
                                                    t(
                                                        'forms.demo.petWeight.errorMessageRequired'
                                                    )
                                                )
                                            ]}
                                        >
                                            {props => (
                                                <Select
                                                    {...props}
                                                    labelText={t(
                                                        'forms.demo.petWeight.label'
                                                    )}
                                                    required="required"
                                                >
                                                    <option>
                                                        {t(
                                                            'forms.demo.petWeight.defaultOption'
                                                        )}
                                                    </option>
                                                    <option value="weightClass1">
                                                        {t(
                                                            'forms.demo.petWeight.weightClass1'
                                                        )}
                                                    </option>
                                                    <option value="weightClass2">
                                                        {t(
                                                            'forms.demo.petWeight.weightClass2'
                                                        )}
                                                    </option>
                                                    <option value="weightClass3">
                                                        {t(
                                                            'forms.demo.petWeight.weightClass3'
                                                        )}
                                                    </option>
                                                </Select>
                                            )}
                                        </Form.SelectController>
                                        <Form.RadioGroupController
                                            name="petColour"
                                            validators={[
                                                validator(
                                                    isRequired,
                                                    t(
                                                        'forms.demo.petColour.errorMessageRequired'
                                                    )
                                                )
                                            ]}
                                        >
                                            {props => (
                                                <RadioGroup
                                                    {...props}
                                                    legend={t(
                                                        'forms.demo.petColour.legend'
                                                    )}
                                                    required="required"
                                                    options={{
                                                        black: t(
                                                            'forms.demo.petColour.blackOption'
                                                        ),
                                                        white: t(
                                                            'forms.demo.petColour.whiteOption'
                                                        ),
                                                        brown: t(
                                                            'forms.demo.petColour.brownOption'
                                                        )
                                                    }}
                                                />
                                            )}
                                        </Form.RadioGroupController>

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
