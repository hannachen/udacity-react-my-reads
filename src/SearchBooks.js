import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import * as BooksAPI from './utils/BooksAPI'
import ListBooks from './ListBooks'
import './SearchBooks.css'

class SearchBooks extends Component {
  state = {
    query: '',
    searching: false,
    books: []
  }

  componentDidMount() {
    this.searchInput.focus()
  }

  onKeyDown = (event) => {
    if(event.key === 'Enter') {
      this.searchQuery()
    }
  }

  updateQuery(query) {
    this.setState({ query, searching: false })
  }

  searchQuery() {
    const { query } = this.state
    if (!query.length) {
      this.searchInput.focus()
      return
    }
    BooksAPI.search(query.toLowerCase().trim(), 10)
      .then(results => {
        const books = results.error ? [] : results
        this.setState({ books, searching: true })
      })
  }

  clearQuery() {
    this.setState({ query: '', searching: false })
    this.searchInput.focus()
  }

  render() {
    const { books, searching, query } = this.state
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
              onKeyDown={(event) => this.onKeyDown(event)}
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
          <button className="search-books-button" title="Search" type="submit" onClick={this.searchQuery.bind(this)}>
            <span className="search-icon" />
          </button>
        </div>
        <div className={classnames('search-books-results', { 'has-results': books.length })}>
          {searching && query.length > 0 && books.length === 0 && (
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
