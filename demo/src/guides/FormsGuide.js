import React, { Component, Fragment, createRef } from 'react';
import {
    Form,
    ErrorBlock,
    Input,
    isLongerThan,
    isRequired,
    RadioGroup,
    Select,
    TextArea,
    Checkbox,
    CheckboxGroup,
    validator
} from '../../../src/index';
import { I18n } from 'react-i18next';
import Pane from '../Pane';
import WorkingExample from '../WorkingExample';
import CodeExample from '../CodeExample';

class FormsGuide extends Component {
    constructor(props) {
        super(props);

        this.state = {
            formData: {}
        };

        this.errorBlockRef = createRef();
    }

    onDataChangeHandler = () => {
        this.setState({
            formData: {
                petName: 'Dogter Who',
                petType: 'Dog',
                petDescription: 'A little brown dog that eats a lot!',
                petWeight: 'weightClass2',
                petColour: 'brown',
                petEat: ['morning', 'noon', 'night']
            }
        });
    };

    onPartialDataChangeHandler = () => {
        this.setState({
            formData: {
                petType: 'Cat',
                petWeight: 'weightClass1',
                petColour: 'black',
                petEat: ['morning', 'night']
            }
        });
    };

    onSubmitHandler = submitData => {
        alert(`Data: ${JSON.stringify(submitData)}`);
    };

    onRawSubmitHandler = (formControls, validity) => {
        if (!validity) {
            setTimeout(() => {
                this.errorBlockRef.current.focus();
            });
        }
    };

    render() {
        const { formData } = this.state;
        return (
            <I18n>
                {t => (
                    <Pane heading={t('forms.demo.heading')}>
                        <WorkingExample
                            heading={t('forms.demo.example.heading')}
                        >
                            <Form
                                formData={formData}
                                onSubmit={this.onSubmitHandler}
                                onRawSubmit={this.onRawSubmitHandler}
                            >
                                {({ formControls, validity, hasSubmitted }) => (
                                    <Fragment>
                                        {!validity && hasSubmitted ? (
                                            <ErrorBlock
                                                headingText={t(
                                                    'forms.demo.errorBlock.heading'
                                                )}
                                                ref={this.errorBlockRef}
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
                                                    requiredText={t(
                                                        'forms.demo.requiredText'
                                                    )}
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
                                                    requiredText={t(
                                                        'forms.demo.requiredText'
                                                    )}
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
                                                    requiredText={t(
                                                        'forms.demo.requiredText'
                                                    )}
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
                                                    requiredText={t(
                                                        'forms.demo.requiredText'
                                                    )}
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

                                        <Form.CheckboxGroupController
                                            name="petEat"
                                            validators={[
                                                validator(
                                                    value => value.length > 0,
                                                    t(
                                                        'forms.demo.petLove.errorMessageRequired'
                                                    )
                                                )
                                            ]}
                                        >
                                            {props => (
                                                <CheckboxGroup
                                                    legend={t(
                                                        'forms.demo.petLove.legend'
                                                    )}
                                                    contentHintText={t(
                                                        'forms.demo.petLove.contentHint'
                                                    )}
                                                    options={{
                                                        morning: t(
                                                            'forms.demo.petLove.morningOption'
                                                        ),
                                                        noon: t(
                                                            'forms.demo.petLove.noonOption'
                                                        ),
                                                        night: t(
                                                            'forms.demo.petLove.nightOption'
                                                        )
                                                    }}
                                                    required="required"
                                                    requiredText={t(
                                                        'forms.demo.requiredText'
                                                    )}
                                                    {...props}
                                                />
                                            )}
                                        </Form.CheckboxGroupController>

                                        <Form.CheckboxController
                                            name="confirmInfo"
                                            validators={[
                                                validator(
                                                    value => value === true,
                                                    t(
                                                        'forms.demo.confirmInfo.errorMessageRequired'
                                                    )
                                                )
                                            ]}
                                        >
                                            {props => (
                                                <Checkbox
                                                    {...props}
                                                    required="required"
                                                    requiredText={t(
                                                        'forms.demo.requiredText'
                                                    )}
                                                    labelText={t(
                                                        'forms.demo.confirmInfo.label'
                                                    )}
                                                />
                                            )}
                                        </Form.CheckboxController>

                                        <button type="submit">
                                            {t('forms.demo.submitButton.label')}
                                        </button>
                                        <button
                                            type="button"
                                            className="secondary"
                                            onClick={this.onDataChangeHandler}
                                        >
                                            {t(
                                                'forms.demo.loadDataButton.label'
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            className="secondary"
                                            onClick={
                                                this.onPartialDataChangeHandler
                                            }
                                        >
                                            {t(
                                                'forms.demo.loadPartialDataButton.label'
                                            )}
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
