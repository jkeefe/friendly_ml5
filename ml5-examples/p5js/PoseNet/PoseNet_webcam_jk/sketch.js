// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
PoseNet example using p5.js
=== */

// pose settings
let video;
let poseNet;
let poses = [];

// audio settings
let carrier; // this is the oscillator we will hear

let modulator; // this oscillator will modulate the frequency of the carrier
let analyzer; // we'll use this visualize the waveform

// the carrier frequency pre-modulation
let carrierBaseFreq = 220;

// min/max ranges for modulator
let modMaxFreq = 440;
let modMinFreq = 50;
let modMaxDepth = 150;
let modMinDepth = -150;



function setup() {
    createCanvas(640, 480);
    video = createCapture(VIDEO);
    video.size(width, height);

    // Create a new poseNet method with a single detection
    poseNet = ml5.poseNet(video, type='single', modelReady);
    // This sets up an event that fills the global variable "poses"
    // with an array every time new poses are detected
    poseNet.on('pose', function(results) {
        poses = results;
    });
    // Hide the video element, and just show the canvas
    video.hide();
    
    carrier = new p5.Oscillator('sine');
    carrier.amp(0); // set amplitude
    carrier.freq(carrierBaseFreq); // set frequency
    carrier.start(); // start oscillating

    // try changing the type to 'square', 'sine' or 'triangle'
    modulator = new p5.Oscillator('sawtooth');
    modulator.start();

    // add the modulator's output to modulate the carrier's frequency
    modulator.disconnect();
    carrier.freq(modulator);

    // create an FFT to analyze the audio
    // analyzer = new p5.FFT();

    var myDiv = createDiv('click to start audio');
    myDiv.position(0, 0);

    // Start the audio context on a click/touch event
    userStartAudio().then(function() {
        myDiv.remove();
        carrier.amp(1.0, 0.01);
    });
    
    function touchStarted() {
        if (getAudioContext().state !== 'running') {
            getAudioContext().resume();
        }
    }
    
}

function modelReady() {
    select('#status').html('Model Loaded');
}

function draw() {
    image(video, 0, 0, width, height);

    // We can call both functions to draw all keypoints and the skeletons
    drawKeypoints();
    drawSkeleton();
    // console.log(poses);
    if (poses.length > 0) {
        drawWaveform(poses[0].pose.leftWrist.y, poses[0].pose.rightWrist.y);
    }
    
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints()  {
    // Loop through all the poses detected
    for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
        let pose = poses[i].pose;
        for (let j = 0; j < pose.keypoints.length; j++) {
            // A keypoint is an object describing a body part (like rightArm or leftShoulder)
            let keypoint = pose.keypoints[j];
            // Only draw an ellipse is the pose probability is bigger than 0.2
            if (keypoint.score > 0.2) {
                fill(255, 0, 0);
                noStroke();
                ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
            }
        }
    }
}

// A function to draw the skeletons
function drawSkeleton() {
    // Loop through all the skeletons detected
    for (let i = 0; i < poses.length; i++) {
        let skeleton = poses[i].skeleton;
        // For every skeleton, loop through all body connections
        for (let j = 0; j < skeleton.length; j++) {
            let partA = skeleton[j][0];
            let partB = skeleton[j][1];
            stroke(255, 0, 0);
            line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
        }
    }
}


function drawWaveform(valueY, valueX) {
    // background(30);
    
    

    // map mouseY to modulator freq between a maximum and minimum frequency
    let modFreq = map(valueY, height, 0, modMaxFreq, modMinFreq);
    modulator.freq(modFreq);

    // change the amplitude of the modulator
    // negative amp reverses the sawtooth waveform, and sounds percussive
    //
    let modDepth = map(valueX, 0, height, modMaxDepth, modMinDepth);
    modulator.amp(modDepth);

    console.log(valueY, valueX, modDepth, modFreq);

    // // analyze the waveform
    // waveform = analyzer.waveform();
    // 
    // // draw the shape of the waveform
    // stroke(255);
    // strokeWeight(10);
    // beginShape();
    // for (let i = 0; i < waveform.length; i++) {
    //     let x = map(i, 0, waveform.length, 0, width);
    //     let y = map(waveform[i], -1, 1, -height / 2, height / 2);
    //     vertex(x, y + height / 2);
    // }
    // endShape();
    // 
    // strokeWeight(1);
    // // add a note about what's happening
    // text('Modulator Frequency: ' + modFreq.toFixed(3) + ' Hz', 20, 20);
    // text(
    //     'Modulator Amplitude (Modulation Depth): ' + modDepth.toFixed(3),
    //     20,
    //     40
    // );
    // text(
    //     'Carrier Frequency (pre-modulation): ' + carrierBaseFreq + ' Hz',
    //     width / 2,
    //     20
    // );
}

// // helper function to toggle sound
// function toggleAudio(video) {
//     video.mouseOver(function() {
//         carrier.amp(1.0, 0.01);
//     });
//     video.touchStarted(function() {
//         carrier.amp(1.0, 0.01);
//     });
//     video.mouseOut(function() {
//         carrier.amp(0.0, 1.0);
//     });
// }
