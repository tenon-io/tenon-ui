import React, { Component, Fragment } from 'react';
import {
    Form,
    Input,
    RadioGroup,
    TextArea,
    ElementController,
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

                                        <ElementController
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
                                        </ElementController>
                                        <ElementController
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
                                        </ElementController>
                                        <ElementController name="petDescription">
                                            {props => (
                                                <TextArea
                                                    {...props}
                                                    rows="10"
                                                    labelText={t(
                                                        'forms.demo.petDescription.label'
                                                    )}
                                                />
                                            )}
                                        </ElementController>
                                        <ElementController name="testSelect">
                                            {({
                                                getSelectProps,
                                                getLabelProps
                                            }) => (
                                                <div className="form-group">
                                                    <div className="field-wrapper">
                                                        <label
                                                            {...getLabelProps()}
                                                        >
                                                            This is a select
                                                        </label>
                                                        <select
                                                            {...getSelectProps()}
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
                                        </ElementController>
                                        <ElementController name="radioSet">
                                            {props => (
                                                <RadioGroup
                                                    {...props}
                                                    legend="Please select an option"
                                                    options={{
                                                        option1: 'Option 1',
                                                        option2: 'Option 2',
                                                        option3: 'Option 3'
                                                    }}
                                                />
                                            )}
                                        </ElementController>

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
