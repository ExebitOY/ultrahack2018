import 'package:flutter/material.dart';
import 'home.dart';
import 'buy.dart';
import 'new.dart';

void main() => runApp(new MyApp());

class MyApp extends StatelessWidget {

  @override
  Widget build(BuildContext context) {
    //Main view
    return new MaterialApp(
      title: 'Derivatify',

      theme: new ThemeData(
          hintColor: Colors.grey,
          accentColor: Colors.grey,
        primarySwatch: Colors.blue,
          inputDecorationTheme: new InputDecorationTheme(
              labelStyle: new TextStyle(color: Colors.blue)),
        textTheme: TextTheme( body1: TextStyle(color:Colors.white), display1: TextStyle(color: Colors.white), subhead: TextStyle(color:Colors.grey), caption: TextStyle(color: Colors.white))
      ),
      home: new MyHomePage(title: 'Derivatify'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  MyHomePage({Key key, this.title}) : super(key: key);

  final String title;

  @override
  _MyHomePageState createState() => new _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {

  //int view controls the current view. Pressing drawer buttons sets the new state
  int view =0;
  BuildContext c;
  Widget getCard(){
    return Card( elevation: 20.0, child: Container(width: 400.0, height: 50.0,
      child: Row(children: <Widget>[
        Padding(child: Text("OUT1V", style: TextStyle(fontSize: 20.0),), padding: EdgeInsets.only(left:10.0),),
        Padding(child: Text("304 \$", style: TextStyle(fontSize: 20.0, color: Colors.grey),), padding: EdgeInsets.only(left:10.0),),
        Padding(child: Row(children: <Widget>[Text("2%", style: TextStyle(color: Colors.green),), Icon(Icons.arrow_upward, color: Colors.green,)],),
          padding: EdgeInsets.only(left:160.0),),

      ], crossAxisAlignment: CrossAxisAlignment.center,),
    ));
  }

  @override
  Widget build(BuildContext context) {
    setState(() {
      c = context;
    });

    //Widget w will be the view currently visible. That's @spaghetti ik

    Widget w;
    switch (view){
      case 0:
        w= Home();
        break;
      case 1:
        w= Buy();
        break;
      case 2:
        w= New();
        break;
    }

    return new Scaffold(
      drawer: Drawer(

        child: ListView(
        //app drawer
          padding: EdgeInsets.zero,
          children: <Widget>[
            DrawerHeader(
              child: Center(child: Text('Derivatify', style: TextStyle(color: Colors.white, fontSize: 40.0),),),
              decoration: BoxDecoration(
                color: Color(0xFF1D2D4F),
              ),
            ),

            ListTile(
              title: Row(children: <Widget>[Icon(Icons.dashboard), Padding(child: Text('Dashboard'),padding: EdgeInsets.only(left:10.0),),],),
              onTap: () {
                setState(() {
                  view=0;
                });
                Navigator.pop(c, true);
              },
            ),
            ListTile(
              title: Row(children: <Widget>[Icon(Icons.attach_money), Padding(child: Text('Buy'),padding: EdgeInsets.only(left:10.0),), ],),
              onTap: () {
                setState(() {
                  view=1;
                });
                Navigator.pop(c, true);
              },

            ),
            ListTile(
              title: Row(children: <Widget>[Icon(Icons.account_balance_wallet), Padding(child: Text('Sell'),padding: EdgeInsets.only(left:10.0),),],),
              onTap: () {
                setState(() {
                  view=2;
                });
                Navigator.pop(c, true);
              },
            ),
          ],
        ),
      ),
      appBar: new AppBar(
        elevation: 0.0,
        title: new Text(widget.title),
        backgroundColor: Color(0xFF1D2D4F),
          centerTitle: true,
      ),
      backgroundColor: Color(0xFF1D2D4F),
      body: w
    );
  }
}
