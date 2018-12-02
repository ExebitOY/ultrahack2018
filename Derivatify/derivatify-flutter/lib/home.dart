import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class Home extends StatefulWidget {
  Home({Key key, this.title}) : super(key: key);

  final String title;

  @override
  _Home createState() => new _Home();
}

class _Home extends State<Home> {
  List data=[];
  bool loaded = false;
  initState() {
    super.initState();
    //start loading data
    makeRequest().then((mdata){
      setState((){
        data=json.decode(mdata.body);
        loaded=true;
    });
    });
  }

  //controls whether to use delta percentage or raw value
  bool per = true;

  //@spaghetti implementation of basic data card. Takes lots of data it and returns a clickable card with no interactivity

  Widget getCard(String name, String u, int fLevel, int sLevel, String uIsis, double price, double changeP, double changeV,String id, String amount){

    Widget text;


    //Create appropriate text according to bool per and whether delta is positive or negative
    if(per && changeP>0){
      text= Row(children: <Widget>[
        Column( children: <Widget>[
          Text(price.roundToDouble().toString()+"€", style: TextStyle(color:Colors.green, fontSize: 17.0),),
          Text(changeP.toString()+"%", style: TextStyle(color:Colors.green, fontSize: 10.0),)],mainAxisAlignment: MainAxisAlignment.center,),
        Icon(Icons.arrow_upward, color: Colors.green, size: 50.0,),
      ],);
    }else if(per && changeP<0){
      text= Row(children: <Widget>[
        Column( children: <Widget>[
          Text(price.roundToDouble().toString()+"€", style: TextStyle(color:Colors.red, fontSize: 17.0),),
          Text(changeP.toString()+"%", style: TextStyle(color:Colors.red, fontSize: 10.0),)],mainAxisAlignment: MainAxisAlignment.center,),
        Icon(Icons.arrow_downward, color: Colors.red, size: 50.0,),
      ],);
    }else if(!per && changeP<0){
      text= Row(children: <Widget>[
        Column( children: <Widget>[
          Text(price.roundToDouble().toString()+"€", style: TextStyle(color:Colors.red, fontSize: 17.0),),
          Text(changeV.toString()+"€", style: TextStyle(color:Colors.red, fontSize: 10.0),)],mainAxisAlignment: MainAxisAlignment.center,),
        Icon(Icons.arrow_downward, color: Colors.red, size: 50.0,),
      ],);
    }else if(!per && changeP>0){
      text= Row(children: <Widget>[
        Column( children: <Widget>[
          Text(price.roundToDouble().toString()+"€", style: TextStyle(color:Colors.green, fontSize: 17.0),),
          Text(changeV.toString()+"€", style: TextStyle(color:Colors.green, fontSize: 10.0),)],mainAxisAlignment: MainAxisAlignment.center,),
        Icon(Icons.arrow_upward, color: Colors.green, size: 50.0,),
      ],);
    }


    //Main card component wrapped in inkwell to provide touch support
    return InkWell(
      onTap: (){
      } ,
      child: Card(color:Color(0xFF1D2D4F), elevation: 20.0, child: Container(width: 400.0, height: 130.0,
        child: Padding(child:  Column(children: <Widget>[
          Text(name, style: TextStyle(fontSize: 20.0, fontWeight: FontWeight.w300),),
          Expanded(child: Row(children: <Widget>[
            Expanded(child:
            Row(children: <Widget>[
              text,
              Container(
                margin: EdgeInsets.only(top:2.0),
                height: 70.0,
                width: 1.0,
                color: Colors.grey,
              ),

              //layout consists of two columns. The first one contains keys and the second the values
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: <Widget>[
                  Padding(child:

                  //The key colun
                  Column(children: <Widget>[Text("Underlying:", style: TextStyle(color: Colors.grey),),
                    Text("Financing level:", style: TextStyle(color: Colors.grey),),
                    Text("Stoploss level:", style: TextStyle(color: Colors.grey),),
                    Text("Underlying isin:",style: TextStyle(color: Colors.grey),),
                    Text("Amount:",style: TextStyle(color: Colors.grey),),

                  ], crossAxisAlignment: CrossAxisAlignment.start, mainAxisAlignment: MainAxisAlignment.center,), padding: EdgeInsets.only(left: 10.0),),

                  //The value column
                  Padding(child: Column(children: <Widget>[Text(u), Text(fLevel.toString()+"€",), Text(sLevel.toString()+"€", ), Text(uIsis,),Text(amount)], crossAxisAlignment: CrossAxisAlignment.start, mainAxisAlignment: MainAxisAlignment.center,), padding: EdgeInsets.only(left: 10.0),),
                ],),
            ], crossAxisAlignment: CrossAxisAlignment.center,),),
          ],),),
        ],), padding: EdgeInsets.all(10.0),),
      )),);
  }

  //Request to the api. Remember to set the correct url and auth token
  Future<http.Response> makeRequest() async{
    String url="http://10.100.1.140/gammahydroksibutaanihappo/api/owned.php?auth=6c18c234b1b18b1d97c7043e2e41135c293d0da9&auki=true";

    print(url);
    return http.get(url);
  }


  @override
  Widget build(BuildContext context) {
    double constPrice=0.0;
  if(loaded){
    print(data);
    data.forEach((d){
      constPrice+=d['json']['price'];
    });
  }

    return new Column(
      children: <Widget>[
        Padding(
            padding: EdgeInsets.only(top: 60.0, bottom: 40.0),
            child: Row(
              children: <Widget>[
                Text(
                  constPrice.toStringAsFixed(2)+" €",
                  style: TextStyle(
                      fontSize: 40.0,
                      fontWeight: FontWeight.w300,
                      color: Colors.white),
                )
              ],
              mainAxisAlignment: MainAxisAlignment.center,
            )),
        Expanded(child:
            //If data loaded hide Progressbar and show listview
    (loaded?ListView.builder(
      itemCount: data.length,
      itemBuilder: (context, index) {
        String y = data[index]['json']['underlyingName'];
        if(y.length>10.0){
          y=y.substring(0, 10)+"...";
        }
        if(data[index]['json']['pDelta'] is int){
          data[index]['json']['pDelta']=data[index]['json']['pDelta'].toDouble();
        }
        return getCard(data[index]['json']['name'],y, data[index]['json']['financingLevel'].round(), data[index]['json']['stoplossLevel'].round(), data[index]['json']['underlyingISIN'], data[index]['json']['price'], data[index]['json']['deltaPercent'], num.parse(data[index]['json']['pDelta'].toStringAsFixed(2)), data[index]['json']['id'], data[index]['ammount'].toString());
      },
    ):Column(children: <Widget>[CircularProgressIndicator()],)),
        ),

      ],
      crossAxisAlignment: CrossAxisAlignment.center,
    );
  }
}
