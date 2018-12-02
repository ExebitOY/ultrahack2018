import React from 'react'

import {
  Card,
  CardHeader,
  CardTitle,
} from "reactstrap"

import { Line } from "react-chartjs-2";
import Icon from "@material-ui/core/Icon"
import TextField from "@material-ui/core/TextField"

import holdingsApi from "api/holdings"

class Derivative extends React.Component {
  constructor(props){
    super()

    this.input = React.createRef()
  }
  componentDidMount(){
    const data = {...this.props.derivative}
    data.price = data.price.toFixed(2)
    this.setState({...data, buying: this.props.mode === "buy"})
  }

  tdStyle={
    padding: "5px 20px"
  }

  state = {
    buying: false,
    show: false,
    name: "",
    id: null,
    price: null,
    delta: null,
    type: null,
    owned: 100,
    financingLevel: null,
    stoploss: null,
    historical: [],
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
    trading: 0
  }
  trade = () => {
    // Asks for window confirm and post api call
    if(this.state.trading && window.confirm(`${this.state.buying ? "Buy" : "Sell"} ${this.state.trading} of ${this.state.name} for ${(this.state.price*this.state.trading).toFixed(2)}€?`))
      this.state.buying ? 
        holdingsApi.buy({ammount: this.state.trading, id: this.state.id}).then(data => console.log(data)) 
        :
        holdingsApi.sell({ammount: this.state.trading, id: this.state.id}).then(data => console.log(data))
  }

  handleInputChange = event => {
    // Some black magic. Essentially re-creates MinMaxInput, but didn't have time to switch that to work here
    this.setState({trading: this.state.buying ? Math.max(0, parseInt(event.target.value)) : Math.max(0, Math.min(this.state.owned, parseInt(event.target.value)))})
  }
  handleInputDown = event => {
    // Up and down (0) number capping and enter functionality
    switch(event.key){
      case "ArrowUp":
        event.preventDefault()
        this.setState({trading: this.state.buying ? this.state.trading+1 : Math.min(this.state.trading+1, this.state.owned)})
        this.input.current.focus()
        break
      
      case "ArrowDown":
        this.setState({trading: Math.max(0,this.state.trading-1)})
        this.input.current.focus()
        break
      
      case "Enter":
        this.trade()

      // eslint-disable-next-line no-fallthrough
      default:
        break
    }
  }

  render(){
    // If statement for loading circle.
    if(this.props.derivative.active)
      return (
        <div style={{width:"32.1%", marginRight: "0.9%"}}>
          <Card className="" >
            <CardHeader>
              <CardTitle tag="h4">
                <p style={{fontWeight: 400, float: "left"}}> {this.state.name.toUpperCase()}{" "} &nbsp; &nbsp;</p>
                {this.state.price}€
                <p style={{fontWeight: 400, color: this.state.deltaPercent >= 0 ? "green": "red", float:"right"}}>{this.state.deltaPercent} %{" "}</p>
                <Icon style={{paddingTop: "0px", float:"right", marginRight: "10px"}}>trending_up</Icon>
              </CardTitle>
            </CardHeader>
            <div className="card-body" style={{paddingTop: 0}} >
              <div className="table-responsive" style={{paddingBottom: 0}}>
                <table className="tablesorter table" style={{paddingBottom: 0}}>
                  <thead className="text-primary">
                    <tr>
                      <th style={this.tdStyle}>Type</th>
                      <th style={this.tdStyle}>Financing Level</th>
                      <th style={this.tdStyle}>Stoploss</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={this.tdStyle}>{this.state.subtype}</td>
                      <td style={this.tdStyle}>{this.state.financingLevel}€</td>
                      <td style={this.tdStyle}>{this.state.stoplossLevel}€</td>
                    </tr>
                  </tbody>
                </table>
                </div>
                <div className="chart-area">
                  <Line
                    data={this.state.chartData}
                    options={this.state.chartOptions}
                  />
                </div>
                <div style={{display:"flex", flexDirection:"row-reverse"}}>
                {this.state.buying ? null : (<p style={{fontWeight: 400, float: "left", fontSize: 15, marginTop: 5, color:"rgba(255,255,255,0.8)"}}>/{this.state.owned}</p>)}
                <TextField 
                  variant="filled"
                  onChange={this.handleInputChange}
                  onKeyDown={this.handleInputDown}
                  value={this.state.trading || ""}
                  inputProps={{ref: this.input, placeholder: this.state.buying ? "Buy" : "Sell", style:{color: "white", fontSize: 15, marginBottom: 15, textAlign: "right"}  }}
                  style={{height: "30px", width: "100%"}}
                />
                </div>
              </div>
          </Card>
        </div>
      )
    else
        return null
  }
}

export default Derivative