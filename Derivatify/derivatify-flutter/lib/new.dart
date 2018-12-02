import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;


class New extends StatefulWidget {
  New({Key key,}) : super(key: key);


  @override
  _New createState() => new _New();
}

class _New extends State<New> {

  //All the badly named inconsistent variables
  String val1="";
  String ls ="";
  double height=50.0;
  bool doSearch=false;
  bool showFab = false;
  bool dataLoaded=false;
  String mPrice="0";
  List data=[0];
  final fLevel = TextEditingController();
  final sLoss = TextEditingController();
  final uL = TextEditingController();
  bool isAgreed=false;
  //List types
  List<String> _dropitems=["Future", "Warrant", "Certificate"];
  List<String> _long_hort=["Short", "Long", ];

  Widget getSearchCard(){
    List<Widget> se = [];
    List<Widget> text = [];
    //If value is future add the following criteria
    if(val1=="Future"){
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
            Container(width: 100.0, child: TextField(
              maxLines: 1,

              controller: fLevel,
              decoration: InputDecoration(
                  hintText: 'Financing', hintStyle: TextStyle(color:Colors.grey)
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
              controller: sLoss,
              decoration: InputDecoration(
                  hintText: 'Stop loss', hintStyle: TextStyle(color:Colors.grey)
              ),
              keyboardType: TextInputType.number,
            ),
            ),
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

  //Return criteria card
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
                      if(val=="Future"){
                        height=230.0;
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

  //Api call for selling derivatives
  void sellDerivative(){
    Map t = {"f":fLevel.text, "s":sLoss.text,  "type":val1, "subtype":ls, "u":uL.text};
    String url="http://10.100.1.140/gammahydroksibutaanihappo/api/newDerivative.php?auth=6c18c234b1b18b1d97c7043e2e41135c293d0da9&";
    for (String key in t.keys){
      if(t[key]!=null&&t[key]!=""){
        url+=key+"="+t[key].toString()+"&";
      }
    }
    url=url.substring(0, url.length-1);
    print(url);
    http.get(url).then((val){
      print(val);
    });
  }

  //Show buying dialog
  void _showDialog() {
    // flutter defined function
    showDialog(
      context: context,
      builder: (BuildContext context) {
        // return object of type Dialog
        return AlertDialog(
          title: new Text("Are you sure?"),
          content: new Text("Selling your own derivative can cause serious damage to your personal economy."),
          actions: <Widget>[
            new FlatButton(
              child: new Text("Never mind"),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
            new FlatButton(
              child: new Text("Just do it!"),
              onPressed: () {
                sellDerivative();
                Navigator.of(context).pop();
              },
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final bool mShowFab = MediaQuery.of(context).viewInsets.bottom==0.0;
    bool show = mShowFab&&showFab;
    return  Column(children: <Widget>[
      getSearchCard(),
    (show? Padding(child: FloatingActionButton(backgroundColor: Colors.green, child: Icon(Icons.add), onPressed: _showDialog,),padding: EdgeInsets.only(top:200.0, left: 260.0),):Text(""))
    ],);
  }
}
