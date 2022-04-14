import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Header from '../Header'

import './index.css'

const apiStatusConstant = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Home extends Component {
  state = {
    updatedData: [],
    apiStatus: apiStatusConstant.initial,
  }

  componentDidMount() {
    this.getData()
  }

  apiSuccess = data => {
    const newData = data.courses.map(item => ({
      id: item.id,
      name: item.name,
      imageUrl: item.logo_url,
    }))
    this.setState({
      updatedData: newData,
      apiStatus: apiStatusConstant.success,
    })
  }

  apiFailure = () => {
    this.setState({apiStatus: apiStatusConstant.failure})
  }

  getData = async () => {
    this.setState({
      apiStatus: apiStatusConstant.inProgress,
    })
    const url = 'https://apis.ccbp.in/te/courses'

    const options = {
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      this.apiSuccess(data)
    } else {
      this.apiFailure()
    }
  }

  renderSuccessView = () => {
    const {updatedData} = this.state

    return (
      <div className="main-container">
        <h1 className="heading">Courses</h1>
        <ul className="items">
          {updatedData.map(eachItem => (
            <Link to={`/courses/${eachItem.id}`}>
              <li className="item-details" key={eachItem.id}>
                <img src={eachItem.imageUrl} alt={eachItem.name} />
                <p className="item">{eachItem.name}</p>
              </li>
            </Link>
          ))}
        </ul>
      </div>
    )
  }

  renderLoadingView = () => (
    <div className="products-details-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="product-details-error-view-container">
      <img
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/tech-era/failure-img.png"
        className="error-view-image"
      />
      <h1 className="product-not-found-heading">Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <Link to="/">
        <button type="button" className="button">
          Retry
        </button>
      </Link>
    </div>
  )

  renderTechEraDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstant.success:
        return this.renderSuccessView()
      case apiStatusConstant.failure:
        return this.renderFailureView()
      case apiStatusConstant.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <Header />
        {this.renderTechEraDetails()}
      </div>
    )
  }
}
export default Home
