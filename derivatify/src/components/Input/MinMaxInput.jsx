/*
Offers onEnter props and get value()
*/

import React from 'react'

import TextField from "@material-ui/core/TextField"

class MinMaxInput extends React.Component{
  constructor(props){
    super()
    this.input = React.createRef()
    this.state = {
      value: 0
    }

  }
  componentDidMount(){
    // Set caps
    if(this.props.max !== null ) this.setState({ max: this.props.max })
    if(this.props.min !== null ) this.setState({ min: this.props.min })
  }

  minmax = temp => {
    let value = temp
    if( this.state.max < value ) value = Math.min(this.state.max, value)
    if( this.state.min > value ) value = Math.max(this.state.min, value)
    return value
  }

  handleInputChange = event => {
    // Dirty code :(
    
    // When removing -8 for example, delete whole number
    if(event.target.value==="-")                          this.setState({value: this.minmax(0)})
    // Allow empty -> value to 0
    if(event.target.value==="")                           this.setState({value: this.minmax(0)})
    // Match any positive or negative integer
    if(event.target.value.match(/^-?[0-9]\d*(\.\d+)?$/))  this.setState({value: this.minmax(parseInt(event.target.value))})
  }

  handleInputDown = event => {
    switch(event.key){
      case "ArrowUp":
        event.preventDefault()
        this.setState({value: this.minmax(this.state.value+1)})
        this.input.current.focus()
        break
      
      case "ArrowDown":
        this.setState({value: this.minmax(this.state.value-1)})
        this.input.current.focus()
        break
      
      case "Enter":
        this.props.onEnter(this.state.value)

      // eslint-disable-next-line no-fallthrough
      default:
        break
    }
  }
  get value(){
    return this.state.value
  }
  render(){
    return (
      <TextField 
        variant="filled"
        onChange={this.handleInputChange}
        onKeyDown={this.handleInputDown}
        value={this.state.value || ""}
        inputProps={{ref: this.input, placeholder: this.props.placeholder, style:{color: "white", fontSize: 15, marginBottom: 15, textAlign: this.props.align ? this.props.align : "left"}  }}
        style={this.props.style ? this.props.style : {}}
      />
    )
  }
}
export default MinMaxInput