let localMediaStream = navigator.mediaDevices.getUserMedia ||
                       navigator.webkitGetUserMedia ||
                       navigator.mozGetUserMedia;


// Add TURN server credentials here
let turnConfig = {
  iceServers: [
    {
      urls: "turn:a.relay.metered.ca:443?transport=tcp",
      username: "f6c9f5111d84bbb4dc6b9a88",
      credential: "5LmMVJz8Lhap2BNJ",
    },
  ],
};
