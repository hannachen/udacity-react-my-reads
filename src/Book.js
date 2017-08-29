import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Dropdown, { DropdownTrigger, DropdownContent } from 'react-simple-dropdown'
import { RadioGroup, Radio } from 'react-radio-group'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import Config from './utils/Config'
import 'react-simple-dropdown/styles/Dropdown.css'
import './Book.css'

class Book extends Component {
  state = {
    rollover: false,
    openSelect: false,
    myShelf: 'none'
  }

  constructor() {
    super()

    this.onMouseEnter = this.onMouseEnter.bind(this)
    this.onMouseLeave = this.onMouseLeave.bind(this)
    this.onClick = this.onClick.bind(this)
    this.onOpenShelf = this.onOpenShelf.bind(this)
    this.onCloseShelf = this.onCloseShelf.bind(this)
    this.onChangeShelf = this.onChangeShelf.bind(this)
  }

  componentDidMount() {
    const { book, myBooks, openSelect } = this.props
    const shelf = myBooks.filter(myBook => myBook.id === book.id).shift() || []
    const myShelf = shelf.shelf || 'none'
    this.setState({ openSelect, myShelf })
  }

  onMouseEnter() {
    this.setState({ rollover: true })
  }

  onMouseLeave() {
    this.setState({ rollover: false })
  }

  onClick() {
    this.setState({ rollover: false })
  }

  onOpenShelf() {
    this.setState({ openSelect: true })
  }

  onCloseShelf() {
    this.setState({ openSelect: false })
  }

  onChangeShelf(myShelf) {
    const { book, onChangeShelf } = this.props
    onChangeShelf(myShelf, book)
    this.setState({ myShelf })
    this.shelfDropdown.hide()
  }

  render() {
    const { book, shelfLabel } = this.props
    const { openSelect, myShelf } = this.state
    const groupName = 'book_' + book.id
    const shelfOptions = Config.shelfOptions || []

    return (
      <li>
        <div className="book">
          <div className="book-top">
            <Link to={'/book/'+(book.id)} className={classnames("book-cover-wrapper", { 'no-cover': !book.imageLinks || !book.imageLinks.thumbnail })}>
              <img
                className="book-cover"
                src={(book.imageLinks && book.imageLinks.thumbnail) || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'}
                alt="cover"
                onMouseEnter={this.onMouseEnter}
                onClick={this.onClick.bind}
              />
              {shelfLabel && myShelf !== 'none' && (
                <div className="shelf-label">
                  <span>{shelfOptions.find(item => (item.value === myShelf)).label || 'none'}</span>
                </div>
              )}
            </Link>
            <Dropdown
              ref={dropdown => { this.shelfDropdown = dropdown }}
              onShow={this.onOpenShelf}
              onHide={this.onCloseShelf}
            >
              <DropdownTrigger className={classnames('book-shelf-changer-toggle', { open: openSelect })} />
              <DropdownContent>
                <RadioGroup
                  className="book-shelf-changer"
                  name={groupName}
                  Component="ul"
                  selectedValue={myShelf}
                >
                  {Config.shelfOptions.map(shelf => {
                    if (shelf.value === "none"  && myShelf === 'none') {
                      return false
                    }
                    return (
                      <li className="option" key={shelf.value}>
                        <Radio
                          id={groupName + shelf.value}
                          value={shelf.value}
                          checked={shelf.value === myShelf}
                          onChange={event => this.onChangeShelf(event.target.value)}
                        />
                        <label htmlFor={groupName + shelf.value} className={shelf.value === myShelf ? 'selected' : ''}>{shelf.label}</label>
                      </li>
                    )
                  })}
                </RadioGroup>
              </DropdownContent>
            </Dropdown>
          </div>
          <div className="book-title">{book.title}</div>
          <div className="book-authors">{book.author || book.authors}</div>
        </div>
      </li>
    )
  }
}

Book.propTypes = {
  book: PropTypes.object.isRequired,
  myBooks: PropTypes.array,
  shelfLabel: PropTypes.bool,
  onChangeShelf: PropTypes.func
}

Book.defaultProps = {
  book: {},
  myBooks: [],
  shelfLabel: true,
  onChangeShelf: () => {}
}

export default Book
