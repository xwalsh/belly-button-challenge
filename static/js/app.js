// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

      // Get the samples field
      let samples = data.samples;
      console.log("samples:", samples);

      // Filter the samples for the object with the desired sample number
      let resultArray = samples.filter((sampleDictionary) => sampleDictionary.id === sample);
      let result = resultArray[0];

      // Get the otu_ids, otu_labels, and sample_values using destructuring
      let { otu_ids: otuIDs, otu_labels: otuLabels, sample_values: sampleValues } = result;

      // Build a Bubble Chart
      let bubbleLayout = {
          title: "Bacteria Cultures Per Sample",
          margin: { t: 0 },
          hovermode: "closest",
          xaxis: { title: "OTU ID" },
          margin: { t: 30 }    
      };

      let bubbleData = [{
          x: otuIDs,
          y: sampleValues,
          text: otuLabels,
          mode: "markers",
          marker: {
              color: otuIDs,
              size: sampleValues,
              colorscale: "Earth"
          }
      }];

      // Render the Bubble Chart
      Plotly.newPlot("bubble", bubbleData, bubbleLayout);

      // For the Bar Chart, map the otu_ids to a list of strings for your yticks
      let yticks = otuIDs.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();

      // Build a Bar Chart
      // Don't forget to slice and reverse the input data appropriately
      let barData = [{
          y: yticks,
          x: sampleValues.slice(0, 10).reverse(),
          text: otuLabels.slice(0, 10).reverse(),
          type: "bar",
          orientation: "h"
      }];

      let barLayout = {
          title: "Top 10  Bacteria Cultures Found",
          xaxis: { title: "Number of Bacteria" },
          margin: { t: 30, l: 150 }
      };

      // Render the Bar Chart
      Plotly.newPlot("bar", barData, barLayout);
  });
}

// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

      // get the metadata field
      let metadata = data.metadata;
      console.log("metadata:", metadata);

      // Filter the metadata for the object with the desired sample number
      let resultArray = metadata.filter(sampleDictionary => sampleDictionary.id == sample);
      let result = resultArray[0];

      // Use d3 to select the panel with id of `#sample-metadata`
      let PANEL = d3.select("#sample-metadata");

      // Use `.html("") to clear any existing metadata
      PANEL.html("");

      // Instead of a for..in loop, iterate over Object.entries for clarity
      Object.entries(result).forEach(([key, value]) => {
          // Inside a loop, you will need to use d3 to append new
          // tags for each key-value in the filtered metadata.
          PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
     
  });
}

// Function to run on page load
function init() {

  // Get the names field
  let selector = d3.select("#selDataset");

  // Use d3 to select the dropdown with id of `#selDataset`
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
   
      let sampleNames = data.names;
      console.log("sample names:", sampleNames);

      // Use the list of sample names to populate the select options
      // Hint: Inside a loop, you will need to use d3 to append a new
      // option for each sample name.
      sampleNames.forEach(function(name) {
          selector.append("option").text(name).property("value", name);
      });

      // Get the first sample from the list
      let firstSample = sampleNames[0];

      // Build charts and metadata panel with the first sample
      buildCharts(firstSample);
      buildMetadata(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
