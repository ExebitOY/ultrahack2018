import React from 'react'

import {
  Card,
  CardHeader,
  CardTitle
} from "reactstrap"

import { Line } from "react-chartjs-2";
import Icon from "@material-ui/core/Icon"

import MinMaxInput from "components/Input/MinMaxInput.jsx"
import Dropdown from "components/Input/Dropdown.jsx"

import holdingsApi from "api/holdings"

class Create extends React.Component {
  constructor(props){
    super()
    // For getting input text value (there should be 3 (amount to create, financing level and stoploss) for mini futures)
    this.input = React.createRef()
  }
  componentDidMount(){

  }

  tdStyle={
    padding: "5px 20px"
  }

  state = {
    subtypeMenuOpen: null,
    subtype: "LONG",
    buying: false,
    show: false,
    name: "",
    id: null,
    price: null,
    delta: null,

    
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

  handleMenuClick = event => {
    // Open menu
    this.setState({ subtypeMenuOpen: event.currentTarget });
  }

  setSubtype = field => event => {
    // For buttons
    this.setState({
      subtype: field,
      subtypeMenuOpen: null
    })
  }

  create = () => {
    // Api should be called here with right options
    console.log(this.financingLevelInput.value)
  }

  render(){
    return (
      <div style={{width:"40.1%", marginRight: "0.9%"}}>
        <Card className="" >
          <CardHeader>
            <CardTitle tag="h4">Create new derivative</CardTitle>
            <div style={{height: "40px", display:"flex"}}>
              <Dropdown values={["Mini"]} onChange={data=>console.log(data)}/>
              <Dropdown values={["Long", "Short"]} onChange={data=>console.log(data)}/>
              <Dropdown values={["Nokia", "Nordea FDR", "Fortum", "Sampo A", "UPM-Kymene", "Neste oil corporation", "Wärtsilä corporation serie B", "KONE B", "Elisa A"]} onChange={data=>console.log(data)}/>
              {this.state.price}€
              <p style={{fontWeight: 400, color: this.state.deltaPercent >= 0 ? "green": "red", float:"right"}}>{this.state.deltaPercent} %{" "}</p>
              <Icon style={{paddingTop: "0px", float:"right", marginRight: "10px"}}>trending_up</Icon>
            </div>
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
                  <tr style={{height: 30}}>
                    <td style={this.tdStyle}>
                      {this.state.subtype}
                    </td>
                    <td style={this.tdStyle}>
                      <div style={{display:"flex", flexDirection:"row", height: "30px"}}>
                        <MinMaxInput 
                          min={0} 
                          placeholder={"Financing Level"} 
                          align={"right"} 
                          style={{height: "30px"}} 
                          ref={financingLevelInput => this.financingLevelInput = financingLevelInput}
                          onEnter={this.create}
                        />
                        <h4 style={{marginTop: 3}}>€</h4>
                      </div>
                    </td>
                    <td style={this.tdStyle}>
                      <div style={{display:"flex", flexDirection:"row", height: "30px"}}>
                        <MinMaxInput min={0} placeholder={"Stop Loss"} align={"right"} style={{height: "30px"}} />
                        <h4 style={{marginTop: 3}}>€</h4>
                      </div>
                    </td>
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
              </div>
            </div>
        </Card>
      </div>
    )
  }
}

export default Create