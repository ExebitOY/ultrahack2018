import React from 'react'

import TextField from "@material-ui/core/TextField"
import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"
import Button from "@material-ui/core/Button"


class Search extends React.Component{
  state = {
    search: {
      underlyingName: "",
      subtype: "Long/Short",
      fMax: "",
      fMin: "",
      sMax: "",
      sMin: "" 
    },
    searchTypeOpen: null
  }

  search = () => {
    const options = this.state.search
    if(options.subtype === "Long/Short") options.subtype = ""
    this.props.search(options)
  }

  handleInputChange = field => event => {
    const value = event.target.value
    const search = this.state.search
    search[field] = value
    this.setState({search})
    this.search()
  }

  setSearchType = name => event => {
    const search = this.state.search
    search.subtype = name
    this.setState({ search , searchTypeOpen: null });
    this.search()
  };

  handleSearchClick = event => {
    this.setState({ searchTypeOpen: event.currentTarget });
    this.search()
  }

  render(){
    return (
      <div style={{
        position: "fixed",
        top:"20px", 
        zIndex: "1000", 
        width: "82.4%", 
        height: "36px", 
        display:"flex", 
        flexDirection:"row",
        backgroundColor: "rgb(39, 41, 61)",
        borderRadius: "5px"
      }}>
          <div style={{width: "80%"}}> 
            <TextField 
              variant="filled"
              onChange={this.handleInputChange("underlyingName")}
              value={this.state.search.underlyingName || ""}
              inputProps={{ref: this.input, placeholder: "Search", style:{color: "white", fontSize: 15, marginBottom: 15, }}}
              style={{height: "36px",  width:"100%"}}
            />
          </div>
          <div style={{width: "13%"}}> 
            <TextField 
              variant="filled"
              onChange={this.handleInputChange("fMin")}
              value={this.state.search.fMin || ""}
              inputProps={{ref: this.input, placeholder: "Min Financing", style:{color: "white", fontSize: 15, marginBottom: 15, }}}
              style={{height: "36px",  width:"100%"}}
            />
          </div>
          <div style={{width: "15%"}}> 
            <TextField 
              variant="filled"
              onChange={this.handleInputChange("fMax")}
              value={this.state.search.fMax || ""}
              inputProps={{ref: this.input, placeholder: "Max Financing", style:{color: "white", fontSize: 15, marginBottom: 15, }}}
              style={{height: "36px",  width:"100%"}}
            />
          </div>
          <div style={{width: "15%"}}> 
            <TextField 
              variant="filled"
              onChange={this.handleInputChange("sMin")}
              value={this.state.search.sMin || ""}
              inputProps={{ref: this.input, placeholder: "Min Stop", style:{color: "white", fontSize: 15, marginBottom: 15, }}}
              style={{height: "36px",  width:"100%"}}
            />
          </div>
          <div style={{width: "15%"}}> 
            <TextField 
              variant="filled"
              onChange={this.handleInputChange("sMax")}
              value={this.state.search.sMax || ""}
              inputProps={{ref: this.input, placeholder: "Max Stop", style:{color: "white", fontSize: 15, marginBottom: 15, }}}
              style={{height: "36px",  width:"100%"}}
            />
          </div>
          <div style={{width: "10%"}}>
            <Button
              aria-owns={this.state.searchTypeOpen ? 'simple-menu' : undefined}
              aria-haspopup="true"
              onClick={this.handleSearchClick}
              style={{marginBottom: "45px", color: "rgba(255,255,255,0.8)"}}
            >
              {this.state.search.subtype === "" ? "Long/Short" : this.state.search.subtype}
            </Button>
            <Menu
              id="simple-menu"
              anchorEl={this.state.searchTypeOpen}
              open={Boolean(this.state.searchTypeOpen)}
              onClose={this.handleClose}
            >
              <MenuItem onClick={this.setSearchType('Long/Short')}>Long/Short</MenuItem>
              <MenuItem onClick={this.setSearchType('Long')}>Long</MenuItem>
              <MenuItem onClick={this.setSearchType('Short')}>Short</MenuItem>
            </Menu>
          </div>
      </div>
    )
  }
}
export default Search