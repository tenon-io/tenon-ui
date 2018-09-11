import React, { Fragment } from 'react';
import ErrorBlock from '../../../../src/modules/forms/ErrorBlock';
import {
    Form,
    Input,
    InputController,
    isLongerThan,
    isRequired,
    TextArea,
    Select,
    RadioGroup,
    validator
} from '@tenon-io/tenon-ui';

const FormsExample = () => (
    <Form onSubmit={this.onSubmitHandler}>
        {({ formControls, validity, hasSubmitted }) => (
            <Fragment>
                {!validity && hasSubmitted ? (
                    <ErrorBlock formControls={formControls} />
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
                            options={{
                                option1: 'Option 1',
                                option2: 'Option 2',
                                option3: 'Option 3'
                            }}
                        />
                    )}
                </Form.RadioGroupController>

                <button type="submit">'Save your pet'</button>
            </Fragment>
        )}
    </Form>
);

export default FormsExample;
