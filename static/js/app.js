let sample_url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
let sample_data = null;

let plotly_initialized = false;

let bar_x = null;
let bar_y = null;
let bar_text = null;

d3.json(sample_url).then((data) => {
    sample_data = data;
    loadTestSubjectIds();
});

function loadTestSubjectIds() {
    var select = d3.select("#selDataset");
    sample_data.names.forEach((name) => {
        select
            .append("option")
            .text(name)
            .property("value", name);
    });
    optionChanged(sample_data.names[0]);
}

function optionChanged(value) {
    if (null != sample_data) {
        var metadata = sample_data.metadata.find((data) => data.id == value);
        if (null != metadata) {
            d3.select("#sample-metadata").html(`
            id: ${metadata.id}<br/>
            ethnicity: ${metadata.ethnicity}<br/>
            gender: ${metadata.gender}<br/>
            age: ${metadata.age}<br/>
            location: ${metadata.location}<br/>
            bbtype: ${metadata.bbtype}<br/>
            wfreq: ${metadata.wfreq}<br/>
            `);
        }

        var selected_sample_data = sample_data.samples.find((data) => data.id == value);
        if (null != selected_sample_data) {
            var sample_values_copy = [];
            selected_sample_data.sample_values.forEach((data, i) => sample_values_copy.push([data, i]));

            bar_x = [];
            bar_y = [];
            bar_text = [];

            var top_10_otus = sample_values_copy.sort((a, b) => b[0] - a[0]).slice(0, 10).reverse();
            top_10_otus.forEach((item) => {
                data = item[0];
                index = item[1];

                bar_x.push(data);
                bar_y.push("OTU" + selected_sample_data.otu_ids[index]);
                bar_text.push(selected_sample_data.otu_labels[index]);
            });

            if (plotly_initialized) {
                rePlotData();
            } else {
                plotly_initialized = true;
                plotData();
            }
        }
    } else {
        alert("Data not loaded yet...")
    }
}

function plotData() {
    let trace = {
        x: bar_x,
        y: bar_y,
        text: bar_text,
        type: "bar",
        orientation: "h"
    };
    
    let data = [trace];
    
    Plotly.newPlot("bar", data);
}

function rePlotData() {
  Plotly.restyle("bar", "x", [bar_x]);
  Plotly.restyle("bar", "y", [bar_y]);
  Plotly.restyle("bar", "text", [bar_text]);
}
