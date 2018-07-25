import React, { Fragment } from 'react';
import ErrorBlock from '../../../../src/modules/forms/ErrorBlock';
import {
    Form,
    Input,
    InputController,
    isLongerThan,
    isRequired,
    validator
} from '@tenon-io/tenon-ui';
import React from 'react';

const FormsExample = () => (
    <Form onSubmit={this.onSubmitHandler}>
        {({ formControls, validity }) => (
            <Fragment>
                {!validity ? <ErrorBlock formControls={formControls} /> : null}
                <InputController
                    name="userName"
                    validators={[
                        validator(isRequired, 'A user name is required'),
                        validator(
                            isLongerThan,
                            'The given user name is too short',
                            5
                        )
                    ]}
                >
                    {props => (
                        <Input
                            {...props}
                            required="required"
                            contentHintText="Please enter more than 5 characters"
                            labelText="User name"
                        />
                    )}
                </InputController>
                <InputController
                    name="password"
                    validators={[
                        validator(isRequired, 'A password is required')
                    ]}
                >
                    {props => (
                        <Input
                            {...props}
                            require="required"
                            labelText="Password"
                        />
                    )}
                </InputController>
                <button type="submit" onClick={this.onClickHandler}>
                    'Submit'
                </button>
            </Fragment>
        )}
    </Form>
);

export default FormsExample;
