let gauge_marker_colors = [
    "rgba(248,243,236,255)",
    "rgba(244,241,228,255)",
    "rgba(233,231,201,255)",
    "rgba(229,232,176,255)",
    "rgba(213,229,153,255)",
    "rgba(183,205,143,255)",
    "rgba(139,192,134,255)",
    "rgba(137,188,141,255)",
    "rgba(132,181,137,255)",
    "rgba(255,255,255,0)"
];
let gauge_needle_color = "rgba(133,0,0,255)";

let range_values = [];
let range_labels = [];

for (var i = 0; i < gauge_marker_colors.length - 1; ++i) {
    range_values.push(1);
    range_labels.push(i + "-" + (i + 1));
}
range_values.push(range_values.length);
range_labels.push("");

function plotGauge(metadata) {
    var data = [
        {
            type: 'scatter',
            x: [0], y:[0],
	        marker: {
                size: 16,
                color: gauge_needle_color
            },
            showlegend: false,
            text: metadata.wfreq,
            hoverinfo: 'text'
        },
        {
            type: "pie",
            values: range_values,
            text: range_labels,
            textinfo: 'text',
            textposition:'inside',
            labels: range_labels,
            hoverinfo: 'label',
            direction: "clockwise",
            rotation: 90,
            hole: 0.5,
            showlegend: false,
            marker: {
                colors: gauge_marker_colors
            }
        }
    ];

    var needleShape = recalculateNeedleShape(metadata.wfreq);
    var layout = {
        shapes:[needleShape],
        xaxis: {
            zeroline: false,
            showticklabels: false,
            showgrid: false,
            range: [-1, 1]
        },
        yaxis: {
            zeroline: false,
            showticklabels: false,
            showgrid: false,
            range: [-1, 1]
        }
    }

    Plotly.newPlot("gauge", data, layout);
}

function recalculateNeedleShape(level) {
    var maxLevel = gauge_marker_colors.length - 1;
    var degrees = 180 * ((maxLevel - level) / maxLevel);
    var radius = 0.46;
    var radians = degrees * Math.PI / 180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);

    var mainPath = 'M -.0 -0.025 L .0 0.025 L ';
	var pathX = String(x);
	var space = ' ';
	var pathY = String(y);
	var pathEnd = ' Z';
    var path = mainPath.concat(pathX,space,pathY,pathEnd);

    return {
        type: 'path',
        path: path,
        fillcolor: gauge_needle_color,
        line: {
            color: gauge_needle_color
        }
    };
}
