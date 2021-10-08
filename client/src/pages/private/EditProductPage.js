import React, { useState, useEffect } from 'react'
import { Form, Button, Image } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'

// * Components
import Message from '../../components/Message'
import Loader from '../../components/Loader'
import FormContainer from '../../components/FormContainer'
import GoBack from '../../components/GoBack'

// * Actions
import { privateFetchAllCategory } from '../../actions/categoryAction'

const EditProductPage = ({ match, history }) => {
  const productId = match.params.productId

  const [updateLoading, setUpdateLoading] = useState(false)
  const [updateSuccess, setUpdateSuccess] = useState(null)
  const [updateError, setUpdateError] = useState(null)
  const [updateInputError, setUpdateInputError] = useState({})

  const [imageUploading, setImageUploading] = useState(false)
  const [imageUploadingError, setImageUploadingError] = useState(null)

  const dispatch = useDispatch()

  const privateCategoryList = useSelector((state) => state.privateCategoryList)
  const { categories } = privateCategoryList

  // Product Detail State
  const [productLoading, setProductLoading] = useState(true)
  const [product, setProduct] = useState({})
  const [productError, setProductError] = useState(null)

  // Fetch Product Detail Function
  async function fetchProductDetail(productId) {
    try {
      setProductLoading(true)

      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      }

      const { data } = await axios.get(
        `/api/public/product/${productId}`,
        config
      )

      setProduct(data)

      setProductLoading(false)
    } catch (error) {
      setProductLoading(false)
      setProductError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      )
    }
  }

  // Product Data State
  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const [image, setImage] = useState('')
  const [brand, setBrand] = useState('')
  const [category, setCategory] = useState('')
  const [countInStock, setCountInStock] = useState(0)
  const [description, setDescription] = useState('')

  // Image Upload Function
  const uploadFileHandler = async (e) => {
    e.preventDefault()
    try {
      const file = e.target.files[0]
      const formData = new FormData()
      formData.append('image', file)
      setImageUploading(true)

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }

      const { data } = await axios.post(
        '/api/private/image-upload',
        formData,
        config
      )

      if (data.uploadSuccess) {
        setImageUploading(false)
        setImage(data.uploadSuccess)
      }

      if (data.uploadError) {
        setImageUploading(false)
        setImageUploadingError(data.uploadError)
      }
    } catch (error) {
      setImageUploading(false)
      setImageUploadingError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      )
    }
  }

  // Update Product Function
  async function updateProduct(productData) {
    const { name, brand, price, description, countInStock, category, image } =
      productData

    setUpdateLoading(true)
    setUpdateError(null)
    setUpdateInputError({})

    const userToken = localStorage.getItem('mhshop')

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
    }

    const { data } = await axios.put(
      `/api/private/product/update-product/${productId}`,
      { name, brand, price, description, countInStock, category, image },
      config
    )

    if (data.inputError) {
      setUpdateLoading(false)
      setUpdateInputError(data.inputError)
    }

    if (data.error) {
      setUpdateLoading(false)
      setUpdateError(data.error)
    }

    if (data.product) {
      setUpdateLoading(false)
      setUpdateSuccess(data.message)
      dispatch(privateFetchAllCategory())
      fetchProductDetail(productId)
    }
  }

  // UseEffect
  useEffect(() => {
    if (!product || product._id !== productId) {
      dispatch(privateFetchAllCategory())
      fetchProductDetail(productId)
    } else {
      setName(product.name)
      setPrice(product.price)
      setImage(product.image)
      setBrand(product.brand)
      setCategory(product.category._id)
      setCountInStock(product.countInStock)
      setDescription(product.description)
    }
  }, [dispatch, product, productId])

  const handleSubmit = (e) => {
    e.preventDefault()
    setUpdateInputError({})
    setUpdateError(null)
    updateProduct({
      _id: productId,
      name: name,
      price: price,
      image: image,
      brand: brand,
      category: category,
      countInStock: countInStock,
      description: description,
    })
  }

  return (
    <>
      <FormContainer>
        {productLoading && <Loader />}
        {!productLoading && !updateLoading && updateSuccess !== null && (
          <Message variant='success'>{updateSuccess}</Message>
        )}
        {!productLoading && productError && <Message>{productError}</Message>}
        {!updateLoading && updateError && <Message>{updateError}</Message>}
        {!productLoading && product && (
          <>
            <div className='d-flex'>
              <GoBack to='/admin/products' />
              <h3>Edit Product</h3>
            </div>

            <p className='text-uppercase text-info my-4'>
              Product ID : {product._id}
            </p>
            <Form onSubmit={handleSubmit} noValidate>
              <Form.Group controlId='name'>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type='name'
                  placeholder='Enter Name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  isInvalid={updateInputError.name ? true : false}
                ></Form.Control>
                {updateInputError.name && (
                  <div className='invalid-feedback'>
                    {updateInputError.name}
                  </div>
                )}
              </Form.Group>
              <Form.Group controlId='price'>
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type='number'
                  placeholder='Enter Price'
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  isInvalid={updateInputError.price ? true : false}
                ></Form.Control>

                {updateInputError.price && (
                  <div className='invalid-feedback'>
                    {updateInputError.price}
                  </div>
                )}
              </Form.Group>
              <Form.Group controlId='brand'>
                <Form.Label>Brand</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter Brand'
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  isInvalid={updateInputError.brand ? true : false}
                ></Form.Control>

                {updateInputError.brand && (
                  <div className='invalid-feedback'>
                    {updateInputError.brand}
                  </div>
                )}
              </Form.Group>
              <Form.Group controlId='countInStock'>
                <Form.Label>Count In Stock</Form.Label>
                <Form.Control
                  type='number'
                  placeholder='Enter Count In Stock'
                  value={countInStock}
                  onChange={(e) => setCountInStock(e.target.value)}
                  isInvalid={updateInputError.countInStock ? true : false}
                ></Form.Control>

                {updateInputError.countInStock && (
                  <div className='invalid-feedback'>
                    {updateInputError.countInStock}
                  </div>
                )}
              </Form.Group>
              <Form.Group controlId='category'>
                <Form.Label>Category</Form.Label>
                <Form.Control
                  as='select'
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name}
                    </option>
                  ))}
                </Form.Control>
                {updateInputError.category && (
                  <div className='invalid-feedback'>
                    {updateInputError.category}
                  </div>
                )}
              </Form.Group>
              <Form.Group controlId='description'>
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter Description'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  isInvalid={updateInputError.description ? true : false}
                ></Form.Control>

                {updateInputError.description && (
                  <div className='invalid-feedback'>
                    {updateInputError.description}
                  </div>
                )}
              </Form.Group>
              <Form.Group controlId='image'>
                <Form.Label>Image</Form.Label>
                {/* <Form.File
                  id='image-file'
                  label='Choose File'
                  custom
                  onChange={uploadFileHandler}
                /> */}
                <Form.Control type='file' onChange={uploadFileHandler} />
                {imageUploading && <Loader />}
                {imageUploadingError !== null && (
                  <Message className='my-2'>{imageUploadingError}</Message>
                )}
                <Form.Text className='text-muted my-2'>Image Path:</Form.Text>
                <Form.Text className='text-muted my-2 text-break'>
                  <kbd>{`${image}`}</kbd>
                </Form.Text>
                <Form.Text className='text-muted my-2'>
                  Image Preview:
                </Form.Text>
                <Image
                  src={`${image}`}
                  rounded
                  className='my-2'
                  style={{ width: '100%' }}
                />
              </Form.Group>
              <Button type='submit' variant='primary' className='my-4'>
                Update
              </Button>
            </Form>
          </>
        )}
      </FormContainer>
    </>
  )
}

export default EditProductPage
