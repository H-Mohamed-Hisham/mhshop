import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Carousel, Image } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'

// * Components
import Loader from './Loader'
import Message from './Message'

// * Actions
import { fetchTopRatedProducts } from '../actions/productAction'

// * CSS
import '../css/carouselstyle.css'

const ProductCarousel = () => {
  const dispatch = useDispatch()

  const topRatedProduct = useSelector((state) => state.topRatedProduct)
  const { loading, error, products } = topRatedProduct

  useEffect(() => {
    dispatch(fetchTopRatedProducts())
  }, [dispatch])

  return loading ? (
    <Loader className='mb-3 mt-5' />
  ) : error ? (
    <Message variant='danger'>{error}</Message>
  ) : (
    <Carousel pause='hover' className='bg-dark mb-4'>
      {products.map((product) => (
        <Carousel.Item key={product._id}>
          <Link to={`/product/${product._id}`}>
            <Image src={product.image} alt={product.name} fluid />
            <Carousel.Caption className='carousel-caption'>
              <h4>
                {product.name} (₹{product.price})
              </h4>
            </Carousel.Caption>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  )
}

export default ProductCarousel
