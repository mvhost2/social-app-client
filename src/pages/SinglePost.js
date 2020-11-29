import React,{ useContext,useState } from 'react'

import { useQuery } from '@apollo/react-hooks';
import { FETCH_POST_QUERY } from '../util/graphql';
import { Button,Card,Form,Grid,Icon,Image,Label,TextArea } from 'semantic-ui-react';
import moment from 'moment';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import {AuthContext} from '../context/auth'
import LikeButton from '../components/LikeButton';
import DeleteButton from '../components/DeleteButton';
import { useForm } from '../util/hooks';
import MyPopup from '../util/MyPopup';

function  SinglePost(props) {
    const postId = props.match.params.postId;
    const { user } = useContext(AuthContext);
    const [commentBox, setCommentBox] = useState(false);
    const { values,onChange,onSubmit } = useForm(createCommentCallback,{
        postId,        
        body:''
    })
    const [createComment, { error }] = useMutation(CREATE_COMMENT_MUTATION, {
        variables:values,
        update(proxy,result){
            values.body='';
            setCommentBox(false);
            
        },onError(err){
            console.log(err.graphQLErrors[0].message);
        }
    })
    const { 
        data: { getPost } ={}
      } = useQuery(FETCH_POST_QUERY, {
        variables: {
          postId
        }
      });
    
      function deletePostCallback(){
          props.history.push('/')
      }
      function createCommentCallback(){
        createComment();
      }
    let postMarkup;
    if(!getPost){        
        postMarkup = <p>Loading post...</p>
    } else {
        const {
            id,
            body,
            createdAt,
            username,
            comments,
            likes,
            likeCount,
            commentCount
          } = getPost;
      

        postMarkup = (
            <Grid>
                
                <Grid.Row>
                    <Grid.Column width={2}>
                        <Image 
                            src='https://react.semantic-ui.com/images/avatar/large/molly.png'
                            size="small"
                            float="right"
                        />
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Card fluid>
                            <Card.Content>
                                <Card.Header>{username}</Card.Header>
                                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                                <Card.Description>{body}</Card.Description>
                            </Card.Content>
                            <hr/>
                            <Card.Content extra>
                                <LikeButton user={user} post = {{ id, likeCount, likes }}/>
                                
                                <MyPopup content={"Comment on Post"}>
                                <Button 
                                    as="div"
                                    labelPosition="right"
                                    
                                    onClick={!commentBox ? ()=>setCommentBox(true) : ()=>setCommentBox(false) }
                                >
                                    <Button basic color="blue">
                                        <Icon name = 'comments'/>
                                    </Button>
                                    <Label basic color="blue" pointing="left">
                                        {commentCount}
                                    </Label>
                                </Button>
                                </MyPopup>
                                { user && user.username === username && (
                                    <DeleteButton postId = {id} callback={deletePostCallback}/>
                                )}
                                {user && commentBox && (
                                    <Form style={{marginTop:10}} onSubmit={onSubmit}>
                                        <TextArea 
                                        placeholder="Leave a Comment"
                                        name="body"
                                        onChange={onChange}
                                        value={values.body}
                                        
                                        />
                                        <Button 
                                        style={{marginTop:10}}
                                        type="submit" color='teal'>
                                            Submit
                                        </Button>

                                    </Form>

                                     
                                )}
                                { error && (
                                        <div className="ui error message">
                                            <ul>
                                                <li>{error.graphQLErrors[0].message}</li>
                                            </ul>
                                        </div>
                                    ) }
                               
                            </Card.Content>
                        </Card>
                        {comments.map(comment=>(
                            <Card fluid key={comment.id}>
                                <Card.Content>
                                    {user && user.username === comment.username && (
                                        <DeleteButton postId={id} commentId={comment.id}/>
                                    )}
                                    <Card.Header>{comment.username}</Card.Header>
                                    <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                                    <Card.Description>{comment.body}</Card.Description>
                                </Card.Content>
                            </Card>
                        ))}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
    
    
    return postMarkup;
}

const CREATE_COMMENT_MUTATION = gql`
    mutation createComment($postId:String! $body:String!){
        createComment(postId:$postId, body:$body){
            id
            comments{
                id createdAt username body
            }
        }

    }
`;

export default SinglePost