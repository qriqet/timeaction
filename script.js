let start = 0;
let stop = 2047 * 60;
let saveAndQuits = [];
function timeActiveIterator(start = 0, end = stop, timeRateEvents = {}, pauseFrames = [], sqs = []) {
  let iterationCount = 0;
  let pauseIterCount = 0;
  let timeActive = start;
  let timeRate = 1;
  let deltaTime = 0;

  const rangeIterator = {
    next() {
      if (iterationCount == 0) {
        iterationCount++;
        return { value: [timeActive,deltaTime], done: false };
      }
      if (iterationCount in timeRateEvents) {
        timeRate = timeRateEvents[iterationCount];
      }
      if (sqs.includes(iterationCount)) {
        timeActive = 0;
      } else {
        deltaTime = -timeActive;
        timeActive = Math.fround(timeActive + Math.fround(Math.fround(0.0166667) * timeRate));
        deltaTime += timeActive;
      }
      if (iterationCount < end) {
        if (pauseFrames.includes(iterationCount) && pauseIterCount < 10) {
          pauseIterCount++;
        } else {
          pauseIterCount = 0;
          iterationCount++;
        }
        return { value: [timeActive,deltaTime], done: false };
      }
      return { value: [timeActive,deltaTime], done: true };
    },
    [Symbol.iterator]() {
      return this;
    },
  };

  return rangeIterator;
}

let summit = {
  5828: 0.5, 5855: 1, 10084: 0.5, 10111: 1, 13757: 0.5, 13784: 1, 21668: 0.5, 21695: 1,
  29906: 0.5, 29933: 1,
  37013: 0.5, 37040: 1,
  //38115:0.5, 38142:1,
  44043: 0.5, 44070: 1
}

summit = {
  1: 0.5, 28: 1
}
summit = {}

let xArray = Array.from(Array(stop).keys(), (x) => x / 60);
let yArray = Array.from(timeActiveIterator(0, stop, summit), (x) => x[1] * 60 % 1);

// Define Data
let data = [{
  x: xArray,
  y: yArray,
  mode: "lines",
  type: "scatter",
}];

// Define Layout
let layout = {
  xaxis: { autorange: true, title: "Time" },
  yaxis: { range: [0, 1], fixedrange: true, title: "Spinner group % 1" },
  title: "Time vs Spinner group % 1",
  dragmode: "pan",
  shapes: []
};

// Display using Plotly
Plotly.newPlot("mod1", data, layout, { modeBarButtonsToRemove: ["zoom2d", "autoscale"], scrollZoom: true, displaylogo: false, responsive: true });0.2, 1.06, 1.79)

let pauses = [];
let stunStart = 0;
let stunStop = 33;
let stunGraph = [];
let stunXArray;
let stunYArray;
let lagStunYArray;

let stunData;

let stunLayout = {
  xaxis: { autorange: true, title: "Frames since stun start" },
  yaxis: { range: [0, 3], fixedrange: false, title: "Spinner group" },
  title: "Frames since stun start vs Spinner group",
  dragmode: "pan"
};

let spinnerGroup = 1.8916962147;
let badelineThrow = { 1: 0.75, 10: 0.7619, 11: 0.7738, 12: 0.7857, 13: 0.7976, 14: 0.8095, 15: 0.8214, 16: 0.8333, 17: 0.8452, 18: 0.8571, 19: 0.8690, 20: 0.8810, 21: 0.8929, 22: 0.9048, 23: 0.9167, 24: 0.9286, 25: 0.9405, 26: 0.9524, 27: 0.9643, 28: 0.9762, 29: 0.9881, 30: 1 };
badelineThrow = {1:0.4};
pauses = [1, 2, 5, 6, 9, 10, 13, 14, 17, 18, 21, 22, 25, 26, 29, 30];
pauses = []

function updateStunGraph() {
  stunXArray = Array.from(Array(stunStop).keys(), (x) => x);
  stunYArray = Array.from(timeActiveIterator(stunStart, stunStop, badelineThrow, pauses), (x) => x[0] * 60 % 3);
  dtArray = Array.from(timeActiveIterator(stunStart, stunStop, badelineThrow, pauses), (x) => x[1] * 60);
  stunData = [{
    x: stunXArray,
    y: stunYArray,
    mode: "markers",
    type: "scatter"
  }];

  //lagStunYArray = structuredClone(stunYArray);
  //lagStunYArray.unshift(0);

  pauses.sort(function(a, b) {
    return a - b;
  });
  for (let i = 0; i < pauses.length; i++) {
    stunYArray.splice(pauses[i], 10);
    dtArray.splice(pauses[i], 10);
    //lagStunYArray.splice(pauses[i], 10);
  }
  stunGraph = [];
  // Define Data
  for (let i = 0; i < stunXArray.length; i++) {
    if (stunYArray[i] > 3 - dtArray[i]) {
      stunGraph.push({
        'type': 'rect', xref: "x", yref: "y", layer: "between", fillcolor: "red", 'line': { 'width': 0, },
        'x0': stunXArray[i], 'y0': stunYArray[i],
        'x1': stunXArray[i] + 1, 'y1': 3,
      });
      stunGraph.push({
        'type': 'rect', xref: "x", yref: "y", layer: "between", fillcolor: "red", 'line': { 'width': 0, },
        'x0': stunXArray[i], 'y0': 0,
        'x1': stunXArray[i] + 1, 'y1': (stunYArray[i] + dtArray[i]) % 3,
      })
    } else {
      stunGraph.push({
        'type': 'rect', xref: "x", yref: "y", layer: "between", fillcolor: "red", 'line': { 'width': 0, },
        'x0': stunXArray[i], 'y0': stunYArray[i],
        'x1': stunXArray[i] + 1, 'y1': stunYArray[i] + dtArray[i],
      })
    }
  }

  /*for (let i = 0; i < stunXArray.length - 1; i++) {
    if (lagStunYArray[i] > 2) {
      stunGraph.push({
        'type': 'rect', xref: "x", yref: "y", layer: "between", fillcolor: "green", opacity: 0.4, 'line': { 'width': 0, },
        'x0': stunXArray[i], 'y0': lagStunYArray[i],
        'x1': stunXArray[i] + 1, 'y1': 3,

      });
      stunGraph.push({
        'type': 'rect', xref: "x", yref: "y", layer: "between", fillcolor: "green", opacity: 0.4, 'line': { 'width': 0, },
        'x0': stunXArray[i], 'y0': 0,
        'x1': stunXArray[i] + 1, 'y1': lagStunYArray[i] - 2,
      })
    } else {
      stunGraph.push({
        'type': 'rect', xref: "x", yref: "y", layer: "between", fillcolor: "green", opacity: 0.4, 'line': { 'width': 0, },
        'x0': stunXArray[i], 'y0': lagStunYArray[i],
        'x1': stunXArray[i] + 1, 'y1': lagStunYArray[i] + 1,
      })
    }*/
  }

  for (let i = 0; i < pauses.length; i++) {
    stunGraph.push({
      'type': 'line', layer: "above", 'line': { 'width': 2, color: "blue" },
      'x0': pauses[i], 'y0': 0,
      'x1': pauses[i], 'y1': 3,

    });
  }
  if (typeof spinnerGroup == 'number' && !isNaN(spinnerGroup)) {
    stunGraph.push({
      'type': 'line', layer: "above", 'line': { 'width': 2, color: "green" },
      'x0': 0, 'y0': spinnerGroup,
      'x1': stunStop, 'y1': spinnerGroup,
    });
  }
  stunLayout["shapes"] = stunGraph;
}

updateStunGraph();
// Display using Plotly
Plotly.newPlot("stun", stunData, stunLayout, { modeBarButtonsToRemove: ["zoom2d", "autoscale"], scrollZoom: true, displaylogo: false, responsive: true });

function update() {
  Plotly.update("mod1", data, layout);
  Plotly.update("stun", stunData, stunLayout);
  console.log(stunData);
}

function showStunOptions() {
  hideOptions();
  document.getElementById("addStun").onclick = function() {
    addStun(
      parseFloat(document.getElementById("startTimeInput").value),
      parseFloat(document.getElementById("stopTimeInput").value),
      parseFloat(document.getElementById("minGroupInput").value),
      parseFloat(document.getElementById("maxGroupInput").value)
    )
  };
  document.getElementById("stunOptions").style.display = "block";
}

function showSaveAndQuitOptions() {
  hideOptions();
  document.getElementById("adds+q").onclick = addSaveAndQuit;
  document.getElementById("s+qOptions").style.display = "block";
}

function hideOptions() {
  document.getElementById("addStun").onclick = showStunOptions;
  document.getElementById("adds+q").onclick = showSaveAndQuitOptions;
  document.getElementById("stunOptions").style.display = "none";
  document.getElementById("s+qOptions").style.display = "none";
}

function addStun(startTime, stopTime, minGroup, maxGroup) {
  if (isNaN(startTime) || isNaN(stopTime) || isNaN(minGroup) || isNaN(maxGroup)) {
    return
  }
  layout["shapes"].push({
    'type': 'rect', xref: "x", yref: "paper", 'line': { 'color': minGroup % 1 > maxGroup % 1 ? 'green' : 'red', 'width': 1.5, },
    'x0': startTime, 'y0': minGroup % 1,
    'x1': stopTime, 'y1': maxGroup % 1,
  })
  Plotly.update("mod1", data, layout);
}

function addSaveAndQuit() {
  var time = Math.round(parseFloat(document.getElementById("timeInput").value) * 60);
  if (isNaN(time)) {
    return
  }
  layout["shapes"].push({
    'type': 'line',
    'x0': time / 60, 'y0': 0,
    'x1': time / 60, 'y1': 1,

    'line': {
      'color': 'red',
      'width': 1.5,
    }
  });
  saveAndQuits = [time];
  console.log(yArray)
  yArray = Array.from(timeActiveIterator(0, stop, {}, [], saveAndQuits), (x) => x[1] * 60 % 1);
  console.log(yArray)
  data = [{
    x: xArray,
    y: yArray,
    mode: "lines",
    type: "scatter",
  }];
  Plotly.react("mod1", data, layout);

}

function addPause() {
  var pauseTime = parseInt(document.getElementById("pauseTimeInput").value);
  if (isNaN(pauseTime) || pauseTime > stunStop) {
    alert("time is not valid")
    return
  } if (pauses.includes(pauseTime)) {
    pauses.splice(pauses.indexOf(pauseTime), 1)
  } else {
    pauses.push(pauseTime)
  }
  updateStunGraph();
  update();
}

function setTimeActive() {
  let tempStart = parseInt(document.getElementById("startTimeActiveInput").value);
  if (isNaN(tempStart)) {
    alert("time is not valid")
    return
  } else {
    stunStart = tempStart
  }
  updateStunGraph();
  update();
}

function setSpinnerGroup() {
  spinnerGroup = parseFloat(document.getElementById("spinnerGroupInput").value);
  if (isNaN(spinnerGroup)) {
    alert("time is not valid")
    return
  }
  updateStunGraph();
  update();
}
/*
var groupSlider = document.getElementById("spinnerGroupSlider")
var groupOutput = document.getElementById("groupOutput")
groupSlider.oninput = function () {
  groupOutput.innerHTML = this.value
  stunStart = (Math.floor(stunStart*2)*3+this.value)/60;
  updateStunGraph();
  update();
}*/
