require("dotenv").config()
const OpenAI= require("openai")

const openaiApiKey = process.env.OPENAI_API_KEY;

const chat = async (prompt, messages) => {
    try {
        const openai = new OpenAI({
            apikey: openaiApiKey
        });
        
       
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages:[
                { role: "system" , content:prompt},
                { role: "user", content: messages}
            ]
        });

     
        const answ = completion.choices[0].message.content;
        return answ;
        
    } catch (error) {
        console.error("Error al conectar openai : " + error);
        return "ERROR"
    }

};

module.exports = { chat }; 


