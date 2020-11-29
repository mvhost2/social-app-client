import React,{ useState } from 'react';

import { Button,Confirm, Icon } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

import { FETCH_POSTS_QUERY } from '../util/graphql';
import MyPopup from '../util/MyPopup'

export default function DeleteButton({ postId, commentId, callback }) {
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [deletePost] = useMutation(DELETE_POST_MUTATION,{
        update(proxy){
            setConfirmOpen(false);
            const data = proxy.readQuery({
                query:FETCH_POSTS_QUERY
            })
            const newPostList  = data.getPosts.filter(p=>p.id !== postId)
            proxy.writeQuery({ query:FETCH_POSTS_QUERY, data:{ getPosts:newPostList}});
            if(callback) callback();
        },
        variables:{ postId }
    })

    const [deleteComment] = useMutation(DELETE_COMMENT_MUTATION,
        {
            variables:{ postId, commentId }
        }
        )
        
    
    

    return (
        <>
        <MyPopup  content={commentId? "Delete comment" : "Delete post"}
                
                children={
                    (<Button as='div' 
                        color="red"
                        floated="right"
                        onClick={()=> setConfirmOpen(true)}
                     >
                        <Icon name="trash" style = {{ margin:0 }}/>             
                    </Button>)
                }/>
        
        <Confirm
            open={confirmOpen}
            onCancel={()=>setConfirmOpen(false)}
            onConfirm={commentId ? deleteComment : deletePost}
        />
        </>

    )
}

const DELETE_POST_MUTATION = gql`
    mutation deletePost($postId:ID!){
        deletePost(postId:$postId)
    }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      comments {
        id
        username
        createdAt
        body
      }
      commentCount
    }
  }
`;

