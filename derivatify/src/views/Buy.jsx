import React from "react";

import holdingsApi from "api/holdings"

import Derivative from "components/Derivative/Derivative.jsx"

import GridList from "@material-ui/core/GridList"

import Search from "../components/Search/Search";
import CircularProgress from '@material-ui/core/CircularProgress';



class Dashboard extends React.Component {
  state = {
    derivatives: []
  }
  componentDidMount() {
    // Do api search with no criteria -> returns all
    holdingsApi.getFutures({})
      .then(data => this.setState({ dataReceived: true, derivatives: data }))
  }

  search = (options) => {
    // Do api search with serch options
    this.setState({ dataReceived: false })
    holdingsApi.getFutures(options)
      .then(data => this.setState({ dataReceived: true, derivatives: data }))
  }

  render() {
    // Loading bar as element because loadingbar
    const loader = !this.state.dataReceived ? (
      <div className="content" style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
        <CircularProgress/>
      </div>        
    ) : null 

    return (
      <>
        {loader}
        <div className="content">
          <Search search={this.search} />
          <div style={{marginTop: "50px"}}>
            <GridList>
              {this.state.derivatives.map(data => (<Derivative key={data.id} derivative={data} mode={"buy"}/>))}
            </GridList>
          </div>
        </div>
      </>
    );
  }
}

export default Dashboard;