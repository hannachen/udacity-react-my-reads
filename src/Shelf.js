import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import ListBooks from './ListBooks'
import './Shelf.css'

class Shelf extends Component {

  render() {
    const { shelves, myBooks, onChangeShelf } = this.props

    return (<div className="bookshelf">
      <div className="list-books-title">
        <h1>My Reads</h1>
      </div>
      { Object.keys(shelves).map(shelf => (
        <ListBooks
          key={shelf}
          shelf={shelf}
          books={shelves[shelf]}
          myBooks={myBooks}
          onChangeShelf={onChangeShelf}
          shelfLabel={false}
        />
      )) }
      <div className="open-search">
        <Link to="/search">Add a book</Link>
      </div>
    </div>)
  }
}

ListBooks.propTypes = {
  shelves: PropTypes.array.isRequired,
  myBooks: PropTypes.array,
  onChangeShelf: PropTypes.func
}

ListBooks.defaultProps = {
  shelves: [],
  myBooks: [],
  onChangeShelf: function() {}
}

export default Shelf
