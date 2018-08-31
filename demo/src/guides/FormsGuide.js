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
                                            name="userName"
                                            validators={[
                                                validator(
                                                    isRequired,
                                                    t(
                                                        'forms.demo.userName.errorMessageRequired'
                                                    )
                                                ),
                                                validator(
                                                    isLongerThan(5),
                                                    t(
                                                        'forms.demo.userName.errorMessageTooShort'
                                                    )
                                                )
                                            ]}
                                        >
                                            {props => (
                                                <Input
                                                    {...props}
                                                    required="required"
                                                    contentHintText={t(
                                                        'forms.demo.userName.contentHint'
                                                    )}
                                                    labelText={t(
                                                        'forms.demo.userName.label'
                                                    )}
                                                />
                                            )}
                                        </InputController>
                                        <InputController
                                            name="password"
                                            validators={[
                                                validator(
                                                    isRequired,
                                                    t(
                                                        'forms.demo.password.errorMessageRequired'
                                                    )
                                                )
                                            ]}
                                        >
                                            {props => (
                                                <Input
                                                    {...props}
                                                    require="required"
                                                    labelText={t(
                                                        'forms.demo.password.label'
                                                    )}
                                                />
                                            )}
                                        </InputController>
                                        <InputController name="description">
                                            {props => (
                                                <TextArea
                                                    {...props}
                                                    rows="10"
                                                    labelText={t(
                                                        'forms.demo.description.label'
                                                    )}
                                                />
                                            )}
                                        </InputController>
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
