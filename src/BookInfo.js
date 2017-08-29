import React, { Component } from 'react'
import classnames from 'classnames'
import * as BooksAPI from './utils/BooksAPI'
import 'react-simple-dropdown/styles/Dropdown.css'
import './BookInfo.css'

class BookInfo extends Component {
  state = {
    book: {}
  }

  constructor() {
    super()

    this.getBook = this.getBook.bind(this)
  }

  componentDidMount() {
    const { bookId } = this.props.match.params
    this.getBook(bookId)
  }

  getBook(bookId) {
    BooksAPI.get(bookId).then(book => {
      this.setState({ book })
    })
  }

  render() {
    const { book } = this.state
    const authors = book.author || book.authors || []

    return (
      <div className="book-info">
        <div className="book-top">
          <div className={classnames("book-cover-wrapper", { 'no-cover': !book.imageLinks || !book.imageLinks.thumbnail })}>
            <img
              className="book-cover"
              src={(book.imageLinks && book.imageLinks.thumbnail) || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'}
              alt="cover"
            />
          </div>
        </div>
        <div className="book-details">
          <div className="book-title">{book.title}</div>
          <ul className="book-authors">{authors.map((author, index) => (
            <li key={index} className="author">{author}</li>
          ))}</ul>
          <div className="book-description">
            <p>{book.description}</p>
          </div>
        </div>
      </div>
    )
  }
}

export default BookInfo
