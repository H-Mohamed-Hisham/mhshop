import React, { useEffect } from 'react'
import { Row, Col, Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import { Link } from 'react-router-dom'

// * Components
import Message from '../../components/Message'
import Loader from '../../components/Loader'
import FormContainer from '../../components/FormContainer'

// * Actions
import { fetchUserDetail } from './../../actions/userAction'

const ProfilePage = ({ history }) => {
  const dispatch = useDispatch()

  const userDetail = useSelector((state) => state.userDetail)
  const { loading, error, user } = userDetail

  useEffect(() => {
    dispatch(fetchUserDetail())
  }, [dispatch])

  useEffect(() => {
    if (user === null) {
      setTimeout(() => {
        history.push('/signin')
      }, 5000)
    }
  }, [history, user])

  return (
    <FormContainer>
      <h3 className='pb-3'>Profile</h3>
      {loading && <Loader />}
      {user === null && !loading && error && <Message>{error}</Message>}
      {user !== null && !loading && (
        <>
          <Card className='my-3 p-3 rounded'>
            <Card.Body>
              <Card.Title>Name:</Card.Title>
              <Card.Text>{user.name}</Card.Text>

              <Card.Title>Email: </Card.Title>
              <Card.Text>{user.email}</Card.Text>

              <Card.Title>Account Created On:</Card.Title>
              <Card.Text>
                {moment(user.createdAt).format('dddd, MMMM Do YYYY')}
              </Card.Text>
            </Card.Body>
          </Card>
          <Row>
            <Col md={4}>
              <Link
                className='btn btn-dark btn-sm my-3'
                to='/user/profile/edit'
              >
                Edit Profile
              </Link>
            </Col>
            <Col md={4}>
              <Link
                className='btn btn-dark btn-sm my-3'
                to='/user/password/edit'
              >
                Change Password
              </Link>
            </Col>
          </Row>
        </>
      )}
    </FormContainer>
  )
}

export default ProfilePage
