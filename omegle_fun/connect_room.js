var peer;
var devInfo = document.getElementById("info-messages");

function joinRoom() {
  const destPeerId = document.getElementById("room-input").value.trim();

  navigator.mediaDevices
    .getUserMedia({ video: true, audio: true })
    .then(function (mediaStream) {
      localMediaStream = mediaStream;

      peer = new Peer({ config: turnConfig });

      peer.on("error", function (err) {
        
        devInfo.innerHTML = "Erro no Peer:" + err;
      });

      peer.on("open", function (id) {
        var conn = peer.connect(destPeerId);

        conn.on("open", function () {
          
          document.getElementById('conteiner-formulário').style.display = 'none';
          document.getElementById('conteiner-call').style.display = 'block';
          document.getElementById('conteiner-encerrar-chamada').style.display = 'block';

          var call = peer.call(destPeerId, localMediaStream);

          navigator.mediaDevices
            .getUserMedia({ video: true, audio: false })
            .then(function (mediaStream) {
              localMediaStream = mediaStream;
              var video_local = document.getElementById("local-video");
              video_local.srcObject = localMediaStream;
              video_local.play();
            })
            .catch(function (err) {
              devInfo.innerHTML = "Error getting media stream, unable to stream.";
            });

          call.on("stream", function (remoteStream) {
            var remoteVideo = document.getElementById("remote-video");
            remoteVideo.srcObject = remoteStream;
            remoteVideo.play();
          });

          call.on("close", function () {
            document.getElementById('conteiner-formulário').style.display = 'block';
            document.getElementById('conteiner-call').style.display = 'none';
            document.getElementById('conteiner-encerrar-chamada').style.display = 'none';
          });

          peer.on("close", () => {
            devInfo.innerHTML = "Video call ended.";
          });

          document
            .getElementById("end-call-button")
            .addEventListener("click", function () {
              if (peer) {
                peer.destroy();
                devInfo.innerHTML = "The video call will end.";
              } else {
                
                devInfo.innerHTML = "The pair is not defined. Unable to close.";
              }
            });
        });

        conn.on("error", function (err) {
          devInfo.innerHTML = "Connection error:" + err;
        });
      });
    })
    .catch(function (err) {
      devInfo.innerHTML = "Error getting media stream, unable to stream";
    });
}
