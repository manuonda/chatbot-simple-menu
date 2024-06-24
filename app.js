const { createBot, createProvider, createFlow, addKeyword, EVENTS , gotoFlow, fallBack} = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/json');
const { delay } = require('@whiskeysockets/baileys');
const {chat} = require('./chatgpt_array');
const fs = require('fs');
const path = require('path');


const menuPathConsultas =  path.join(__dirname, "mensajes","promptConsultas.txt");
const promptConsultas = fs.readFileSync(menuPathConsultas,"utf-8");



const flowPrincipal = addKeyword(['hola', 'ole', 'alo'])
    .addAnswer('🙌 Hola bienvenido a este *Chatbot*')
    .addAnswer('Puedes escribir menu para ver los comandos que tienes');

const flowMenuResult = addKeyword(EVENTS.ACTION)
.addAnswer('Este es el menu',{
    media:"https://www.pokemon.com/static-assets/content-assets/cms2-es-es/pdf/trading-card-game/rulebook/par_rulebook_es.pdf"
});

const flowReservar = addKeyword(EVENTS.ACTION)
.addAnswer('Este es el flow reserva : www.reserva.com');


const flowConsultas =addKeyword(EVENTS.ACTION)
.addAnswer('Este es el flow de consultas')
.addAnswer('Hace tu consulta', { capture: true } , 
  async( ctx, ctxFn) => {
      //console.log('ctxFn: ' , ctxFn);
      const prompt = promptConsultas;
      const consulta = ctx.body;
      const answer = await chat(prompt, consulta);
      await ctxFn.flowDynamic(answer);
      console.log(answer);  
  });

const flowWelcome = addKeyword([EVENTS.WELCOME])
    .addAnswer('Este es el flujo welcome', {
        delay: 100
    }, async (ctx, ctxFn) => {
        console.log(ctx.body)
        if (ctx.body.includes('perros')){
           await ctxFn.flowDynamic('Escribiste perros')
        } else {
            await ctxFn.flowDynamic('Escribiste otra cosa')
        }
    });


    // { gotoFlow, fallBack, flowDynamic }

const menu = "Este es el menu de opciones, elegi opciones 1,2,3 o 0"
const menuFlow = addKeyword(["Menu"]).addAnswer(
    menu,
    { capture: true },
    async (ctx,ctxFn ) => {
        if (!["1", "2", "3", "0"].includes(ctx.body)) {
            return ctxFn.fallBack(
                "Respuesta no válida, por favor selecciona una de las opciones."
            );
        }
        switch (ctx.body) {
            case "1":
                return  ctxFn.gotoFlow(flowMenuResult);
            case "2":
                return  ctxFn.gotoFlow(flowReservar);
            case "3":
                return  ctxFn.gotoFlow(flowConsultas);
            case "0":
                return await ctxFn.flowDynamic(
                    "Saliendo... Puedes volver a acceder a este menú escribiendo '*Menu'**"
                );
        }
    }
);

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowWelcome,menuFlow,flowMenuResult, flowConsultas, flowReservar])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()

