import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { RouteTransition } from 'react-router-transition';
import * as BooksAPI from './utils/BooksAPI'
import Shelf from './Shelf'
import BookInfo from './BookInfo'
import SearchBooks from './SearchBooks'
import './App.css'

class BooksApp extends Component {
  state = {
    books: [],
    shelves: [],
    myBooks: [],
    focused: ''
  }

  constructor() {
    super()

    this.getBooks = this.getBooks.bind(this)
    this.onChangeShelf = this.onChangeShelf.bind(this)
  }

  componentDidMount() {
    this.getBooks()
  }

  getBooks() {
    BooksAPI.getAll().then(books => {
      const { focused } = this.state
      const shelves = books.reduce((shelf, book) => {
        if (!shelf[book.shelf]) shelf[book.shelf] = []
        book.selected = book.id === focused
        shelf[book.shelf].push(book)
        return shelf
      },[])

      const myBooks = books.reduce((shelf, book) => {
        shelf.push({
          id: book.id,
          shelf: book.shelf
        })
        return shelf
      },[])

      this.setState({ books, shelves, myBooks })
    })
  }

  onChangeShelf(list, book) {
    BooksAPI.update(book, list).then(this.getBooks)
  }

  render() {
    const { shelves, myBooks } = this.state

    return (
      <div className="app">
        <Route render={({location, history, match}) => (
          <RouteTransition
            pathname={location.pathname}
            atEnter={{ opacity: 0 }}
            atLeave={{ opacity: 0 }}
            atActive={{ opacity: 1 }}
            mapStyles={styles => ({
              opacity: `${styles.opacity}`,
              position: `absolute`,
              top: 0
            })}
          >
            <Route exact path='/' render={() => (
              <Shelf shelves={shelves} myBooks={myBooks} onChangeShelf={this.onChangeShelf} />
            )}/>
            <Route path='/search' render={({ history }) => (
              <SearchBooks myBooks={myBooks} onChangeShelf={this.onChangeShelf} />
            )}/>
            <Route path='/book/:bookId' component={BookInfo} />
          </RouteTransition>
        )} />
      </div>
    )
  }
}

export default BooksApp
