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
                >
                    {props => (
                        <Input
                            {...props}
                            required="required"
                            requiredText="( required )"
                            contentHintText="The pet's name must be longer than 5 characters"
                            labelText="Name of pet"
                        />
                    )}
                </Form.TextInputController>

                <Form.TextInputController
                    name="petType"
                    validators={[
                        validator(isRequired, 'A type of pet is required')
                    ]}
                >
                    {props => (
                        <Input
                            {...props}
                            require="required"
                            requiredText="( required )"
                            labelText="Type of pet"
                        />
                    )}
                </Form.TextInputController>

                <Form.TextareaController name="petDescription">
                    {props => (
                        <TextArea
                            {...props}
                            rows="10"
                            labelText="Type of pet"
                        />
                    )}
                </Form.TextareaController>

                <Form.SelectController
                    name="petWeight"
                    validators={[
                        validator(isRequired, 'Please select a weight category')
                    ]}
                >
                    {props => (
                        <Select
                            {...props}
                            labelText="Pet's weight"
                            required="required"
                            requiredText="( required )"
                        >
                            <option>No weight category selected</option>
                            <option value="weightClass1">0-3kg</option>
                            <option value="weightClass2">3-7kg</option>
                            <option value="weightClass3">Really heavy!</option>
                        </Select>
                    )}
                </Form.SelectController>

                <Form.RadioGroupController
                    name="radioSet"
                    validators={[
                        validator(isRequired, 'Please select an option')
                    ]}
                >
                    {props => (
                        <RadioGroup
                            {...props}
                            legend="Please select an option"
                            required="required"
                            requiredText="( required )"
                            options={{
                                option1: 'Option 1',
                                option2: 'Option 2',
                                option3: 'Option 3'
                            }}
                        />
                    )}
                </Form.RadioGroupController>

                <Form.CheckboxGroupController
                    name="petEat"
                    validators={[
                        validator(
                            value => value.length > 0,
                            'You need to select an eating time'
                        )
                    ]}
                >
                    {props => (
                        <CheckboxGroup
                            legend="When does your pet eat"
                            contentHintText="Please select at least one"
                            options={{
                                morning: 'Morning',
                                noon: 'Noon',
                                night: 'Night'
                            }}
                            required="required"
                            requiredText="( required )"
                            {...props}
                        />
                    )}
                </Form.CheckboxGroupController>

                <Form.CheckboxController
                    name="confirmInfo"
                    validators={[
                        validator(
                            value => value === true,
                            "You must confirm your pet's information"
                        )
                    ]}
                >
                    {props => (
                        <Checkbox
                            {...props}
                            required="required"
                            requiredText="( required )"
                            labelText="I confirm that my pet's information is true"
                        />
                    )}
                </Form.CheckboxController>

                <button type="submit">'Save your pet'</button>
            </Fragment>
        )}
    </Form>
);

export default FormsExample;
