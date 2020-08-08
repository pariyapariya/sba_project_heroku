function init() {

  var url = "/loan_frequency";
  d3.json(url).then(function(res) {

    var year = res.map(d => d.Year);
    var industry = res.map(d => d.Industry_Classification);
    var counts = res.map(d => d.Industry_Counts);

    var counts_sorted = counts.sort(function(a,b){return b-a});
    var counts_top10 = counts_sorted.slice(0,10);

    console.log(year.slice(0,10));
    console.log(industry.slice(0,10));
    console.log(counts_top10);

    var trace = [{
      'y': industry,
      'x': counts_top10,
      type: 'bar',
      orientation: 'h',
      marker:{
                color: ['#355070',
                '#B56576',
                '#BB7E8C',
                '#6D597A',
                '#FFE66D',
                '#355070',
                '#B56576',
                '#BB7E8C',
                '#6D597A',
                '#FFE66D']
      },
      text: industry.map(String),
      textposition: 'auto'
    }];

    var layout = {
      title: "Loan Frequency on Industry Classifications",
      xaxis: {
        title: "Loan Frequency"
      },
      yaxis: {
        title: "Business Industries",
        showticklabels: false
      }
    };

    Plotly.newPlot("plot_freq", trace, layout);
  });
}
init();



d3.select('#selectYear').on('change', updateYear);

function updateYear() {

  yearSelected = d3.select('#selectYear').node().value

  console.log(`selected year is ${yearSelected}`);

  var url = "/loan_frequency";
  d3.json(url).then(function(res) {

    // Use filter() to filter yearly data
    var filtered_data = res.filter(d => d.Year == yearSelected);

    var industry = filtered_data.map(d => d.Industry_Classification);
    var counts = filtered_data.map(d => d.Industry_Counts);

    var counts_sorted = counts.sort(function(a,b){return b-a});
    var counts_top10 = counts_sorted.slice(0,10);

    console.log(`TOP 10 FOR ${yearSelected} ARE ${counts_top10}`);
    console.log(industry.slice(0,10));
    console.log(counts_top10);

    var trace = [{
      'y': industry,
      'x': counts_top10,
      type: 'bar',
      orientation: 'h',
      marker:{
        color: ['#738396',
                '#4ECDC4',
                '#BB7E8C',
                '#FF6B6B',
                '#FFE66D',
                '#738396',
                '#4ECDC4',
                '#BB7E8C',
                '#FF6B6B',
                '#FFE66D']
      },
      text: industry.map(String),
      textposition: 'auto'

    }];

    var layout = {
      title: "Loan Frequency on Industry Classifications",
      xaxis: {
        title: "Loan Frequency"
      },
      yaxis: {
        title: "Business Industries",
        showticklabels: false
      }
    };

    Plotly.react("plot_freq", trace, layout);
  });
}
