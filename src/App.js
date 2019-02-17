import React, { Component } from 'react';
import './App.css';
// import './Chart.js'

// var express = require('express');
// var cors = require('cors');
// var app = express();
// app.use(cors());

var Chart = require('chart.js');

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

  plotData(data_vals) {
    // input = [40, 5, 70, 45, 50, 75, 90]

    // data_vals = [input[0]]
    // for(i = 0; i < input.length; i++) {
    //  data_vals[i] = input[i]
    // }
    
    // data_vals = input

    var input = data_vals
    if (!input || input.length === undefined || input.length === 0) {
      input = [40, 5, 70, 45, 50, 75, 90]
      data_vals = [40, 5, 70, 45, 50, 75, 90]
    }
    
    // data_vals[input.length + 1] = input[input.length-1]
    console.log(data_vals)
    var ctx = document.getElementById('myChart').getContext("2d");
    var rect = document.getElementById('myChart').getBoundingClientRect();
    console.log(rect.top, rect.right, rect.bottom, rect.left);

    var gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
    gradientStroke.addColorStop(1, '#80b6f4');
    gradientStroke.addColorStop(0, '#f49080');

    var x_happy = new Image();
    var happy = new Image();
    var sad = new Image();
    var x_sad = new Image();
    var neutral = new Image();

    x_happy.src = "images/extreme-happy.png";
    x_sad.src = "images/extreme-sad.png";
    sad.src = "images/normal-sad.png";
    happy.src = "images/normal-happy.png";
    neutral.src = "images/neutral-face.png";
    
    var emotional_arr = [x_sad, sad, neutral, happy, x_happy]

    //plot_points = ['rect', 'rect', x_happy, 'circle', 'rect', 'triangle', 'circle'];
    // var chungus = new Image()
  //    chungus.src ='chungus\ (1).png';
      // chungus.style.width = '5px'
      // chungus.style.height = '10px'
    // var gradientFill = ctx.createLinearGradient(500, 0, 100, 0);

    // plot_points = ["circle"]
    var plot_points = []
    for(var i = 0; i < input.length; i++) {
      plot_points[i] = emotional_arr[parseInt((input[i]-1)/20)]
    }
    // plot_points[input.length+1] = "circle"
    console.log(plot_points)
    var gradientFill = ctx.createLinearGradient((rect.left+rect.right)/2, rect.top, (rect.left+rect.right)/2, rect.top + rect.bottom*3);
    // gradientFill.addColorStop(0, "rgba(128, 182, 244, 0.6)");
    // gradientFill.addColorStop(1, "rgba(244, 144, 128, 0.6)");


    gradientFill.addColorStop(0, "rgba(244, 144, 128, 0.7)");
    gradientFill.addColorStop(1, "rgba(128, 182, 244, 0.7)");

    var offset = 50
    Chart.pluginService.register({
        afterUpdate: function(chart) {
            // We get the dataset and set the offset here
            var dataset = chart.config.data.datasets[0];

            // For every data in the dataset ...
            for (var i = 0; i < dataset._meta[0].data.length; i++) {
                // We get the model linked to this data
                var model = dataset._meta[0].data[i]._model;

                // And add the offset to the `x` property
                model.x += offset;

                // .. and also to these two properties
                // to make the bezier curve fits the new graph
                model.controlPointNextX += offset;
                model.controlPointPreviousX += offset;
            }
        }
    });

    var myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", ""],
        // labels: ["f", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "f"],
        datasets: [{
          label: "Data",
          borderColor: gradientStroke,
          pointBorderColor: gradientStroke,
          pointBackgroundColor: gradientStroke,
          pointHoverBackgroundColor: gradientStroke,
          pointHoverBorderColor: gradientStroke,
          pointBorderWidth: 10,
          pointHoverRadius: 10,
          pointHoverBorderWidth: 1,
          pointRadius: 3,
          fill: true,
          backgroundColor: gradientFill,
          borderWidth: 10,
          pointStyle: plot_points,
          data: data_vals
        }]
      },
      options: {
        legend: {
          position: "bottom"
        },
        layout: {
              padding: {
                  left: 50,
                  right: 0,
                  top: 0,
                  bottom: 0
              }
          },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: "rgba(0,0,0,0.5)",
              fontStyle: "bold",
              beginAtZero: true,
              maxTicksLimit: 22,
              padding: 60,
              stepSize: 5,
              fontSize: 60,
              max: 100,
              labelOffset: offset,
              callback: function(label, index, labels) {
                    switch (label) {
                      // case 0:
                      //  return ''
                        case 10:
                            return '😭 ';
                        // case 20:
                        //  return '';
                        case 30:
                            return '😔 ';
                        // case 40:
                        //  return '40';
                        case 50:
                            return '😐 ';
                        // case 60:
                        //  return '60';
                        case 70:
                            return '🙂 ';
                        // case 80:
                        //  return '80';
                        case 90:
                            return '😁 ';
                        // case 100:
                        //     return '100';
                    }
                }
            },
            gridLines: {
              drawTicks: false,
              display: false
            }

          }],
          xAxes: [{
            categories: ['1', '2', '3', '4', '5', '6', '7'],
            gridLines: {
              zeroLineColor: "transparent"
            },
            ticks: {
              padding: 50,
              fontColor: "rgba(0,0,0,0.5)",
              fontStyle: "bold",
              labelOffset: offset,
            }
          }]
        }
      },
      tooltips: {
            mode: "label"
          }
    });
  }

  handlePlotRequest(event) {
    // alert('An essay was submitted: ' + this.state.value);
    // console.log("Submit clicked");
    
    // var response = fetch('http://localhost:5000/get_sentiment', {
    //   method: 'GET',
    //   headers: {
    //     'Accept': 'application/json',
    //     'Access-Control-Allow-Origin': '*',
    //     'mode': 'no-cors',
    //   }
    // }).then(response => console.log(response.data));

    // fetch('http://localhost:5000/get_sentiment').then(response => console.log(response.json().then(value => console.));
    fetch('http://localhost:5000/get_sentiment').then(function(response) { 
        return response.json();
      }).then(function(myjson) {
        //console.log(myjson['params']);
        // this.plotData(myjson['params']);
        // return myjson['params'];

        var data_vals = myjson['params'];

        var input = data_vals;
    
    // data_vals[input.length + 1] = input[input.length-1]
    console.log(data_vals)
    var ctx = document.getElementById('myChart').getContext("2d");
    var rect = document.getElementById('myChart').getBoundingClientRect();
    console.log(rect.top, rect.right, rect.bottom, rect.left);

    var gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
    gradientStroke.addColorStop(1, '#80b6f4');
    gradientStroke.addColorStop(0, '#f49080');

    var x_happy = new Image();
    var happy = new Image();
    var sad = new Image();
    var x_sad = new Image();
    var neutral = new Image();

    x_happy.src = "/images/extreme-happy.png";
    x_sad.src = "/images/extreme-sad.png";
    sad.src = "/images/normal-sad.png";
    happy.src = "/images/normal-happy.png";
    neutral.src = "/images/neutral-face.png";
    
    var emotional_arr = [x_sad, sad, neutral, happy, x_happy]

    //plot_points = ['rect', 'rect', x_happy, 'circle', 'rect', 'triangle', 'circle'];
    // var chungus = new Image()
  //    chungus.src ='chungus\ (1).png';
      // chungus.style.width = '5px'
      // chungus.style.height = '10px'
    // var gradientFill = ctx.createLinearGradient(500, 0, 100, 0);

    // plot_points = ["circle"]
    var plot_points = []
    for(var i = 0; i < input.length; i++) {
      plot_points[i] = emotional_arr[parseInt((input[i]-1)/20)]
    }
    // plot_points[input.length+1] = "circle"
    console.log(plot_points)
    var gradientFill = ctx.createLinearGradient((rect.left+rect.right)/2, rect.top, (rect.left+rect.right)/2, rect.top + rect.bottom*3);
    // gradientFill.addColorStop(0, "rgba(128, 182, 244, 0.6)");
    // gradientFill.addColorStop(1, "rgba(244, 144, 128, 0.6)");


    gradientFill.addColorStop(0, "rgba(244, 144, 128, 0.7)");
    gradientFill.addColorStop(1, "rgba(128, 182, 244, 0.7)");

    var offset = 50
    Chart.pluginService.register({
        afterUpdate: function(chart) {
            // We get the dataset and set the offset here
            var dataset = chart.config.data.datasets[0];

            // For every data in the dataset ...
            for (var i = 0; i < dataset._meta[0].data.length; i++) {
                // We get the model linked to this data
                var model = dataset._meta[0].data[i]._model;

                // And add the offset to the `x` property
                model.x += offset;

                // .. and also to these two properties
                // to make the bezier curve fits the new graph
                model.controlPointNextX += offset;
                model.controlPointPreviousX += offset;
            }
        }
    });

    var myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", ""],
        // labels: ["f", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "f"],
        datasets: [{
          label: "Data",
          borderColor: gradientStroke,
          pointBorderColor: gradientStroke,
          pointBackgroundColor: gradientStroke,
          pointHoverBackgroundColor: gradientStroke,
          pointHoverBorderColor: gradientStroke,
          pointBorderWidth: 10,
          pointHoverRadius: 10,
          pointHoverBorderWidth: 1,
          pointRadius: 3,
          fill: true,
          backgroundColor: gradientFill,
          borderWidth: 10,
          pointStyle: plot_points,
          data: data_vals
        }]
      },
      options: {
        legend: {
          position: "bottom"
        },
        layout: {
              padding: {
                  left: 50,
                  right: 0,
                  top: 0,
                  bottom: 0
              }
          },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: "rgba(0,0,0,0.5)",
              fontStyle: "bold",
              beginAtZero: true,
              maxTicksLimit: 22,
              padding: 60,
              stepSize: 5,
              fontSize: 60,
              max: 100,
              labelOffset: offset,
              callback: function(label, index, labels) {
                    switch (label) {
                      // case 0:
                      //  return ''
                        case 10:
                            return '😭 ';
                        // case 20:
                        //  return '';
                        case 30:
                            return '😔 ';
                        // case 40:
                        //  return '40';
                        case 50:
                            return '😐 ';
                        // case 60:
                        //  return '60';
                        case 70:
                            return '🙂 ';
                        // case 80:
                        //  return '80';
                        case 90:
                            return '😁 ';
                        // case 100:
                        //     return '100';
                    }
                }
            },
            gridLines: {
              drawTicks: false,
              display: false
            }

          }],
          xAxes: [{
            categories: ['1', '2', '3', '4', '5', '6', '7'],
            gridLines: {
              zeroLineColor: "transparent"
            },
            ticks: {
              padding: 50,
              fontColor: "rgba(0,0,0,0.5)",
              fontStyle: "bold",
              labelOffset: offset,
            }
          }]
        }
      },
      tooltips: {
            mode: "label"
          }
    });

      });
    // console.log(response);

    // var fs = require('fs');
    // fs.readFile("/Users/mananrai/Desktop/Treehacks/2019/ours/my-app/python/data_sentiment.json", (err, data) => { 
    //     if (err) throw err; 
      
    //     console.log(data.toString()); 
    // });
    // console.log(data)
    //this.plotData(data);

    event.preventDefault();
  }

  handleSubmit(event) {
    // alert('An essay was submitted: ' + this.state.value);
    // console.log("Submit clicked");
    this.echo(this.state.value);
    var src = {text: this.state.value};
    var json = this.buildJSON(src);
    console.log(json);
    var response = fetch('http://localhost:5000/post_sentiment', {
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

  // render() {
  //   return (
  //     <div className="background">
  //       <div class="intro">
  //         <p>ment.ally</p>
  //         <div id="my-login-button-target" />
  //       </div>

  //       <div class="form-wrap">
  //         <form onSubmit={this.handleSubmit}>
  //           <label>
  //             <textarea value={this.state.value} onChange={this.handleChange} placeholder={this.state.placeholder} />
  //           </label>
  //           <div>
  //             <input type="submit" value="Submit" />
  //           </div>
  //         </form>
  //         <form onSubmit={this.handlePlotRequest}>
  //           <input type="submit" value="Plot" />
  //         </form>
  //       </div>

  //       <div class="map-wrap">
  //         <canvas id="myChart"></canvas>
  //       </div>

  //       <div class="map-wrap">
  //         <div id="viewDiv"></div>
  //       </div>
  //     </div>
  //   );
  // }

  render() {
    return (
      <div className="background">
        <div class="intro">
        <h1>ment.ally</h1>
          <p>Helping individuals visualize and track their emotions through the text they write.</p>
        <div id="my-login-button-target" />
        </div>

        <div class="row">
          <div class="column">
              <form onSubmit={this.handleSubmit}>
                <label>
                  <textarea class="sentence-entry" value={this.state.value} onChange={this.handleChange} placeholder={this.state.placeholder} />
                </label>
                <div>
                  <input type="submit" value="Submit" />
                </div>
              </form>
              <form onSubmit={this.handlePlotRequest}>
                <input type="submit" value="Plot" />
              </form>
          </div>
          <div class="column2">
            <h1>What if you could rethink your emotionally charged messages while using the information meaningfully? </h1>
            <p>ment.ally is a web app that allows you to view the emotions behind the messages you write. Using the data, it graphs your emotions as a visual way to check in on how you are doing. A map integration shows location-based trends in emotions and a texting feature notifies your friends when you seem to be feeling down. </p>
            <p> Looking forward, we hope that this can become a Chrome extension that detects emotionally charged sentences you write in real time and offers alternate suggestions to reduce the chance of unintended miscommunication.</p>
          </div>
        </div>

        <div class="graph-wrap">
          <canvas id="myChart"></canvas>
        </div>

        <div class="map-wrap">
          <div id="viewDiv"></div>
        </div>

        <div class="emergency-contacts">
          <p>Enter your emergency contacts</p>
          <form onSubmit={this.handleSubmit}>
            <label>
              <textarea class="contacts-entry" value={this.state.value} onChange={this.handleChange} placeholder="Enter phone number" />
            </label>
            <div class="button-row">
              <form onSubmit={this.handleSubmit}>
                <input type="submit" class="add-contacts" value="Submit" />
              </form>
              <form onSubmit={this.handleSubmit}>
                <input type="submit" class="add-contacts" value="Plot" />
              </form>
            </div>
          </form>
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
