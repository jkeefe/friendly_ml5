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

let notes = [ 60, 62, 64, 65, 67, 69];
let trigger = 0;
let autoplay = false;
let osc;

var button;
var button_state = false;

function setup() {
    createCanvas(640, 480);
        
    // set up the video
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
    
    // make a button
    button = createButton('Click to toggle sound');
    button.position(19, 100);
    button.hide()
    button.mousePressed(toggleSound);
    
    // A triangle oscillator
    osc = new p5.TriOsc();
    // Start silent
    osc.start();
    osc.amp(0);

    var myDiv = createDiv('click to start audio');
    myDiv.position(0, 0);

    // Start the audio context on a click/touch event
    userStartAudio().then(function() {
        myDiv.remove();
    });
    
    function touchStarted() {
        if (getAudioContext().state !== 'running') {
            getAudioContext().resume();
        }
    }
    
}

function modelReady() {
    select('#status').html('Model Loaded');
    button.show()
    osc.amp(0);
}

function draw() {
    image(video, 0, 0, width, height);

    console.log(poses);

    // We can call both functions to draw all keypoints and the skeletons
    drawKeypoints();
    drawSkeleton();
    wristToNote();
}

function toggleSound() {
    
    if (!button_state) {
        osc.amp(1.0,0.01);
        button_state = true;
    } else {
        osc.amp(0);
        button_state = false;
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


function wristToNote() {
    
    // return if no poses yet
    if (!poses || poses.length < 1) {
        return;
    } 
    
    // map the position of right wrist onto the set of notes
    let right_wrist_y = poses[0].pose.rightWrist.y
    let right_wrist_confidence = poses[0].pose.rightWrist.confidence
    
    // check the rightwrist keypoint score [10] to see if it's in view
    if (poses[0].pose.keypoints[10].score > 0.2) {
        
        let note = parseInt( map(right_wrist_y, 0, height, notes.length -1, 0), 10)
        console.log(right_wrist_y, note, notes[note], right_wrist_confidence)
        playNote(notes[note])
        
    }


}

// A function to play a note
function playNote(value) {
    // set the note
    osc.freq(midiToFreq(value));
        
    // // Fade it in
    // osc.fade(0.5,0.2);
    
}

// 
// function drawWaveform(valueY, valueX) {
//     // background(30);
// 
// 
// 
//     // map mouseY to modulator freq between a maximum and minimum frequency
//     let modFreq = map(valueY, height, 0, modMaxFreq, modMinFreq);
//     modulator.freq(modFreq);
// 
//     // change the amplitude of the modulator
//     // negative amp reverses the sawtooth waveform, and sounds percussive
//     //
//     let modDepth = map(valueX, 0, height, modMaxDepth, modMinDepth);
//     modulator.amp(modDepth);
// 
//     console.log(valueY, valueX, modDepth, modFreq);
// 
//     // // analyze the waveform
//     // waveform = analyzer.waveform();
//     // 
//     // // draw the shape of the waveform
//     // stroke(255);
//     // strokeWeight(10);
//     // beginShape();
//     // for (let i = 0; i < waveform.length; i++) {
//     //     let x = map(i, 0, waveform.length, 0, width);
//     //     let y = map(waveform[i], -1, 1, -height / 2, height / 2);
//     //     vertex(x, y + height / 2);
//     // }
//     // endShape();
//     // 
//     // strokeWeight(1);
//     // // add a note about what's happening
//     // text('Modulator Frequency: ' + modFreq.toFixed(3) + ' Hz', 20, 20);
//     // text(
//     //     'Modulator Amplitude (Modulation Depth): ' + modDepth.toFixed(3),
//     //     20,
//     //     40
//     // );
//     // text(
//     //     'Carrier Frequency (pre-modulation): ' + carrierBaseFreq + ' Hz',
//     //     width / 2,
//     //     20
//     // );
// }
// 
// // // helper function to toggle sound
// // function toggleAudio(video) {
// //     video.mouseOver(function() {
// //         carrier.amp(1.0, 0.01);
// //     });
// //     video.touchStarted(function() {
// //         carrier.amp(1.0, 0.01);
// //     });
// //     video.mouseOut(function() {
// //         carrier.amp(0.0, 1.0);
// //     });
// // }
