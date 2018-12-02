import React from "react";

import GridList from "@material-ui/core/GridList"
// reactstrap components
import CreateElem from "components/Derivative/Create.jsx"
import Fab from '@material-ui/core/Fab';

import Derivative from "components/Derivative/Derivative.jsx"

import holdingsApi from "api/holdings"

import { Icon } from "@material-ui/core";

import CircularProgress from '@material-ui/core/CircularProgress';


class Create extends React.Component {
  constructor(){
    super()
    this.state = {
      dialog: null, // (<CreateElem />)
      derivatives: []
    }
  }
  componentDidMount() {
    holdingsApi.getFutures({})
      .then(data => this.setState({ dataReceived: true, derivatives: data }))
  }

  render() {
    const style = {
      margin: 0,
      top: 'auto',
      right: 40,
      bottom: 60,
      left: 'auto',
      position: 'fixed',
      zIndex: "100000000"
    };

    if(!this.state.dataReceived) return (
      <div className="content" style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
        <CircularProgress/>
      </div>
    )

    return (
      <>
        <div className="content">
          <Fab style={style} color="primary" onClick={()=>this.state.dialog === null ? this.setState({dialog: (<CreateElem />)}) : null}>
            <Icon>add</Icon>
          </Fab>

          <div>
            {this.state.dialog}
            <GridList>
              {this.state.derivatives.map(data => (<Derivative mode={"sell"} key={data.id} derivative={data} />))}
            </GridList>
          </div>
        </div>
      </>
    );
  }
}
export default Create;
