import React, { Component } from 'react'
import PropTypes from 'prop-types'
import sortBy from 'sort-by'
import Config from './utils/Config'
import Book from './Book'
import './ListBooks.css'

class ListBooks extends Component {

  onChangeShelf(myShelf, book) {
    const { onChangeShelf } = this.props
    onChangeShelf(myShelf, book)
  }

  render() {
    const { shelf, books, myBooks, shelfLabel } = this.props
    const shelfOptions = Config.shelfOptions || []

    books.sort(sortBy('title'))

    return (
      <div className="list-books">
        {shelf &&
          <h2>{shelfOptions.find(item => (item.value === shelf)).label || 'none'}</h2>
        }
        <ol className="books-grid">
          {books.map(book => (
            <Book
              key={book.id}
              book={book}
              myBooks={myBooks}
              shelfLabel={shelfLabel}
              onChangeShelf={this.onChangeShelf.bind(this)}
            />
          ))}
        </ol>
      </div>
    )
  }
}

ListBooks.propTypes = {
  shelf: PropTypes.string,
  books: PropTypes.array.isRequired,
  myBooks: PropTypes.array,
  onChangeShelf: PropTypes.func,
  shelfLabel: PropTypes.bool
}

ListBooks.defaultProps = {
  shelf: '',
  books: {},
  myBooks: [],
  onChangeShelf: function() {},
  shelfLabel: true
}

export default ListBooks
