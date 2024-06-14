
const {Configuration , OpeanAIApi } = require("openai")

const fs = require("fs");
const path = require("path");


// Función para convertir audio a texto
const voiceToText =  async (filePath) =>  {
    const file = fs.createReadStream(filePath);
    if (!fs.existsSync(path)){
        throw new Error("No se encuentra el archivo");
    }

    // try {
    //     const configuration = new Configuration({
    //         apiKey: process.env.OPENAI_API_KEY
    //     });
    //     const openai = new 
        
    // } catch (error) {
        
    // }
  
    try {
      const response = await openai.createTranscription(file, 'whisper-1', 'text');
      return response.data.text;
    } catch (error) {
      console.error('Error al transcribir el audio:', error);
      throw error;
    }
  }