var peer;
var devInfo = document.getElementById("info-messages");
function createRoom() {
  const roomId = document.getElementById("room-input").value.trim();

  devInfo.innerHTML = "Call in progress, please wait...";

  navigator.mediaDevices
    .getUserMedia({ video: true, audio: true })
    .then(function (mediaStream) {
      localMediaStream = mediaStream;

      peer = new Peer(roomId, { config: turnConfig });

      peer.on("error", function (err) {
        devInfo.innerHTML = "Peer Error:" + err;
      });

      peer.on("open", function (id) {
        devInfo.innerHTML = "Room created successfully! Room ID:" + id;
      });

      peer.on("call", function (call) {
        var currentCall = call;

        call.answer(localMediaStream);
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: false })
          .then(function (mediaStream) {
            localMediaStream = mediaStream;
            var video_local = document.getElementById("local-video");
            video_local.srcObject = localMediaStream;
            video_local.play();
            document.getElementById('conteiner-call').style.display = 'block';
            document.getElementById('conteiner-encerrar-chamada').style.display = 'block';
          })
          .catch(function (err) {
            devInfo.innerHTML = "Error getting media stream, unable to stream";
          });

        call.on("stream", function (remoteStream) {
          var remoteVideo = document.getElementById("remote-video");
          remoteVideo.srcObject = remoteStream;
          remoteVideo.play();
        });

        call.on("close", function () {
          devInfo.innerHTML = "Video connection terminated by the other side.";
        });

        peer.on("close", () => {
        devInfo.innerHTML = "Video connection terminated.";
        });

        document
          .getElementById("end-call-button")
          .addEventListener("click", function () {
            if (currentCall) {
              currentCall.close();
              devInfo.innerHTML = "The video call will end.";
            } else {
              devInfo.innerHTML = "The call is not defined. Unable to close.";
            }
          });
      });
    })
    .catch(function (err) {
      devInfo.innerHTML = "Error getting media stream, unable to stream";
    });
}
