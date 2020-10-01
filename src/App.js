import React, {useRef} from 'react';
import './App.css';

import * as tf from '@tensorflow/tfjs'
import * as posenet from '@tensorflow-models/posenet'
import Webcam from 'react-webcam'
import {drawKeypoints, drawSkeleton} from "./utilities"

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);


  // Load Posenet
  const runPosenet = async () => {
    const net = await posenet.load({
      inputResolution: {width: 640, height: 480},
      scale: .5
    })

    setInterval(() => {
      detect(net)
    }, 100)
  }

  const drawCanvas = (pose, video, videoWidth, videoHeight, canvas) => {
    const ctx = canvas.current.getContext("2d");
    canvas.current.width = videoWidth;
    canvas.current.height = videoHeight;

    drawKeypoints(pose["keypoints"], 0.5, ctx);
    drawSkeleton(pose["keypoints"], 0.5, ctx);
  }

  const detect = async (net) => {
    if(typeof webcamRef.current !== "undefined" && webcamRef.current !== null && webcamRef.current.video.readyState === 4){
      // Video Properties
      const video = webcamRef.current.video
      const videoWidth = webcamRef.current.video.videoWidth
      const videoHeight = webcamRef.current.video.videoHeight

      // set Video width

      webcamRef.current.video.width = videoWidth
      webcamRef.current.video.height = videoHeight

      // Make Detections

      const pose = await net.estimateSinglePose(video)
      
      drawCanvas(pose, video, videoWidth, videoHeight, canvasRef);
    }
  }

  runPosenet();

  return (
    <div className="App">
      <header className="App-header">
       <Webcam 
          ref={webcamRef}
          style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 9,
          width: 860,
          height: 640
        }} />

        <canvas 
          ref={canvasRef}
          style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 9,
          width: 980,
          height: 640
        }} />

      </header>
    </div>
  );
}

export default App;
