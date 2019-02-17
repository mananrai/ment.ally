import React, { Component } from 'react';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      placeholder: 'Type your sentence here to see its emotional rating'
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
    var i = 1;
    lines.forEach(line => {
      console.log(line);
      time_json += "{\"id\": \"" + i + "\","; //.format(i);
      time_json += "\"time\": \"" + new Date() + "\"}"; //.format(line);
      if (i != lines.length) time_json += ",";
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
    console.log(this.buildJSON(src));
    event.preventDefault();
  }

  render() {
    return (
      <div className="background">
        <div class="intro">
          <p>ment.ally</p>
        </div>

        <div class="form-wrap">
          <form onSubmit={this.handleSubmit}>
            <label>
              <textarea value={this.state.value} onChange={this.handleChange} placeholder={this.state.placeholder} />
            </label>
            <div>
              <input type="submit" value="Submit" />
            </div>
          </form>
        </div>

        <div class="map-wrap">
          <p>map here</p>
        </div>
      </div>
    );
  }
}

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
