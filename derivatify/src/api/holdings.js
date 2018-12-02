import axios from 'axios'

// Api base-url. IP is from Aalto univeristy open.
// Heh, gammahydroksibutaanivoihappo is just to describe the wonderfull
// smarness of Flutter, React and PHP in one stack :D
const baseUrl = "http://10.100.1.140/gammahydroksibutaanihappo/api"

// SHA-256 is a totally safe and sound :) Here's a few users.

//const apiKey = "v6c18c234b1b18b1d97c7043e2e41135c293d0da9"
//const apiKey = "7a66629ddf3691a66eb6466ab7a9f610de531047"
//const apiKey = "3af871a0e3ebfc46f375ff2b63d1414982bd4f76"
const apiKey = "6c18c234b1b18b1d97c7043e2e41135c293d0da9"

function getGeneralHoldings(){
  // No longer used. Data is calculated from ownedFutures in dashboard.
  const res = new Promise((resolve, reject) => {
    resolve({
      total: Math.floor((Math.random()*10000)+20000),
      day: 11.63, // Percent delta

    })
  })
  return res
}

function getSoldFutures(){
  // Generates dummy data, there's an API-endpoint for this now?
  const res = new Promise((resolve, reject) => {
    resolve(
      Array.from({length: 20}, () => ({
        name: 'Nokia X'+Math.round((Math.random()-.5)*200),
        type: Math.random() > .5 ? "Long" : "Short",
        financingLevel: Math.round(Math.random()*100),
        stopLoss: Math.round(Math.random()*10),
        sold: Math.round(Math.random()*1000),
        soldMax: Math.round(Math.random()*10000)+1000,
        price: Math.round(Math.random()*100)-20,
        delta: Math.round((Math.random()-.5)*100) // Change from yesterday
      }))
    )
    
  })
  return res
}

function getOwnedFutures(){
  // auki=true option opens up the json data of the derivative (price, delta, stoploss etc)
  console.log(baseUrl + '/owned.php?auth='+apiKey+"&auki=true")
  const req = axios.get(baseUrl + '/owned.php?auth='+apiKey+"&auki=true")
  req.then(data => console.log("owned:", data))

  return req.then(res => res.data.map(derivative => ({
    // Format data to "legacy" as pitching was just 20min away from starting
    name: derivative.json.name,
    type: derivative.json.subtype,
    financingLevel: derivative.json.financingLevel,
    stopLoss: derivative.json.stoplossLevel,
    amount: derivative.ammount,
    price: derivative.json.price,
    delta: derivative.json.deltaPercent,
    pPrice: derivative.json.pPrice
  })))

  // Old data generation
  /*
  const res = new Promise((resolve, reject) => {
    resolve(
      Array.from({length: 20}, () => ({
        name: 'FORTUM X'+Math.round((Math.random()-.5)*200),
        type: Math.random() > .5 ? "Long" : "Short",
        financingLevel: Math.round(Math.random()*100),
        stopLoss: Math.round(Math.random()*10),
        amount: Math.round(Math.random()*1000),
        price: Math.round(Math.random()*100)-20,
        delta: Math.round((Math.random()-.5)*100) // Change from yesterday
      }))
    )
    
  })
  return res
  //*/
}

function buy(options){
  // id, count as options needed
  let url = `${baseUrl}/buyDerivative.php?key=${apiKey}`
  // Append options to url
  for(let key in options){
    if(options[key]!==""){
      url+=`&${key}=${options[key]}`
    }
  }
  console.log(url)
  let req = axios.get(url)
  req.then(data => console.log(data))
  return req.then(res => res.data)
}

function sell(amount, id){
  const res = new Promise((resolve, reject) => {
    resolve({
      status: 200,
      data: "success"
    })
  })
  return res
}

function getFutures(criteria){
  //derivative.php?auth=[key]&fMin[min financing level]l&fMax=[max financing level]&sMin=[min stop loss level]&sMax=[max stop loss level]&subtype=[long/short]&underlyingName=[ei vielä käytössä]

  let url = `${baseUrl}/derivative.php?key=${apiKey}`
  for(let key in criteria){
    if(criteria[key]!==""){
      url+=`&${key}=${criteria[key]}`
    }
  }

  let req = axios.get(url)
  req.then(data => console.log(data))

  return req.then(res => res.data).then(data => 
    data.map(data => {
      // At somepoint this was needed to set if a card renders for local search, but probably now unneccessary
      data.active = true
      // App some dummy data for histogram
      data.historical = [data.price]
      for(let i = 0; i<11; i++){
        data.historical.unshift(data.historical[0]*(Math.random()*2.3))
      }
      console.log(data)

      return data
    })
  )
}

function postNewDerivative(options){
  // Options in object format
  // subtype, u (FISI code), f financing level, s stoploss

  let url = `${baseUrl}/newDerivative.php?key=${apiKey}`
  for(let key in options){
    if(options[key]!==""){
      url+=`&${key}=${options[key]}`
    }
  }
  let req = axios.get(url)
  req.then(data => console.log(data))

  return req.then(res => res.data)
}

export default {
  getGeneralHoldings,
  getSoldFutures,
  getOwnedFutures,
  buy,
  sell,
  getFutures,
  postNewDerivative
}