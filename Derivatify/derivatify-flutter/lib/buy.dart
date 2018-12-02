import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:local_auth/local_auth.dart';

class ModalBottomSheet extends StatefulWidget {
  final String name;
  final double price;
  final String id;
  const ModalBottomSheet({Key key, @required this.name, @required this.price, @required this.id,}): super(key: key);
  _ModalBottomSheetState createState() => _ModalBottomSheetState();
}


//The class for bottom modal sheet
class _ModalBottomSheetState extends State<ModalBottomSheet>
    with SingleTickerProviderStateMixin {
  var heightOfModalBottomSheet = 201.0;
  double mPrice=0.0;
  bool isSelected=false;
  FocusNode _focus = new FocusNode();
  @override
  void initState() {
    super.initState();
    _focus.addListener(_onFocusChange);
  }

  //Buy derivative
  Future<http.Response> buyStuff() async{
    String url="http://10.100.1.140/gammahydroksibutaanihappo/api/buyDerivative.php?auth=6c18c234b1b18b1d97c7043e2e41135c293d0da9&id="+ widget.id+"&count="+(mPrice/widget.price).round().toString();
    print(url);
    return http.get(url);
  }
  //show authentication and buying dialog
  Future _showDialog() async {
    var localAuth = new LocalAuthentication();
    bool didAuthenticate = await localAuth.authenticateWithBiometrics(
        localizedReason: 'Please authenticate to buy stuff');
    if(didAuthenticate){
      showDialog(
        context: context,
        builder: (BuildContext context) {
          // return object of type Dialog
          return AlertDialog(
            title: new Text("Are you sure?"),
            content: new Text("Do you want to buy these derivatives?"),
            actions: <Widget>[
              new FlatButton(
                child: new Text("Cancel"),
                onPressed: () {
                  Navigator.of(context).pop();
                },
              ),
              new FlatButton(
                child: new Text("Ok"),
                onPressed: () {
                  Navigator.of(context).pop();
                  buyStuff().then((data){
                    print(json.encode(data.body));
                  });
                },
              ),
            ],
          );
        },
      );
    }else{
      showDialog(
        context: context,
        builder: (BuildContext context) {
          // return object of type Dialog
          return AlertDialog(
            title: new Text("Error"),
            content: new Text("Could not authenticate!"),
            actions: <Widget>[
              new FlatButton(
                child: new Text("Ok"),
                onPressed: () {
                  Navigator.of(context).pop();
                },
              ),
            ],
          );
        },
      );
    }

  }

  //When focused to the text field increase the height of bottom modal to avoid overflow
  void _onFocusChange(){

    if(_focus.hasFocus){
      setState(() {
        heightOfModalBottomSheet=500.0;
      });
    }else{
      setState(() {
        heightOfModalBottomSheet=201.0;
      });
    }
  }

  Widget build(BuildContext context) {

    return Container(
      color: Color(0xFF1D2D4F),
      child:
      Container(child: Column(
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          Padding(child: Text(widget.name), padding: EdgeInsets.all(10.0),),
          Padding( child:TextField(
            onChanged: (str){
              setState(() {
                if(str!=""){
                  mPrice=double.parse(str)*widget.price;
                }else{
                  mPrice=0.0;

                }
              });
            },
            focusNode: _focus, keyboardType: TextInputType.number,   decoration: InputDecoration(
              hintText: 'Amount', hintStyle: TextStyle(color:Colors.grey)
          ),),
              padding: EdgeInsets.only(left: 20.0, right: 20.0), ),
          Padding(child: Text("Price: "+mPrice.toStringAsFixed(2)+"€", style: TextStyle(color: Colors.grey),), padding: EdgeInsets.only(top:10.0),),
          Row(mainAxisAlignment: MainAxisAlignment.center, children: <Widget>[
            Text("I agree the terms of service and privacy policy", style: TextStyle(color:Colors.grey),),
            Checkbox(value: isSelected, onChanged: (val){
              setState(() {
                isSelected=val;
              });
            },)
          ],),
          MaterialButton(child: Text("Buy", style: TextStyle(color: Colors.grey),), onPressed: () {
            _showDialog();
          },)
        ],), height: heightOfModalBottomSheet,)
    );
  }
}

class Buy extends StatefulWidget {
  Buy({Key key, this.title}) : super(key: key);

  final String title;

  @override
  _Buy createState() => new _Buy();
}

//NOTE: This class has three states:
//1. Searching state
//2. Buying state
//3. Modal sheet


class _Buy extends State<Buy> {

  List<String> _dropitems=["Mini future", "Warrant", "Certificate"];
  List<String> _long_hort=["Short", "Long", ];

  String val1="";
  String ls ="";
  double height=50.0;
  bool doSearch=false;
  bool showFab = false;
  bool dataLoaded=false;
  String mPrice="0";
  List data=[0];
  final fLevelMin = TextEditingController();
  final fLevelMax = TextEditingController();
  final sLossMin = TextEditingController();
  final sLossMax = TextEditingController();
  final uL = TextEditingController();
  bool isAgreed=false;
  bool per=false;

  //return the default data card

  Widget getCard(String name, String u, int fLevel, int sLevel, String uIsis, double price, double changeP, double changeV,String id){

    Widget text;
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



    return InkWell(
      onTap: (){
        showModalBottomSheet<void>(context: context,
            builder: (BuildContext context) {
              return ModalBottomSheet(name:name, price:price, id:id);

      });
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

            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: <Widget>[
                Padding(child: Column(children: <Widget>[Text("Underlying:", style: TextStyle(color: Colors.grey),),
                Text("Financing level:", style: TextStyle(color: Colors.grey),),
                Text("Stoploss level:", style: TextStyle(color: Colors.grey),),
                Text("Underlying isin:",style: TextStyle(color: Colors.grey),),
                ], crossAxisAlignment: CrossAxisAlignment.start, mainAxisAlignment: MainAxisAlignment.center,), padding: EdgeInsets.only(left: 10.0),),
                Padding(child: Column(children: <Widget>[Text(u), Text(fLevel.toString()+"€",), Text(sLevel.toString()+"€", ), Text(uIsis,),], crossAxisAlignment: CrossAxisAlignment.start, mainAxisAlignment: MainAxisAlignment.center,), padding: EdgeInsets.only(left: 10.0),),
              ],),
          ], crossAxisAlignment: CrossAxisAlignment.center,),),
        ],),),
      ],), padding: EdgeInsets.all(10.0),),
    )),);
  }

  @override
  void dispose() {
    fLevelMin.dispose();
    fLevelMax.dispose();
    sLossMin.dispose();
    sLossMax.dispose();
    uL.dispose();
    super.dispose();
  }


  Future<http.Response> makeRequest() async{
    Map t = {"fMin":fLevelMin.text, "fMax":fLevelMax.text, "sMin":sLossMin.text, "sMax":sLossMax.text, "type":val1, "subtype":ls};
    String url="http://10.100.1.140/gammahydroksibutaanihappo/api/derivative.php?auth=6c18c234b1b18b1d97c7043e2e41135c293d0da9";
    for (String key in t.keys){
      if(t[key]!=null&&t[key]!=""){
        url+=key+"="+t[key].toString()+"&";
      }
    }
    url=url.substring(0, url.length-1);
    print(url);


    return http.get(url);
  }

  //empty function, removing probably breaks the code. You have been warned.
  getResultCard(){

  }
  //Search card
  Widget getSearchCard(){
    List<Widget> se = [];
    List<Widget> text = [];

    if(val1=="Mini future"){
      text.add(Padding(padding: EdgeInsets.only(left: 10.0, right:10.0, top:30.0), child: Text("Subtype: ", style: TextStyle(fontSize: 15.0),),),);
      text.add(Padding(padding: EdgeInsets.only(left: 10.0, right:10.0, top:30.0), child: Text("Financing level: ", style: TextStyle(fontSize: 15.0),),),);
      text.add(Padding(padding: EdgeInsets.only(left: 10.0, right:10.0, top:25.0), child: Text("Stop loss: ", style: TextStyle(fontSize: 15.0),),),);
      text.add(Padding(padding: EdgeInsets.only(left: 10.0, right:10.0, top:25.0), child: Text("Underlying: ", style: TextStyle(fontSize: 15.0),),),);

    se.add(
      Padding(child:  Row(children: <Widget>[
        DropdownButton<String>(
            value: ls==""?null:ls,

            items:_long_hort.map((String val){
              return DropdownMenuItem<String>(
                value: val,
                child: new Text(val),
              );
            }).toList(),
            hint:Text(ls),
            onChanged:(String val){
              setState(() {
                ls=val;
              });
            }),
      ],), padding: EdgeInsets.only(left: 20.0),),
      );
      se.add(
        Padding(padding: EdgeInsets.only(left: 10.0), child: Row(children: <Widget>[
          Padding(padding: EdgeInsets.only(left: 10.0),child: null,),
          Container(width: 50.0, child: TextField(
            maxLines: 1,

            controller: fLevelMin,
            decoration: InputDecoration(
                hintText: 'Min', hintStyle: TextStyle(color:Colors.grey)
            ),
            keyboardType: TextInputType.number,

          ),
          ),
          Padding(padding: EdgeInsets.only(left: 20.0),),
          Container(width: 50.0, child: TextField(
            maxLines: 1,
            controller: fLevelMax,

            decoration: InputDecoration(
                hintText: 'Max', hintStyle: TextStyle(color:Colors.grey)
            ),
            keyboardType: TextInputType.number,

          ),
          )
        ],) )
      );

      se.add(
          Padding(padding: EdgeInsets.only(left:10.0), child: Row(children: <Widget>[
            Padding(padding: EdgeInsets.only(left: 10.0),child: null,),
            Container(width: 50.0, child: TextField(
              maxLines: 1,
              controller: sLossMin,
              decoration: InputDecoration(
                  hintText: 'Min', hintStyle: TextStyle(color:Colors.grey)
              ),
              keyboardType: TextInputType.number,
            ),
            ),
            Padding(padding: EdgeInsets.only(left: 20.0),),
            Container(width: 50.0, child: TextField(
              maxLines: 1,
              controller: sLossMax,
              decoration: InputDecoration(
                  hintText: 'Max', hintStyle: TextStyle(color:Colors.grey),
              ),
              keyboardType: TextInputType.number,
            ),
            )
          ],) )
      );
      se.add(
          Padding(padding: EdgeInsets.only(left:10.0), child: Row(children: <Widget>[
            Padding(padding: EdgeInsets.only(left: 10.0),child: null,),
            Container(width: 100.0, child: TextField(
              maxLines: 1,
              controller: uL,
              decoration: InputDecoration(
                  hintText: 'Underlying', hintStyle: TextStyle(color:Colors.grey)
              ),
            ),
            ),
          ],) )

      );
    }



      return Card(elevation: 40.0, color: Color(0xFF1D2D4F),
        child: Container(width:400.0, height:height,
          child: Row(children: <Widget>[
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
              Padding(padding: EdgeInsets.only(left: 10.0, right:10.0, top:17.0), child: Text("Type: ", style: TextStyle(fontSize: 15.0),),),
              Column(crossAxisAlignment: CrossAxisAlignment.start, children: text,)
            ],),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
              Padding(padding: EdgeInsets.only(left: 20.0,),child:
              DropdownButton<String>(
                  value: val1==""?null:val1,
                  items:_dropitems.map((String val){
                    return DropdownMenuItem<String>(
                      value: val,
                      child: new Text(val),
                    );
                  }).toList(),
                  hint:Text(val1),
                  onChanged:(String val){
                    setState(() {
                      val1=val;
                      showFab=true;
                      if(val=="Mini future"){
                        height=255.0;
                      }else{
                        height=50.0;
                      }
                    });
                  }),
                ),
              Column(children: se, crossAxisAlignment: CrossAxisAlignment.start,),
            ],)
          ],),),);
  }


  @override
  Widget build(BuildContext context) {
    //If keyboard active, hide the fab
    final bool showFab = MediaQuery.of(context).viewInsets.bottom==0.0;
    Widget view = Column(children: <Widget>[
      getSearchCard(),
      Expanded(child: Column(children: <Widget>[
        Padding(child:

    (showFab?FloatingActionButton(
      backgroundColor: Colors.green,
      onPressed: (){
        setState(() {
          doSearch=true;
        });
        makeRequest().then((mData){
          setState(() {
            data=json.decode(mData.body);
            dataLoaded=true;
          });
        });
      },

      tooltip: 'Toggle',
      child: Icon(Icons.search),
    ):Text("")), padding: EdgeInsets.only(left: 280.0, bottom: 10.0),),

      ], mainAxisAlignment: MainAxisAlignment.end, crossAxisAlignment: CrossAxisAlignment.start, ),),
    ],
    );


    if(doSearch && !dataLoaded){
      view = Center(child:CircularProgressIndicator());
    }else if (doSearch && dataLoaded){
      view = ListView.builder(
        itemCount: data.length,
        itemBuilder: (context, index) {
          String y = data[index]['underlyingName'];
          if(y.length>10.0){
            y=y.substring(0, 10)+"...";
          }
          if(data[index]['pDelta'] is int){
            data[index]['pDelta']=data[index]['pDelta'].toDouble();
          }
          return getCard(data[index]['name'],y, data[index]['financingLevel'].round(), data[index]['stoplossLevel'].round(), data[index]['underlyingISIN'], data[index]['price'], num.parse(data[index]['deltaPercent'].toStringAsFixed(2)), num.parse(data[index]['pDelta'].toStringAsFixed(2)), data[index]['id']);
        },
      );
      view=Column(children: <Widget>[
        Row(mainAxisAlignment: MainAxisAlignment.center, children: <Widget>[ Text("Show percentage"), Switch(value: per, onChanged: (val){setState(() {
          per=val;
        });},)],),
        Expanded(child: view,)
      ],);
    }

    return view;

  }
}
