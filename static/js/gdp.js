function stGDP() {

  var url = "/states_gdp";

  d3.json(url).then(function(res) {

    var key = Object.keys(res);
    var value = Object.values(res).slice(0,51);
    var st = (res.map(d => d.States)).slice(0,51);


    console.log(key[0]);
    console.log(value);
    console.log(value[0]);
    console.log('This is 2012 GDP ' + '$' + value[0]['2012'] + ' of ' + st[0]);
    console.log(st);


    // var gdpData = [];
    // for (i=0; i < value.length; i++) {
    //   var g =
    // }

    // var trace = [{
    //   'x': st,
    //   'y': y2012,
    //   'type': 'line'
    // }];
    //
    // var layout = {
    //   title: "Pet GDP Per Capita By States",
    //   xaxis: {
    //     title: "States"
    //   },
    //   yaxis: {
    //     title: "GDP Per Capita"
    //   }
    // };
    //
    // Plotly.newPlot("st_gdp", trace, layout);
  });
}

stGDP();
