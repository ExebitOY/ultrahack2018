import React from "react";

import holdingsApi from "api/holdings"

import Derivative from "components/Derivative/Derivative.jsx"

import GridList from "@material-ui/core/GridList"

import Search from "../components/Search/Search";

import CircularProgress from '@material-ui/core/CircularProgress';


class Dashboard extends React.Component {
  state = {
    derivatives: [],
    dataReceived: false
  }
  componentDidMount() {
    // Lol search, same as in buy. It has it's own api-endpoint, but it's just a demo :))
    holdingsApi.getFutures({})
      .then(data => this.setState({ dataReceived: true, derivatives: data }))
  }

  search = (options) => {
    // Activate loading circle
    this.setState({ dataReceived: false })

    // Do api call and then set new data
    holdingsApi.getFutures(options)
      .then(data => this.setState({ dataReceived: true, derivatives: data }))
  }

  render() {
    // Search bar and loader needs to be rendered, thus as element
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
              {this.state.derivatives.map(data => (<Derivative key={data.id} derivative={data} mode={"sell"}/>))}
            </GridList>
          </div>
        </div>
      </>
    );

  }
}

export default Dashboard;