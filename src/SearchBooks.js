import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { throttle } from 'lodash'
import * as BooksAPI from './utils/BooksAPI'
import ListBooks from './ListBooks'
import './SearchBooks.css'

class SearchBooks extends Component {
  state = {
    query: '',
    searching: false,
    books: []
  }

  constructor() {
    super()

    this.updateQuery = this.updateQuery.bind(this)
  }

  componentWillMount() {
    this.searchQuery = throttle(this.searchQuery, 100)
  }

  componentDidMount() {
    this.searchInput.focus()
  }

  updateQuery(query) {
    this.setState({ query, searching: true })
    this.searchQuery(query)
  }

  searchQuery(query) {
    if (!query.length) {
      return
    }
    BooksAPI.search(query.toLowerCase().trim(), 10)
      .then(results => {
        const books = results.error ? [] : results
        this.setState({ books, searching: false })
      })
  }

  clearQuery() {
    this.setState({ query: '', books: [] })
    this.searchInput.focus()
  }

  render() {
    const { query, searching, books } = this.state
    const { myBooks, onChangeShelf } = this.props
    const disabled = !query.length > 0

    return (
      <div className="search-books">
        <div className="search-books-bar">
          <Link
            to="/"
            className="close-search"
          >Close</Link>
          <div className={classnames("search-books-input-wrapper", { placeholder: disabled })}>
            <input
              className="search-books-input"
              type="text"
              placeholder="Search by title or author"
              value={query}
              ref={(input) => { this.searchInput = input }}
              onChange={(event) => this.updateQuery(event.target.value)}
              required={true}
            />
          </div>
          <button
            className={classnames("clear-query-button", { disabled: disabled })}
            title="Clear"
            onClick={this.clearQuery.bind(this)}
            disabled={disabled}
          >
            <span className="close-icon" />
          </button>
        </div>
        <div className={classnames('search-books-results', { 'has-results': books.length })}>
          {!searching && query.length > 0 && books.length === 0 && (
            <h4>No results for &rsquo;<strong>{query}</strong>&rsquo;</h4>
          )}
          <ListBooks
            books={books}
            myBooks={myBooks}
            onChangeShelf={onChangeShelf}
          />
        </div>
      </div>
    )
  }
}

SearchBooks.propTypes = {
  myBooks: PropTypes.array,
  onChangeShelf: PropTypes.func
}

SearchBooks.defaultProps = {
  myBooks: [],
  onChangeShelf: () => {}
}

export default SearchBooks
