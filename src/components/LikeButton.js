import React,{ useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button,Icon,Label } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

import MyPopup from '../util/MyPopup';

export default function LikeButton({ user, post:{id,likeCount,likes} }) {
    const [liked, setLiked] = useState(false)
    
    useEffect(()=>{
        if(user && likes.find(like=>like.username === user.username)){
            setLiked(true)
        } else setLiked(false)
        },[user,likes]);
    
        const [likePost] = useMutation(LIKE_POST_MUTATION,{
            variables:{ postId:id }
        });

    const likeButton = user ? (
        liked ? (
            <MyPopup
                content="Unlike post"
                children={(
                    <Button color='teal' onClick={likePost}>
                        <Icon name='heart'/>
                    </Button>
                )}/>
            
        ) : (
            
            <MyPopup
                content="Like post"
                >
                    <Button color='teal' basic onClick={likePost}>
                        <Icon name='heart'/>
                    </Button>

                </MyPopup>
        )
    ) : (
        <MyPopup
        content="Login to like Post"
        >
            <Button as={Link} to='/login' color='teal' basic>
                <Icon name='heart'/>
            </Button>
        </MyPopup>
        
    )
    
    
    
    return (
        <Button as='div' labelPosition='right'>
                    {likeButton}
                <Label basic color='blue' pointing='left'>
                    {likeCount}
                </Label>
        </Button>
        
    )
}


const LIKE_POST_MUTATION = gql`
mutation likePost($postId:ID!){
    likePost(postId:$postId){
        id 
        likes {
            id username
        }
        likeCount
        
    }

}
`;

