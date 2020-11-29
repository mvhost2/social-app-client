import React,{ useContext, useState } from 'react'
//import { useForm } from '../util/hooks';
import { Button,Form } from "semantic-ui-react";
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { AuthContext } from '../context/auth';

function Login(props) {
    const context = useContext(AuthContext)
    const [errors, setErrors] = useState({})
    
    const [values, setValues] = useState({
        username:'', 
        password:'',
               
    })
    const onChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value});
    }
    
    const [loginUser, { loading }] = useMutation(LOGIN_USER, {
        update(_, { data: { login: userData }}){//pass this option to useMutation to update cache
            context.login(userData)
            props.history.push('/');//use this to redirect after successful new user registry
        },
        onError(err){//pass the onError option to useMutation to execute this callback in case of error.
            setErrors(err.graphQLErrors[0].extensions.exception.errors);
        },
        variables: values
    });

    const onSubmit = (event) =>{
        event.preventDefault();
        loginUser();

    }

    
    return (
        <div className="form-container">
            <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ''}>
                <h1>Login</h1>
                <Form.Input
                    label="Username"
                    placeholder="Username.."
                    name="username"
                    type="text"
                    value={values.username}
                    error={errors.username ? true : false}
                    onChange={onChange}
                />
                
                <Form.Input
                    label="Password"
                    placeholder="Password.."
                    name="password"
                    type="password"
                    value={values.password}
                    error={errors.password ? true :false}
                    onChange={onChange}
                />
                
                <Button type="submit" primary>Login</Button>
            </Form>
            {Object.keys(errors).length > 0 && (
                 <div className="ui error message">
                    <ul className="list">
                        {Object.values(errors).map(value=>(
                            <li key={value}>{value}</li>
                        ))}
                    </ul>
                </div>
            )}
            
        </div>
    )
}

const LOGIN_USER = gql`
    mutation login(
        $username:String!        
        $password:String!        
    ){
        login( 
                username:$username                
                password:$password                
            
        ) {
            id email username createdAt token
        }
    }
`;


export default Login;