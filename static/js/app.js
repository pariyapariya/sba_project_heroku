function Businesstypes() {
    /* data route */
  var url = "/api/business_type_state";
  d3.json(url).then(function(response) {
  
    console.log(response);
  
    var bizType = response.map(business => business.BusinessType);
    var approve = response.map(approval => approval.GrossApproval);

    var trace = [{
      'y': bizType,
      'x': approve,
      'type': 'bar',
      text: approve.map(String),
      textposition: 'auto',
      orientation: 'h',
      marker:{
        color:'rgb(72, 92, 127)',
        opacity: 0.8
  }}];


    var layout = {
      autosize: false,
      width: 1000,
      height: 500,
      title: "Loans By Business Type",
      xaxis: {
        title: "Gross Approval ($)"
      }
    };

    Plotly.newPlot("plot", trace, layout);
  });
}

Businesstypes();

// Function to make Business Type Dynamic
d3.select('#state-selector').on('change', updateBusinessTypes);
function updateBusinessTypes() {
  /* data route */
  state = d3.select('#state-selector').node().value;
  var url = "/api/business_type_state";
  d3.json(url).then(function(response) {
      var stateData = response.filter(d => d.BorrState == state);
      var bizType = stateData.map(business => business.BusinessType);
      var approve = stateData.map(approval => approval.GrossApproval);

      var trace = [{
        'y': bizType,
        'x': approve,
        'type': 'bar',
        text: approve.map(String),
        textposition: 'auto',
        orientation: 'h',
        marker:{
          color:'rgb(72, 92, 127)',
          opacity: 0.8
  }}];
  
      var layout = {
        autosize: false,
        width: 1000,
        height: 500,
        title: "Loans By Business Type",
        xaxis: {
          title: "Business Type"
        }
      };


  Plotly.react("plot", trace,layout);
});
}

//CODE FOR FRANCHISE CHART//
function Franchise() {
    /* data route */
  var url = "/api/top_franchise";
  d3.json(url).then(function(response) {
  
    console.log(response);
  
    var franchiseName = response.map(franchise => franchise.FranchiseName);
    var grossApprove = response.map(approval => approval.GrossApproval);
    var year = response.map (year => year.ApprovalFiscalYear);
    
    var ctx = document.getElementById('myChart');
    var myChart = new Chart(ctx,{
        type: 'horizontalBar',
        data: {
            labels: franchiseName,
            datasets: [{
                // label: 'TOP FRANCHISES',
                data: grossApprove,
                backgroundColor: [
                    'rgba(222, 110, 75, 0.5)',
                    'rgba(199, 107, 83, 0.5)',
                    'rgba(176, 104, 90, 0.5)',
                    'rgba(153, 101, 97, 0.5)',
                    'rgba(143, 100, 104, 0.5)',
                    'rgba(130, 98, 105, 0.5)',
                    'rgba(107, 95, 112, 0.5)',
                    'rgba(84, 92, 120, 0.5)',
                    'rgba(133, 148, 164, 0.5)',
                    'rgba(61, 90, 128, 0.5)'

                    
                ],
                borderColor: [
                  'rgba(222, 110, 75, 1)',
                  'rgba(199, 107, 83, 1)',
                  'rgba(176, 104, 90, 1)',
                  'rgba(153, 101, 97, 1)',
                  'rgba(143, 100, 104, 1)',
                  'rgba(130, 98, 105, 1)',
                  'rgba(107, 95, 112, 1)',
                  'rgba(84, 92, 120, 1)',
                  'rgba(133, 148, 164, 1)',
                  'rgba(61, 90, 128, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
  });}
Franchise();

//CODE FOR TABLE: FILTERS FOR STATE 
function buildTable() {
    /* data route */
    var url = "/api/top_banks";
    d3.json(url).then(function(response) {
        state = d3.select('#state-selector-banks').node().value;
        var stateData = response.filter(d => d.BankState == state);

        var bankName = stateData.map(d => d.BankName);
        var bankCity = stateData.map(d => d.BankCity);
        var bankState = stateData.map(d => d.BankState);
        var avgApproval = stateData.map(d => d.AverageApproval);
      
        console.log(bankName);
        //var table = d3.select("#bank-table");
        //var tbody = table.select("tbody");
        var tbody = d3.select("#bank-tbody");
        console.log(tbody);
        var trow;
        tbody.html("");
      for (var i = 0; i < bankName.length; i++) {
        trow = tbody.append("tr");
        trow.append("td").text(bankName[i]);
        trow.append("td").text(bankCity[i]);
        trow.append("td").text(bankState[i]);
        trow.append("td").text(avgApproval[i]);
        }
    });
    }
    d3.select('#state-selector-banks').on('change', buildTable);
      // buildTable();



  //FUNCTION FOR SBA BY YEAR GRAPH ON INDEX.HTML
function sbaloans_by_year() {
  var url = "/api/sba_by_year";
  d3.json(url).then(function(response) {
    var year = response.map(d => d.ApprovalFiscalYear);
    var loans = response.map(d => d.GrossApproval);
    console.log(response);
    console.log(year);
    console.log(loans);

    var data = [{
      type: 'bar',
      x : loans,
      y : year,
      orientation: 'h',
      marker:{
        color:'rgb(72, 92, 127)',
        opacity: 0.7
    }}];
    var layout = {
      autosize: false,
      width: 1200,
      height: 700,
      xaxis:{
        title:"Loan Dollars ($Billions)"
        },
      yaxis:{
        title: "Fiscal Year"
      }
    };
  Plotly.newPlot('sbayear',data, layout);
});
}

sbaloans_by_year();
   

    

 