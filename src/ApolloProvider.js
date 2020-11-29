import React from 'react';
import App from './App';
import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { ApolloProvider } from '@apollo/react-hooks';
import { setContext } from 'apollo-link-context';


const httpLink = createHttpLink({
    uri: 'http://localhost:5000'
})

const authLink = setContext(()=>{
    const token = localStorage.getItem('jwtToken');
    return {
        headers:{
            Authorization: token ? `Bearer ${token}`:''
        }
    }
})


let cache = new InMemoryCache()
const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache
})



export default (
    <ApolloProvider client={client}>
        <App/>
    </ApolloProvider>
)