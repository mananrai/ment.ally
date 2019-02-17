import React, { Component } from 'react';
import './App.css';

// var cors = require('cors');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'Please write an essay about your favorite DOM element.'
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  echo(x) {
    console.log(x);
  }

  buildJSON(src) {
    var id_json = "{\"documents\":[";
    var lines = src.text.match( /[^\.!\?]+[\.!\?]+|[^\.!\?]+/g );
    // var src2 = line.replace(/(\r\n|\n|\r)/gm, "")
    // var lines = src.text.match( /[^\n]+[\n]+|[^\n]+/g );
    console.log(lines);
    // for (var line in lines) {
    //   console.log(line.replace(/(\r\n|\n|\r)/gm, ""));
    // }
    var i = 1;
    lines.forEach(line => {
      console.log(line);
      id_json += "{\"language\": \"en\",";
      id_json += "\"id\": \"" + i + "\","; //.format(i);
      id_json += "\"text\": \"" + line + "\"}"; //.format(line);
      if (i != lines.length) id_json += ",";
      i += 1;
    });
    id_json += "]}";

    var time_json = "{\"documents\":[";
    var lines = src.text.match( /[^\.!\?]+[\.!\?]+|[^\.!\?]+/g );
    i = 1;
    lines.forEach(line => {
      console.log(line);
      time_json += "{\"id\": \"" + i + "\","; //.format(i);
      time_json += "\"time\": \"" + new Date() + "\"}"; //.format(line);
      if (i !== lines.length) time_json += ",";
      i += 1;
    });
    console.log(new Date());
    time_json += "]}";
    return {id: id_json, time: time_json};
  }

  handleSubmit(event) {
    // alert('An essay was submitted: ' + this.state.value);
    // console.log("Submit clicked");
    this.echo(this.state.value);
    var src = {text: this.state.value};
    var json = this.buildJSON(src);
    console.log(json);
    var response = fetch('http://localhost:5000/get_sentiment', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'mode': 'no-cors',
      },
      body: JSON.stringify(json.id)
    });
    console.log(response);
    event.preventDefault();
  }

  handlePlotRequest(event) {
    // alert('An essay was submitted: ' + this.state.value);
    // console.log("Submit clicked");
    var response = fetch('http://localhost:5000/get_sentiment', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'mode': 'no-cors',
      }
    });
    console.log(response);
    event.preventDefault();
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            Essay:
            <textarea value={this.state.value} onChange={this.handleChange}></textarea>
          </label>
          <input type="submit" value="Submit"></input>
        </form>
        <form onSubmit={this.handlePlotRequest}>
          <input type="submit" value="Plot"></input>
        </form>
      </div>
    );
  }
}

/// App.use(cors());

// class App extends Component {
//   render() {
//     return (
//       <div className="App">
//         <header className="App-header">
//           <p> this is a react app </p>
//           <form>
//             <label>
//               Name:
//               <input type="text" name="name" />
//             </label>
//             <input type="submit" value="Submit" />
//           </form>
//           <textarea defaultValue="Hello there, this is some text in a text area">
//           </textarea>
//         </header>
//       </div>
//     );
//   }
// }

export default App;
