import React, { Component, createRef, Fragment } from 'react';
import Form from '../../../src/modules/forms/tenonForm/Form';
import Input from '../../../src/modules/forms/tenonForm/Input';
import Textarea from '../../../src/modules/forms/tenonForm/Textarea';
import Select from '../../../src/modules/forms/tenonForm/Select';
import Checkbox from '../../../src/modules/forms/tenonForm/Checkbox';
import CheckboxGroup from '../../../src/modules/forms/tenonForm/CheckboxGroup';
import RadioGroup from '../../../src/modules/forms/tenonForm/RadioGroup';
import ErrorBlock from '../../../src/modules/forms/ErrorBlock';

import { validator } from '../../../src/modules/utils/helpers/validationHelpers';
import {
    isRequired,
    isLongerThan
} from '../../../src/modules/utils/data/validation';

class DemoForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            formData: {}
        };

        this.errorBlockRef = createRef();
    }

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
        return (
            <Form
                onSubmit={this.onSubmitHandler}
                onRawSubmit={this.onRawSubmitHandler}
            >
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
                                validator(
                                    isRequired,
                                    'A type of pet is required'
                                )
                            ]}
                            requiredText="( required )"
                            labelText="Type of pet"
                            component={Input}
                        />
                        <Form.TextareaController
                            name="petDescription"
                            rows="10"
                            labelText="Type of pet"
                            component={Textarea}
                        />
                        <Form.SelectController
                            name="petWeight"
                            required="true"
                            validators={[
                                validator(
                                    isRequired,
                                    'Please select a weight category'
                                )
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
    }
}

export default DemoForm;
