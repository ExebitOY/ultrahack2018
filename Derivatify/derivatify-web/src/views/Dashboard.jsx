import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// Chart.js react thingys
import { Line, Bar } from "react-chartjs-2";

import 'chartjs-plugin-dragdata'

// reactstrap components for UI
import {
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
} from "reactstrap";


import CircularProgress from '@material-ui/core/CircularProgress';


// Revenue data
import {
  chartExample3,
} from "variables/charts.jsx";

import holdingsApi from "api/holdings"
import Icon from "@material-ui/core/Icon"

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bigChartData: "data1",
      dataReceived: false,
      holdings: {
        total: null
      },
      soldFutures: [],
      ownedFutures: [],
      chartData:
      canvas => {
        let ctx = canvas.getContext("2d");
    
        let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);
    
        gradientStroke.addColorStop(1, "rgba(29,140,248,0.2)");
        gradientStroke.addColorStop(0.4, "rgba(29,140,248,0.0)");
        gradientStroke.addColorStop(0, "rgba(29,140,248,0)"); //blue colors
    
        return {
          labels: [
            "JAN",
            "FEB",
            "MAR",
            "APR",
            "MAY",
            "JUN",
            "JUL",
            "AUG",
            "SEP",
            "OCT",
            "NOV",
            "DEC"
          ],
          datasets: [
            {
              label: "My First dataset",
              fill: true,
              backgroundColor: gradientStroke,
              borderColor: "#1f8ef1",
              borderWidth: 2,
              borderDash: [],
              borderDashOffset: 0.0,
              pointBackgroundColor: "#1f8ef1",
              pointBorderColor: "rgba(255,255,255,0)",
              pointHoverBackgroundColor: "#1f8ef1",
              pointBorderWidth: 20,
              pointHoverRadius: 4,
              pointHoverBorderWidth: 15,
              pointRadius: 4,
              data: this.state.historical
            }
          ]
        }
      },
      chartOptions: {
      //onDrag: function (event, datasetIndex, index, value) {console.log(event)},
      //onDragStart: function (event, element) {console.log("start")},
      //onDragEnd: function (event, datasetIndex, index, value) {console.log("end")},
      dragData: false,
    
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      tooltips: {
        backgroundColor: "#f5f5f5",
        titleFontColor: "#333",
        bodyFontColor: "#666",
        bodySpacing: 4,
        xPadding: 12,
        mode: "nearest",
        intersect: 0,
        position: "nearest"
      },
      responsive: true,
      scales: {
        yAxes: [
          {
            barPercentage: 1.6,
            gridLines: {
              drawBorder: false,
              color: "rgba(29,140,248,0.0)",
              zeroLineColor: "transparent"
            },
            ticks: {
              suggestedMin: 60,
              suggestedMax: 125,
              padding: 20,
              fontColor: "#9a9a9a"
            }
          }
        ],
        xAxes: [
          {
            barPercentage: 1.6,
            gridLines: {
              drawBorder: false,
              color: "rgba(29,140,248,0.1)",
              zeroLineColor: "transparent"
            },
            ticks: {
              padding: 20,
              fontColor: "#9a9a9a"
            }
          }
        ]
      }
      },
      historical: []
    };
  }
  async componentDidMount() {
    const soldFutures = await holdingsApi.getSoldFutures()
    const ownedFutures = await holdingsApi.getOwnedFutures()
    let total = 0
    let day = 0
    for(let i=0; i<ownedFutures.length; i++){
      total+=ownedFutures[i].price
      day+=ownedFutures[i].pPrice
    }
    // Calculates the delta percent from yesterday
    day = ((total-day)/total)*100
    const holdingsData = {
      total,
      day
    }
    // Some data generation for total holdings. API waiting for integration here
    let historical = [total]
    for(let i = 0; i<11; i++){
      historical.unshift(historical[0]*(Math.random()*2.3))
    }
    this.setState({ dataReceived: true, holdings: await holdingsData, soldFutures: await soldFutures, ownedFutures: await ownedFutures, historical})
  }
  setBgChartData = name => {
    // Todo, currently just shows same data or breaks
    this.setState({
      bigChartData: name
    });
  };
  render() {
    // Render only loading if loading :D
    if(!this.state.dataReceived)return (
      <div className="content" style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
        <CircularProgress/>
      </div>        
    )

    const soldFutures = this.state.soldFutures.map(future => (
      <tr>
        <td>{future.name}</td>
        <td>{future.type}</td>
        <td>{future.financingLevel} €</td>
        <td>{future.stopLoss} €</td>
        <td>{future.sold} / {future.soldMax}</td>
        <td>{future.price.toFixed(2)} €</td>
        <td ><p style={{ color: future.delta >= 0 ? "green" : "red", fontWeight: 400 }}>{future.delta} %</p></td>
      </tr>
    ))
    const ownedFutures = this.state.ownedFutures.map(future => (
      <tr>
        <td>{future.name}</td>
        <td>{future.type}</td>
        <td>{future.financingLevel} €</td>
        <td>{future.stopLoss} €</td>
        <td>{future.amount}</td>
        <td>{future.price.toFixed(2)} €</td>
        <td ><p style={{ color: future.delta >= 0 ? "green" : "red", fontWeight: 400}}>{future.delta} %</p></td>
      </tr>
    ))

    return (
      <>
        <div className="content">
          <Row>
            <Col lg="6">
              <Card>
                <CardHeader>
                  <h5 className="card-category">Net balance</h5>
                  <CardTitle tag="h2">Total Holdings</CardTitle>
                </CardHeader>
                <CardBody>
                  <CardTitle tag="h1" style={{ marginLeft: "30px", float: "left" }}>{this.state.holdings.total.toFixed(2)}€</CardTitle>
                  {this.state.holdings.day >= 0 ?
                    (<Icon style={{ marginLeft: "20px", float: "left", fontSize: "2.5em" }}>trending_up</Icon>)
                    :
                    (<Icon style={{ marginLeft: "20px", float: "left", fontSize: "2.5em" }}>trending_down</Icon>)
                  }
                  <CardTitle
                    tag="h3"
                    style={{
                      paddingLeft: "10px",
                      float: "left",
                      color: this.state.holdings.day >= 0 ? "green" : "red"
                    }}>
                    {this.state.holdings.day.toFixed(1)} %
                  </CardTitle>
                </CardBody>
              </Card>

              <Card className="card-chart">
                <CardHeader>
                  <Row>
                    <Col className="text-left" sm="6">
                      <h5 className="card-category">Portfolio</h5>
                      <CardTitle tag="h2">Holdings</CardTitle>
                    </Col>
                    <Col sm="6">
                      <ButtonGroup
                        className="btn-group-toggle float-right"
                        data-toggle="buttons"
                      >
                        <Button
                          tag="label"
                          className={classNames("btn-simple", {
                            active: this.state.bigChartData === "data1"
                          })}
                          color="info"
                          id="0"
                          size="sm"
                          onClick={() => this.setBgChartData("data1")}
                        >
                          <input
                            defaultChecked
                            className="d-none"
                            name="options"
                            type="radio"
                          />
                          <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                            Year
                          </span>
                          <span className="d-block d-sm-none">
                            <i className="tim-icons icon-single-02" />
                          </span>
                        </Button>
                        <Button
                          color="info"
                          id="1"
                          size="sm"
                          tag="label"
                          className={classNames("btn-simple", {
                            active: this.state.bigChartData === "data2"
                          })}
                          onClick={() => this.setBgChartData("data2")}
                        >
                          <input
                            className="d-none"
                            name="options"
                            type="radio"
                          />
                          <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                            Month
                          </span>
                          <span className="d-block d-sm-none">
                            <i className="tim-icons icon-gift-2" />
                          </span>
                        </Button>
                        <Button
                          color="info"
                          id="2"
                          size="sm"
                          tag="label"
                          className={classNames("btn-simple", {
                            active: this.state.bigChartData === "data3"
                          })}
                          onClick={() => this.setBgChartData("data3")}
                        >
                          <input
                            className="d-none"
                            name="options"
                            type="radio"
                          />
                          <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                            Day
                          </span>
                          <span className="d-block d-sm-none">
                            <i className="tim-icons icon-tap-02" />
                          </span>
                        </Button>
                      </ButtonGroup>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <div className="chart-area">
                    <Line
                      data={this.state.chartData}
                      options={this.state.chartOptions}
                    />
                  </div>
                </CardBody>
              </Card>
              <Card className="card-chart">
                <CardHeader>
                  <h5 className="card-category">Revenue</h5>
                  <CardTitle tag="h3">
                    <Icon style={{ flex: "left", color: "#d048b6", marginRight: "10px", paddingTop: "3px" }}>swap_vert</Icon>
                    227.40 €
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <div className="chart-area" style={{ height: "29.2vh" }}>
                    <Bar
                      data={chartExample3.data}
                      options={chartExample3.options}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col lg="6">
              <Card>
                <CardHeader>
                  <CardTitle tag="h4">Owned Futures</CardTitle>
                </CardHeader>
                <CardBody>
                  <div className="table-responsive" style={{ height: "375px" }}>
                    <table className="tablesorter table">
                      <thead className="text-primary">
                        <tr>
                          <th>Name</th>
                          <th>Long / Short</th>
                          <th>Financing Level</th>
                          <th>Stoploss</th>
                          <th>Amount</th>
                          <th>Price</th>
                          <th><Icon>trending_up</Icon></th>
                        </tr>
                      </thead>
                      <tbody>
                        {ownedFutures}
                      </tbody>
                    </table>
                  </div>
                </CardBody>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle tag="h4">Sold Futures</CardTitle>
                </CardHeader>
                <CardBody>
                  <div className="table-responsive" style={{ height: "375px" }}>
                    <table className="tablesorter table">
                      <thead className="text-primary">
                        <tr>
                          <th>Name</th>
                          <th>Long/Short</th>
                          <th>Financing Level</th>
                          <th>Stop loss</th>
                          <th>Sold</th>
                          <th >Price</th>
                          <th><Icon>trending_up</Icon></th>
                        </tr>
                      </thead>
                      <tbody>
                        {soldFutures}
                      </tbody>
                    </table>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default Dashboard;
