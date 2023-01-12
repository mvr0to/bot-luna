const makeWaSocket = require('@adiwajshing/baileys').default
const { DisconnectReason, fetchLatestBaileysVersion, useMultiFileAuthState, } = require('@adiwajshing/baileys')
const { readFileSync } = require('fs')
const P = require('pino')
const { unlink } = require('fs')
const express = require('express')
const http = require('http')
const port = process.env.PORT || 8005
const app = express()
const socketIO = require("socket.io")
const server = http.createServer(app)
const request = require('request')
const ZDGPath = './ZDGSessions/'
const ZDGAuth = 'auth_info.json'
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

const ZDGGroupCheck = (jid) => {
   const regexp = new RegExp(/^\d{18}@g.us$/)
   return regexp.test(jid)
}

  const ZDGUpdate = (ZDGsock) => {
   ZDGsock.on('connection.update', ({ connection, lastDisconnect, qr }) => {
      if (qr){
         console.log('© BOT-ZDG - Qrcode: ', qr);
      };
      if (connection === 'close') {
         const ZDGReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut
         if (ZDGReconnect) ZDGConnection()
         console.log(`© BOT-ZDG - CONEXÃO FECHADA! RAZÃO: ` + DisconnectReason.loggedOut.toString());
         if (ZDGReconnect === false) {
            const removeAuth = ZDGPath + ZDGAuth
            unlink(removeAuth, err => {
               if (err) throw err
            })
         }
      }
      if (connection === 'open'){
         console.log('© BOT-ZDG -CONECTADO')
      }
   })
   }

   const ZDGConnection = async () => {
      const { version } = await fetchLatestBaileysVersion()
      const { state, saveCreds } = await useMultiFileAuthState('zdg')
   
      const config = {
         auth: state,
         logger: P({ level: 'error' }),
         printQRInTerminal: true,
         version,
         connectTimeoutMs: 60_000,
         async getMessage(key) {
            return { conversation: 'botzg' };
         },
      }
      const ZDGsock = makeWaSocket(config, { auth: state });
      ZDGUpdate(ZDGsock.ev);
      ZDGsock.ev.on('creds.update', saveCreds);

   ZDGsock.ev.on('messages.upsert', async ({ messages, type }) => {
      const msg = messages[0]
      const jid = msg.key.remoteJid

      //Resposta do Texto  
      if (!msg.key.fromMe && jid !== 'status@broadcast' && !ZDGGroupCheck(jid)) {
      const options = {
       'method': 'POST',
       'url': 'https://traz-express.bubbleapps.io/api/1.1/wf/retorno_texto/',
       'headers': {
         'Content-Type': 'application/json'
       },
       json: msg
      };
      request(options, function (error, response) {
      if (error) {
         throw new Error(error);
       }
       else {
        console.log(response.body);
      }
      });	
      }

      //Resposta do Botao
      if (!msg.key.fromMe && jid !== 'status@broadcast' && !ZDGGroupCheck(jid)) {
      const options = {
     'method': 'POST',
     'url': 'https://traz-express.bubbleapps.io/api/1.1/wf/retorno_botao/',
      'headers': {
        'Content-Type': 'application/json'
      },
      json: msg
      };

      request(options, function (error, response) {               if (error) {
        throw new Error(error);
      }
      else {
       console.log(response.body);
      }
    });	
      }

      //Resposta da Lista
      if (!msg.key.fromMe && jid !== 'status@broadcast' && !ZDGGroupCheck(jid)) {
            const options = {
              'method': 'POST',
              'url': 'https://traz-express.bubbleapps.io/api/1.1/wf/retorno_lista/',
               'headers': {
                 'Content-Type': 'application/json'
              },
               json: msg
             };
        
             request(options, function (error, response) {               if (error) {
                 throw new Error(error);
              }
               else {
                console.log(response.body);
               }
             });	
      }

      //Captura Minha mensagem
      if (msg.key.fromMe && jid !== 'status@broadcast' && !ZDGGroupCheck(jid)) {
            const options = {
              'method': 'POST',
              'url': 'https://traz-express.bubbleapps.io/api/1.1/wf/respondendo_mgs_eu/',
               'headers': {
                 'Content-Type': 'application/json'
              },
               json: msg
             };
        
             request(options, function (error, response) {               if (error) {
                 throw new Error(error);
              }
               else {
                console.log(response.body);
               }
             });	
      }

      //Captura Resposta
      if (!msg.key.fromMe && jid !== 'status@broadcast' && !ZDGGroupCheck(jid)) {
         const options = {
           'method': 'POST',
           'url': 'https://traz-express.bubbleapps.io/api/1.1/wf/respondendo_mgs/',
            'headers': {
              'Content-Type': 'application/json'
           },
            json: msg
          };
     
          request(options, function (error, response) {               if (error) {
              throw new Error(error);
           }
            else {
             console.log(response.body);
            }
          });	
      }
/*
      //Captura Video
      if (!msg.key.fromMe && jid !== 'status@broadcast' && !ZDGGroupCheck(jid)) {
               const options = {
                 'method': 'POST',
                 'url': 'https://netfrix-clone.bubbleapps.io/api/1.1/wf/rebi_video',
                  'headers': {
                    'Content-Type': 'application/json'
                 },
                  json: msg
                };
           
                request(options, function (error, response) {               if (error) {
                    throw new Error(error);
                 }
                  else {
                   console.log(response.body);
                  }
                });	
      }

      //Captura audio
      if (!msg.key.fromMe && jid !== 'status@broadcast' && !ZDGGroupCheck(jid)) {
         const options = {
           'method': 'POST',
           'url': 'https://netfrix-clone.bubbleapps.io/api/1.1/wf/rebi_audio',
            'headers': {
              'Content-Type': 'application/json'
           },
            json: msg
          };
     
          request(options, function (error, response) {               if (error) {
              throw new Error(error);
           }
            else {
             console.log(response.body);
            }
          });	
      }

      //Captura Imagem
      if (!msg.key.fromMe && jid !== 'status@broadcast' && !ZDGGroupCheck(jid)) {
               const options = {
                 'method': 'POST',
                 'url': 'https://netfrix-clone.bubbleapps.io/api/1.1/wf/recebi_image',
                  'headers': {
                    'Content-Type': 'application/json'
                 },
                  json: msg
                };
           
                request(options, function (error, response) {               if (error) {
                    throw new Error(error);
                 }
                  else {
                   console.log(response.body);
                  }
                });	
      }

      //Eu respondendo
      if (msg.key.fromMe && jid !== 'status@broadcast' && !ZDGGroupCheck(jid)) {
            const options = {
               'method': 'POST',
               'url': 'https://netfrix-clone.bubbleapps.io/api/1.1/wf/respondendo',
               'headers': {
                  'Content-Type': 'application/json'
               },
                json: msg
               };
           
            request(options, function (error, response) {               if (error) {
               throw new Error(error);
            }
            else {
               console.log(response.body);
               }
            });	
      }
          //Resposta Status
         if (!msg.key.fromMe && jid !== 'status@broadcast' && !ZDGGroupCheck(jid)) {
                  const optionsY = {
                     'method': 'POST',
                     'url': 'https://netfrix-clone.bubbleapps.io/api/1.1/wf/resposta_status',
                     'headers': {
                        'Content-Type': 'application/json'
                     },
                      json: msg
               };   
            request(optionsY, function (error, response) {if (error) {
               throw new Error(error);
                  }
                  else {
                     console.log(response.body);
                     }
            });
            }
            */
     })  

   //Send message
   app.post('/net-message', async (req, res) => {

      const jid = req.body.jid;
      const message = req.body.message;

      ZDGsock.sendMessage(jid, { text: message }).then(response => {
         res.status(200).json({
            status: true,
            response: response
         });
         }).catch(err => {
         res.status(500).json({
            status: false,
            response: err
         });
         });
   });

   // Send imagem
   app.post('/net-fotoperfil', async (req, res) => {

      const jid = req.body.jid;

      ZDGsock.profilePictureUrl(jid).then(response => {
         res.status(200).json({
            status: true,
            response: response
         });
         }).catch(err => {
         res.status(500).json({
            status: false,
            response: err
         });
         });
   });

   // Send button3
   app.post('/net-button3', async (req, res) => {

         const jid = req.body.jid;
         const text = req.body.text;
         const footer = req.body.footer;
         const id1 = req.body.id1;
         const id2 = req.body.id2;
         const id3 = req.body.id3;
         const displaytext1 = req.body.displaytext1;
         const displaytext2 = req.body.displaytext2;
         const displaytext3 = req.body.displaytext3;
         const buttons = [
            { buttonId: id1, buttonText: { displayText: displaytext1 }, type: 1 },
            { buttonId: id2, buttonText: { displayText: displaytext2 }, type: 1 },
            { buttonId: id3, buttonText: { displayText: displaytext3 }, type: 1 },
         ]
         const buttonsMessage = {
            text: text,
            footer: footer,
            buttons: buttons,
            headerType: 1
         }
   
         ZDGsock.sendMessage(jid, buttonsMessage).then(response => {
               res.status(200).json({
                  status: true,
                  response: response
               });
               }).catch(err => {
               res.status(500).json({
                  status: false,
                  response: err
               });
               });
   
   });

   // Send button2
   app.post('/net-button2', async (req, res) => {

         const jid = req.body.jid;
         const text = req.body.text;
         const footer = req.body.footer;
         const id1 = req.body.id1;
         const id2 = req.body.id2;
         const displaytext1 = req.body.displaytext1;
         const displaytext2 = req.body.displaytext2;
         const buttons = [
            { buttonId: id1, buttonText: { displayText: displaytext1 }, type: 1 },
            { buttonId: id2, buttonText: { displayText: displaytext2 }, type: 1 },
         ]
         const buttonsMessage = {
            text: text,
            footer: footer,
            buttons: buttons,
            headerType: 1
         }
   
         ZDGsock.sendMessage(jid, buttonsMessage).then(response => {
               res.status(200).json({
                  status: true,
                  response: response
               });
               }).catch(err => {
               res.status(500).json({
                  status: false,
                  response: err
               });
               });
   
   });

   // Send button1
   app.post('/net-button1', async (req, res) => {

         const jid = req.body.jid;
         const text = req.body.text;
         const footer = req.body.footer;
         const id1 = req.body.id1;
         const displaytext1 = req.body.displaytext1;

         const buttons = [
            { buttonId: id1, buttonText: { displayText: displaytext1 }, type: 1 },
         ]
         const buttonsMessage = {
            text: text,
            footer: footer,
            buttons: buttons,
            headerType: 1
         }
   
         ZDGsock.sendMessage(jid, buttonsMessage).then(response => {
               res.status(200).json({
                  status: true,
                  response: response
               });
               }).catch(err => {
               res.status(500).json({
                  status: false,
                  response: err
               });
               });
   
   });

   // Send link
   app.post('/net-link', async (req, res) => {

         const jid = req.body.jid;
         const url = req.body.url;
         const title = req.body.title;
         const description = req.body.description;
         const link = {
            forward: {
               key: { fromMe: true },
               message: {
                  extendedTextMessage: {
                     text: url,
                     matchedText: url,
                     canonicalUrl: url,
                     title: title,
                     description: description,
                     // optional
                     jpegThumbnail: readFileSync('./assets/logo-robo.jpeg')
                  }
               }
            }
         };

         ZDGsock.sendMessage(jid, link).then(response => {
               res.status(200).json({
                  status: true,
                  response: response
               });
               }).catch(err => {
               res.status(500).json({
                  status: false,
                  response: err
               });
               });
   }); 

   // Send imagem
   app.post('/net-imagem', async (req, res) => {

      const jid = req.body.jid;
      const caption = req.body.caption;
      const url = req.body.url;

      const Imagem = {
         caption: caption,
         image: {
            url: url,
         }
      }
      ZDGsock.sendMessage(jid, Imagem).then(response => {
            res.status(200).json({
               status: true,
               response: response
            });
            }).catch(err => {
            res.status(500).json({
               status: false,
               response: err
            });
            });


   });

   // Send video
   app.post('/net-video', async (req, res) => {

      const jid = req.body.jid;
      const url = req.body.url;
      const caption = req.body.caption;

      const gif = {
         caption: caption,
         video: {
            url: url,
         },
         mimetype: 'video/mp4',
      }
      ZDGsock.sendMessage(jid, gif).then(response => {
            res.status(200).json({
               status: true,
               response: response
            });
            }).catch(err => {
            res.status(500).json({
               status: false,
               response: err
            });
            });


   });

   // Send list
   app.post('/net-list', async (req, res) => {

      const jid = req.body.jid;
      const title = req.body.title;
      const text = req.body.text;
      const buttonText = req.body.buttonText;
      const footer = req.body.footer;
      //SESSÃO 1
      const sessao1 = req.body.footer
      const sessao1Title1 = req.body.sessao1Title1
      const sessao1Description1 = req.body.sessao1Description1
      const sessao1ID1 = req.body.sessao1ID1
      const sessao1Title2 = req.body.sessao1Title2
      const sessao1Description2 = req.body.sessao1Description2
      const sessao1ID2 = req.body.sessao1ID2
      const sessao1Title3 = req.body.sessao1Title3
      const sessao1Description3 = req.body.sessao1Description3
      const sessao1ID3 = req.body.sessao1ID3
      const sessao1Title4 = req.body.sessao1Title4
      const sessao1Description4 = req.body.sessao1Description4
      const sessao1ID4 = req.body.sessao1ID4
      //SESSÃO 2
      const sessao2 = req.body.footer
      const sessao2Title1 = req.body.sessao2Title1
      const sessao2Description1 = req.body.sessao2Description1
      const sessao2ID1 = req.body.sessao2ID1
      const sessao2Title2 = req.body.sessao2Title2
      const sessao2Description2 = req.body.sessao2Description2
      const sessao2ID2 = req.body.sessao2ID2
      const sessao2Title3 = req.body.sessao2Title3
      const sessao2Description3 = req.body.sessao2Description3
      const sessao2ID3 = req.body.sessao2ID3
      const sessao2Title4 = req.body.sessao2Title4
      const sessao2Description4 = req.body.sessao2Description4
      const sessao2ID4 = req.body.sessao2ID4
      //SESSÃO 3
      const sessao3 = req.body.footer
      const sessao3Title1 = req.body.sessao3Title1
      const sessao3Description1 = req.body.sessao3Description1
      const sessao3ID1 = req.body.sessao3ID1
      const sessao3Title2 = req.body.sessao3Title2
      const sessao3Description2 = req.body.sessao3Description2
      const sessao3ID2 = req.body.sessao3ID2
      const sessao3Title3 = req.body.sessao3Title3
      const sessao3Description3 = req.body.sessao3Description3
      const sessao3ID3 = req.body.sessao3ID3
      const sessao3Title4 = req.body.sessao3Title4
      const sessao3Description4 = req.body.sessao3Description4
      const sessao3ID4 = req.body.sessao3ID4
      const sections = [
         {
            title: sessao1,
            rows: [
               { title: sessao1Title1, description: sessao1Description1, rowId: sessao1ID1 },
               { title: sessao1Title2, description: sessao1Description2, rowId: sessao1ID2 },
               { title: sessao1Title3, description: sessao1Description3, rowId: sessao1ID3 },
               { title: sessao1Title4, description: sessao1Description4, rowId: sessao1ID4 },
            ],
         },
         {
            title: sessao2,
            rows: [
               { title: sessao2Title1, description: sessao2Description1, rowId: sessao2ID1 },
               { title: sessao2Title2, description: sessao2Description2, rowId: sessao2ID2 },
               { title: sessao2Title3, description: sessao2Description3, rowId: sessao2ID3 },
               { title: sessao2Title4, description: sessao2Description4, rowId: sessao2ID4 },
            ],
         },
         {
            title: sessao3,
            rows: [
               { title: sessao3Title1, description: sessao3Description1, rowId: sessao3ID1 },
               { title: sessao3Title2, description: sessao3Description2, rowId: sessao3ID2 },
               { title: sessao3Title3, description: sessao3Description3, rowId: sessao3ID3 },
               { title: sessao3Title4, description: sessao3Description4, rowId: sessao3ID4 },
            ],
         },
      ]
      
      const sendList = {
         title: title,
         text: text,
         buttonText: buttonText,
         footer: footer,
         sections: sections
      }

      ZDGsock.sendMessage(jid, sendList).then(response => {
            res.status(200).json({
               status: true,
               response: response
            });
            }).catch(err => {
            res.status(500).json({
               status: false,
               response: err
            });
            });

   });

   // Send list-4-2-2
   app.post('/net-list-4-2-2', async (req, res) => {

      const jid = req.body.jid;
      const title = req.body.title;
      const text = req.body.text;
      const buttonText = req.body.buttonText;
      const footer = req.body.footer;
      //SESSÃO 1
      const sessao1 = req.body.sessao1
      const sessao1Title1 = req.body.sessao1Title1
      const sessao1Description1 = req.body.sessao1Description1
      const sessao1ID1 = req.body.sessao1ID1
      const sessao1Title2 = req.body.sessao1Title2
      const sessao1Description2 = req.body.sessao1Description2
      const sessao1ID2 = req.body.sessao1ID2
      const sessao1Title3 = req.body.sessao1Title3
      const sessao1Description3 = req.body.sessao1Description3
      const sessao1ID3 = req.body.sessao1ID3
      const sessao1Title4 = req.body.sessao1Title4
      const sessao1Description4 = req.body.sessao1Description4
      const sessao1ID4 = req.body.sessao1ID4
      //SESSÃO 2
      const sessao2 = req.body.sessao2
      const sessao2Title1 = req.body.sessao2Title1
      const sessao2Description1 = req.body.sessao2Description1
      const sessao2ID1 = req.body.sessao2ID1
      const sessao2Title2 = req.body.sessao2Title2
      const sessao2Description2 = req.body.sessao2Description2
      const sessao2ID2 = req.body.sessao2ID2
      //SESSÃO 3
      const sessao3 = req.body.sessao3
      const sessao3Title1 = req.body.sessao3Title1
      const sessao3Description1 = req.body.sessao3Description1
      const sessao3ID1 = req.body.sessao3ID1
      const sessao3Title2 = req.body.sessao3Title2
      const sessao3Description2 = req.body.sessao3Description2
      const sessao3ID2 = req.body.sessao3ID2

      const sections = [
         {
            title: sessao1,
            rows: [
               { title: sessao1Title1, description: sessao1Description1, rowId: sessao1ID1 },
               { title: sessao1Title2, description: sessao1Description2, rowId: sessao1ID2 },
               { title: sessao1Title3, description: sessao1Description3, rowId: sessao1ID3 },
               { title: sessao1Title4, description: sessao1Description4, rowId: sessao1ID4 },
            ],
         },
         {
            title: sessao2,
            rows: [
               { title: sessao2Title1, description: sessao2Description1, rowId: sessao2ID1 },
               { title: sessao2Title2, description: sessao2Description2, rowId: sessao2ID2 },
            ],
         },
         {
            title: sessao3,
            rows: [
               { title: sessao3Title1, description: sessao3Description1, rowId: sessao3ID1 },
               { title: sessao3Title2, description: sessao3Description2, rowId: sessao3ID2 },
            ],
         },
      ]
      
      const sendList = {
         title: title,
         text: text,
         buttonText: buttonText,
         footer: footer,
         sections: sections
      }

      ZDGsock.sendMessage(jid, sendList).then(response => {
            res.status(200).json({
               status: true,
               response: response
            });
            }).catch(err => {
            res.status(500).json({
               status: false,
               response: err
            });
            });

   });

   // Send list-4-2
   app.post('/net-list-4-2', async (req, res) => {

      const jid = req.body.jid;
      const title = req.body.title;
      const text = req.body.text;
      const buttonText = req.body.buttonText;
      const footer = req.body.footer;
      //SESSÃO 1
      const sessao1 = req.body.sessao1
      const sessao1Title1 = req.body.sessao1Title1
      const sessao1Description1 = req.body.sessao1Description1
      const sessao1ID1 = req.body.sessao1ID1
      const sessao1Title2 = req.body.sessao1Title2
      const sessao1Description2 = req.body.sessao1Description2
      const sessao1ID2 = req.body.sessao1ID2
      const sessao1Title3 = req.body.sessao1Title3
      const sessao1Description3 = req.body.sessao1Description3
      const sessao1ID3 = req.body.sessao1ID3
      const sessao1Title4 = req.body.sessao1Title4
      const sessao1Description4 = req.body.sessao1Description4
      const sessao1ID4 = req.body.sessao1ID4
      //SESSÃO 2
      const sessao2 = req.body.sessao2
      const sessao2Title1 = req.body.sessao2Title1
      const sessao2Description1 = req.body.sessao2Description1
      const sessao2ID1 = req.body.sessao2ID1
      const sessao2Title2 = req.body.sessao2Title2
      const sessao2Description2 = req.body.sessao2Description2
      const sessao2ID2 = req.body.sessao2ID2

      const sections = [
         {
            title: sessao1,
            rows: [
               { title: sessao1Title1, description: sessao1Description1, rowId: sessao1ID1 },
               { title: sessao1Title2, description: sessao1Description2, rowId: sessao1ID2 },
               { title: sessao1Title3, description: sessao1Description3, rowId: sessao1ID3 },
               { title: sessao1Title4, description: sessao1Description4, rowId: sessao1ID4 },
            ],
         },
         {
            title: sessao2,
            rows: [
               { title: sessao2Title1, description: sessao2Description1, rowId: sessao2ID1 },
               { title: sessao2Title2, description: sessao2Description2, rowId: sessao2ID2 },
            ],
         },
      ]
      
      const sendList = {
         title: title,
         text: text,
         buttonText: buttonText,
         footer: footer,
         sections: sections
      }

      ZDGsock.sendMessage(jid, sendList).then(response => {
            res.status(200).json({
               status: true,
               response: response
            });
            }).catch(err => {
            res.status(500).json({
               status: false,
               response: err
            });
            });

   });

   // Send list-5-5-3-2
   app.post('/net-list-5-5-3-2', async (req, res) => {

      const jid = req.body.jid;
      const title = req.body.title;
      const text = req.body.text;
      const buttonText = req.body.buttonText;
      const footer = req.body.footer;
      //SESSÃO 1
      const sessao1 = req.body.sessao1
      const sessao1Title1 = req.body.sessao1Title1
      const sessao1Description1 = req.body.sessao1Description1
      const sessao1ID1 = req.body.sessao1ID1
      const sessao1Title2 = req.body.sessao1Title2
      const sessao1Description2 = req.body.sessao1Description2
      const sessao1ID2 = req.body.sessao1ID2
      const sessao1Title3 = req.body.sessao1Title3
      const sessao1Description3 = req.body.sessao1Description3
      const sessao1ID3 = req.body.sessao1ID3
      const sessao1Title4 = req.body.sessao1Title4
      const sessao1Description4 = req.body.sessao1Description4
      const sessao1ID4 = req.body.sessao1ID5
      const sessao1Title5 = req.body.sessao1Title5
      const sessao1Description5 = req.body.sessao1Description5
      const sessao1ID5 = req.body.sessao1ID5
      //SESSÃO 2
      const sessao2 = req.body.sessao2
      const sessao2Title1 = req.body.sessao2Title1
      const sessao2Description1 = req.body.sessao2Description1
      const sessao2ID1 = req.body.sessao2ID1
      const sessao2Title2 = req.body.sessao2Title2
      const sessao2Description2 = req.body.sessao2Description2
      const sessao2ID2 = req.body.sessao2ID2
      const sessao2Title3 = req.body.sessao2Title3
      const sessao2Description3 = req.body.sessao2Description3
      const sessao2ID3 = req.body.sessao2ID3
      const sessao2Title4 = req.body.sessao2Title4
      const sessao2Description4 = req.body.sessao2Description4
      const sessao2ID4 = req.body.sessao2ID4
      const sessao2Title5 = req.body.sessao2Title5
      const sessao2Description5 = req.body.sessao2Description5
      const sessao2ID5 = req.body.sessao2ID5
      //SESSÃO 3
      const sessao3 = req.body.sessao3
      const sessao3Title1 = req.body.sessao3Title1
      const sessao3Description1 = req.body.sessao3Description1
      const sessao3ID1 = req.body.sessao3ID1
      const sessao3Title2 = req.body.sessao3Title2
      const sessao3Description2 = req.body.sessao3Description2
      const sessao3ID2 = req.body.sessao3ID2
      const sessao3Title3 = req.body.sessao3Title3
      const sessao3Description3 = req.body.sessao3Description3
      const sessao3ID3 = req.body.sessao3ID3
      //SESSÃO 4
      const sessao4 = req.body.sessao4
      const sessao4Title1 = req.body.sessao4Title1
      const sessao4Description1 = req.body.sessao4Description1
      const sessao4ID1 = req.body.sessao4ID1
      const sessao4Title2 = req.body.sessao4Title2
      const sessao4Description2 = req.body.sessao4Description2
      const sessao4ID2 = req.body.sessao4ID2

      const sections = [
         {
            title: sessao1,
            rows: [
               { title: sessao1Title1, description: sessao1Description1, rowId: sessao1ID1 },
               { title: sessao1Title2, description: sessao1Description2, rowId: sessao1ID2 },
               { title: sessao1Title3, description: sessao1Description3, rowId: sessao1ID3 },
               { title: sessao1Title4, description: sessao1Description4, rowId: sessao1ID4 },
               { title: sessao1Title5, description: sessao1Description5, rowId: sessao1ID5 },
            ],
         },
         {
            title: sessao2,
            rows: [
               { title: sessao2Title1, description: sessao2Description1, rowId: sessao2ID1 },
               { title: sessao2Title2, description: sessao2Description2, rowId: sessao2ID2 },
               { title: sessao2Title3, description: sessao2Description3, rowId: sessao2ID3 },
               { title: sessao2Title4, description: sessao2Description4, rowId: sessao2ID4 },
               { title: sessao2Title5, description: sessao2Description5, rowId: sessao2ID5 },
            ],
         },
         {
            title: sessao3,
            rows: [
               { title: sessao3Title1, description: sessao3Description1, rowId: sessao3ID1 },
               { title: sessao3Title2, description: sessao3Description2, rowId: sessao3ID2 },
               { title: sessao3Title3, description: sessao3Description3, rowId: sessao3ID3 },
            ],
         },
         {
            title: sessao4,
            rows: [
               { title: sessao4Title1, description: sessao4Description1, rowId: sessao4ID1 },
               { title: sessao4Title2, description: sessao4Description2, rowId: sessao4ID2 },
            ],
         },
      ]
      
      const sendList = {
         title: title,
         text: text,
         buttonText: buttonText,
         footer: footer,
         sections: sections
      }

      ZDGsock.sendMessage(jid, sendList).then(response => {
            res.status(200).json({
               status: true,
               response: response
            });
            }).catch(err => {
            res.status(500).json({
               status: false,
               response: err
            });
            });

   });

   // Send list-2-4
   app.post('/net-list-2-4', async (req, res) => {

      const jid = req.body.jid;
      const title = req.body.title;
      const text = req.body.text;
      const buttonText = req.body.buttonText;
      const footer = req.body.footer;
      //SESSÃO 1
      const sessao1 = req.body.sessao1
      const sessao1Title1 = req.body.sessao1Title1
      const sessao1Description1 = req.body.sessao1Description1
      const sessao1ID1 = req.body.sessao1ID1
      const sessao1Title2 = req.body.sessao1Title2
      const sessao1Description2 = req.body.sessao1Description2
      const sessao1ID2 = req.body.sessao1ID2
      //SESSÃO 2
      const sessao2 = req.body.sessao2
      const sessao2Title1 = req.body.sessao2Title1
      const sessao2Description1 = req.body.sessao2Description1
      const sessao2ID1 = req.body.sessao2ID1
      const sessao2Title2 = req.body.sessao2Title2
      const sessao2Description2 = req.body.sessao2Description2
      const sessao2ID2 = req.body.sessao2ID2
      const sessao2Title3 = req.body.sessao2Title3
      const sessao2Description3 = req.body.sessao2Description3
      const sessao2ID3 = req.body.sessao2ID3
      const sessao2Title4 = req.body.sessao2Title4
      const sessao2Description4 = req.body.sessao2Description4
      const sessao2ID4 = req.body.sessao2ID4
      const sections = [
         {
            title: sessao1,
            rows: [
               { title: sessao1Title1, description: sessao1Description1, rowId: sessao1ID1 },
               { title: sessao1Title2, description: sessao1Description2, rowId: sessao1ID2 },
            ],
         },
         {
            title: sessao2,
            rows: [
               { title: sessao2Title1, description: sessao2Description1, rowId: sessao2ID1 },
               { title: sessao2Title2, description: sessao2Description2, rowId: sessao2ID2 },
               { title: sessao2Title3, description: sessao2Description3, rowId: sessao2ID3 },
               { title: sessao2Title4, description: sessao2Description4, rowId: sessao2ID4 },
            ],
         },
      ]
      
      const sendList = {
         title: title,
         text: text,
         buttonText: buttonText,
         footer: footer,
         sections: sections
      }

      ZDGsock.sendMessage(jid, sendList).then(response => {
            res.status(200).json({
               status: true,
               response: response
            });
            }).catch(err => {
            res.status(500).json({
               status: false,
               response: err
            });
            });

   });

   }

ZDGConnection()

server.listen(port, function() {
   console.log('© NETVIDEO - Servidor rodando na porta: ' + port);
 });
