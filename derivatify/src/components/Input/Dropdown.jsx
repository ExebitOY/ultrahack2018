/*
Essentially a dropdown menuitem with working styles
Offers get value() and onChange in props
*/


import React from 'react'

import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"
import Button from "@material-ui/core/Button"

class Dropdown extends React.Component{
  constructor(props){
    super()

    this.state = {
      value: "",
      values: [],
      openMenu: null
    }
  }
  componentDidMount(){
    // Get menu items from props
    this.setState({
      value: this.props.values[0],
      values: this.props.values
    })
  }

  handleMenuClick = event => {
    // Open menu
    this.setState({ openMenu: event.currentTarget });
  }

  setValue = field => event => {
    // Sets clicked field to the right one
    const prev = this.state.field
    this.setState({
      value: field,
      openMenu: null
    })
    if(prev !== field)
      this.props.onChange(field)
  }

  get value(){
    return this.state.value
  }

  render(){
    return (
      <div>
        <Button
          aria-owns={this.state.openMenu ? 'simple-menu' : undefined}
          aria-haspopup="true"
          onClick={this.handleMenuClick}
          style={{marginBottom: "45px", color: "rgba(255,255,255,0.8)"}}
        >
          {this.state.value}
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={this.state.openMenu}
          open={Boolean(this.state.openMenu)}
          onClose={this.handleClose}
        >
          {this.state.values.map(value => (
            <MenuItem onClick={this.setValue(value)}>{value}</MenuItem>
          ))}
        </Menu>
      </div>
    )
  }
}

export default Dropdown