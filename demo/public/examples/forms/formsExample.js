import React, { Fragment } from 'react';
import ErrorBlock from '../../../../src/modules/forms/ErrorBlock';
import {
    Form,
    Input,
    isLongerThan,
    isRequired,
    TextArea,
    Select,
    RadioGroup,
    validator
} from '@tenon-io/tenon-ui';
import { Checkbox, CheckboxGroup } from '../../../../src';

const FormsExample = () => (
    <Form onSubmit={this.onSubmitHandler}>
        {({ formControls, validity, hasSubmitted }) => (
            <Fragment>
                {!validity && hasSubmitted ? (
                    <ErrorBlock
                        formControls={formControls}
                        headingText="The form contains errors"
                    />
                ) : null}

                <Form.TextInputController
                    name="petName"
                    required="true"
                    validators={[
                        validator(
                            isRequired,
                            'A name is required for your pet'
                        ),
                        validator(
                            isLongerThan(5),
                            "The pet's name is too short"
                        )
                    ]}
                    requiredText="( required )"
                    contentHintText="The pet's name must be longer than 5 characters"
                    labelText="Name of pet"
                    component={Input}
                />
                <Form.TextInputController
                    name="petType"
                    required="true"
                    validators={[
                        validator(isRequired, 'A type of pet is required')
                    ]}
                    requiredText="( required )"
                    labelText="Type of pet"
                    component={Input}
                />
                <Form.TextareaController
                    name="petDescription"
                    rows="10"
                    labelText="Type of pet"
                    component={TextArea}
                />
                <Form.SelectController
                    name="petWeight"
                    required="true"
                    validators={[
                        validator(isRequired, 'Please select a weight category')
                    ]}
                    labelText="Pet's weight"
                    requiredText="( required )"
                    component={Select}
                >
                    <option>No weight category selected</option>
                    <option value="weightClass1">0-3kg</option>
                    <option value="weightClass2">3-7kg</option>
                    <option value="weightClass3">Really heavy!</option>
                </Form.SelectController>
                <Form.RadioGroupController
                    name="radioSet"
                    required="true"
                    validators={[
                        validator(isRequired, 'Please select an option')
                    ]}
                    legend="Please select an option"
                    requiredText="( required )"
                    options={{
                        option1: 'Option 1',
                        option2: 'Option 2',
                        option3: 'Option 3'
                    }}
                    component={RadioGroup}
                />
                <Form.CheckboxGroupController
                    name="petEat"
                    required="true"
                    validators={[
                        validator(
                            value => value.length > 0,
                            'You need to select an eating time'
                        )
                    ]}
                    legend="When does your pet eat"
                    contentHintText="Please select at least one"
                    options={{
                        morning: 'Morning',
                        noon: 'Noon',
                        night: 'Night'
                    }}
                    requiredText="( required )"
                    component={CheckboxGroup}
                />
                <Form.CheckboxController
                    name="confirmInfo"
                    required="true"
                    validators={[
                        validator(
                            value => value === true,
                            "You must confirm your pet's information"
                        )
                    ]}
                    requiredText="( required )"
                    labelText="I confirm that my pet's information is true"
                    component={Checkbox}
                />
                <button type="submit">'Save your pet'</button>
            </Fragment>
        )}
    </Form>
);

export default FormsExample;
