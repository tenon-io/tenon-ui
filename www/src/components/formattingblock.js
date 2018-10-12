<Form
    onSubmit={submitData => {
        alert(JSON.stringyfy(submitData));
    }}
>
    {({ formControls }) => (
        <Form.TextInputController
            name="petName"
            required="true"
            validators={[
                validator(isRequired, 'A name is required for your pet')
            ]}
        >
            {props => (
                <Input
                    {...props}
                    requiredText="( required )"
                    labelText="Pet type"
                />
            )}
        </Form.TextInputController>
    )}
</Form>;
