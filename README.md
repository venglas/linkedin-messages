todo:
* API
  - configure ✅
  - add test route ✅
  - connect with db ✅
  - add test model ✅
  - save test data ✅
  - add route for start bot ✅
  - add route for stop bot✅
  - add route to check bot status ✅
  - add collecting logs for get it from front ✅



* Bot
  - configure puppeter ✅
  - open chromium ✅
  - login page ✅
  - go to contact ✅
  - check gender on selecting msg ✅
  - user target selector ✅
  - type & send message ✅
  - sending only when contact messages are empty ✅
  - add cfg how much msg to send ✅
  - stop on request (close browser) ✅

* production
  - configure ngrok for API ✅

* Interface
  * add auth to api page ✅
    - save api auth key as cookie and check it everytime on open 
  * add login page ✅
    - username, login to linked in ✅
  * add bot interface
    - pole wyboru wysylaj do: plec, woje., ✅ 
    - tresc wiadomosci✅ 
    - start / stop bot✅
    - connect request stop bot to button ✅
    - bot status ✅
  * add netlify automatic build
  * add detector for local and web env


* server:
 - add ngrok ✅

## guide:
- git clone
- npm i
- cd to project
- mkdir /logs
- cd /logs && touch logs.log
downoad ngrok
download forever
start api: forever start -a --uid libot index.js
start ngrok: ./ngrok http 9090 -log=stdout > li_bot_ngork.log &
