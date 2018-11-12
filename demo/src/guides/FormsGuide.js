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
                                            required="true"
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
                                            requiredText={t(
                                                'forms.demo.requiredText'
                                            )}
                                            contentHintText={t(
                                                'forms.demo.petName.contentHint'
                                            )}
                                            labelText={t(
                                                'forms.demo.petName.label'
                                            )}
                                            component={Input}
                                        />
                                        <Form.TextInputController
                                            name="petType"
                                            required="true"
                                            validators={[
                                                validator(
                                                    isRequired,
                                                    t(
                                                        'forms.demo.petType.errorMessageRequired'
                                                    )
                                                )
                                            ]}
                                            requiredText={t(
                                                'forms.demo.requiredText'
                                            )}
                                            labelText={t(
                                                'forms.demo.petType.label'
                                            )}
                                            component={Input}
                                        />
                                        <Form.TextareaController
                                            name="petDescription"
                                            rows="10"
                                            labelText={t(
                                                'forms.demo.petDescription.label'
                                            )}
                                            component={TextArea}
                                        />
                                        <Form.SelectController
                                            name="petWeight"
                                            required="true"
                                            validators={[
                                                validator(
                                                    isRequired,
                                                    t(
                                                        'forms.demo.petWeight.errorMessageRequired'
                                                    )
                                                )
                                            ]}
                                            labelText={t(
                                                'forms.demo.petWeight.label'
                                            )}
                                            requiredText={t(
                                                'forms.demo.requiredText'
                                            )}
                                            component={Select}
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
                                        </Form.SelectController>
                                        <Form.RadioGroupController
                                            name="petColour"
                                            required="true"
                                            validators={[
                                                validator(
                                                    isRequired,
                                                    t(
                                                        'forms.demo.petColour.errorMessageRequired'
                                                    )
                                                )
                                            ]}
                                            legend={t(
                                                'forms.demo.petColour.legend'
                                            )}
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
                                            component={RadioGroup}
                                        />

                                        <Form.CheckboxGroupController
                                            name="petEat"
                                            required="true"
                                            validators={[
                                                validator(
                                                    value => value.length > 0,
                                                    t(
                                                        'forms.demo.petLove.errorMessageRequired'
                                                    )
                                                )
                                            ]}
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
                                            requiredText={t(
                                                'forms.demo.requiredText'
                                            )}
                                            component={CheckboxGroup}
                                        />

                                        <Form.CheckboxController
                                            name="confirmInfo"
                                            required="true"
                                            validators={[
                                                validator(
                                                    value => value === true,
                                                    t(
                                                        'forms.demo.confirmInfo.errorMessageRequired'
                                                    )
                                                )
                                            ]}
                                            requiredText={t(
                                                'forms.demo.requiredText'
                                            )}
                                            labelText={t(
                                                'forms.demo.confirmInfo.label'
                                            )}
                                            component={Checkbox}
                                        />

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
