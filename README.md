# 📺 UltraScreen
UltraScreen is a screensharing web app.

## Introduction
You can share your screen to another UltraScreen user. This project uses [PeerJS](https://peerjs.com/) to broker connections and abstract direct WebRTC interactions in code. As the [WebRTC standard](https://datatracker.ietf.org/doc/html/rfc8831) specifies, your stream is secured with [SRTP](https://datatracker.ietf.org/doc/html/rfc3711) and all stream data flows between you and your connected peers (No TURN server is specified in ultrascreen).

For connection brokering, it uses the free PeerServer Cloud service provided by PeerJS, which you can support [here](https://opencollective.com/peer).

This is a rewrite of the electron-vue version, which was a publish-and-forget project for me. I wanted to learn the Angular framework and decided to do this with this rewrite (and also address open issues).  The rewrite is based upon the [angular-electron](https://github.com/maximegris/angular-electron) template, which currently uses Angular v14 and Electron v19.

The default stream resolution is currently always 1280x720.

## Download UltraScreen
You can download desktop versions of UltraScreen for Windows and Linux (AppImage) at the [Release Page](https://github.com/w3yden/ultrascreen/releases).

Now you can also use it directly in your webbrowser. (Link coming soon)
## Gallery

![alt text](https://github.com/w3yden/ultrascreen/blob/master/screenshots/Preview.png "")