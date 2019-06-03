# Process Notes

From the Eyeo class by Hannah Davis at EYEO, June 2019

## Getting Started

Forked & downloaded the class code from [Hannah's repo](https://github.com/handav/friendly_ml5).

Got a node server running based on [this guide](https://github.com/processing/p5.js/wiki/Local-server).

```
cd eyeo-friendly-ml5
npm init --yes
npm install http-server
http-server
```

Then opened http://127.0.0.1:8080

Navigated to `starting_template` folder where the `index.html` loaded.

Make sure you command-shift-R to refresh pages on local host.

Navigated to the examples folder here: `cd jkeefe-github/eyeo-friendly-ml5/ml5-examples/p5js`

# Classifiers

## Image classification

In `ml5-examples/p5js/ImageClassification/ImageClassification/`

From the browser we went into http://127.0.0.1:8080/ml5-examples/p5js/ImageClassification/ImageClassification/

Can always get details of these models in `/models.md`

Based on MobileNet, which is mostly household objects and animals

### Video

Can also console.log the results in the browser.

## Sentiment

(based on IMDB movie reviews)

## PoseNet

Take a look at the info in the console.

## Pitch Detection

The model is hosted in the model folder here.

Also returns the frequency and midi notes

can use p5 sound or soundjs to convert the freq into the note

need to click to start

## UNET

segmenting people
need decent lighting

## Sound classifier

Recognizes speech

# Generators

## CharRNN

can generate music using character generators

lower temperature makes more conservative predictions

there are other corpus models you can pass in ... can download more on the ml5.js site

fun but maybe less artistically useful

## SketchRNN

Based on Google's Quick Draw

## CVAE

Variational Auto-encocders -- used for generation

based on the quick draw dataset

uses latent space ... an n-dimentional space of all the possibilites from the model

- a representation of your dataset
- determines the most "pants-like" variable
- makes a vector of those most important things
- then you use *that* to generate an image

Input -> network -> results -> network -> Output

# Transfer Learning!

Training with just a few examples.

## FeatureExtractor

```
// Other options you might want to play around with:
// const options = {
//   learningRate: 0.0001,
//   hiddenUnits: 100,
//   epochs: 20,
//   numClasses: 3,
//   batchSize: 0.4,
// }
```



