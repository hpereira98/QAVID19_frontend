import React, { useEffect } from 'react';
import { Widget, addResponseMessage } from 'react-chat-theme';
import detectBrowserLanguage from 'detect-browser-language'
import { setTranslations, setLocale } from 'react-i18nify';
import { translate } from 'react-i18nify';
import axios from 'axios';

import 'react-chat-theme/lib/styles.css';

import logo from './logo.svg';
import covid19 from './images/covid19.png'
import dr_eugenius from './images/dr_eugenius.png'

var language = detectBrowserLanguage()

setTranslations({
  pt: {
    title: "QAVID-19",
    subtitle: "Responde às tuas questões acerca da COVID-19 de forma confiável!",
    placeholder: "Escreve a tua questão...",
    welcome: "Bem-vindo(a) ao **QAVID-19**! Eu sou o _Dr. Eugenius_ e estou aqui para responder a qualquer questão que possas ter sobre a COVID-19! Então, como posso ajudar-te?",
    think: "Hmmm deixa-me pensar...",
    exit: "Por favor, espera um momento enquanto procuro nas minhas fontes seguras!",
    sorry: "Desculpa, mas não consegui encontrar uma resposta... Queres perguntar-me algo mais?",
    found: "Isto foi o que encontrei:",
    more: "Podes descobrir mais",
    source: "aqui",
  },
  en: {
    title: "QAVID-19",
    subtitle: "Get a trustworthy answer for your COVID-19 questions!",
    placeholder: "Type your question...",
    welcome: "Welcome to **QAVID-19** chatbot! I am _Dr. Eugenius_ and I'm here to answer any question you have on COVID-19. So, how can I help you?",
    think: "Hmmm let me think...",
    exit: "Please, wait a few moments while I'm looking in my reliable sources!",
    sorry: "Sorry, I could not find an answer... Do you want to ask me anything more?",
    found: "This is what I found:",
    more: "You can find more",
    source: "here"
  }
});

if (language.includes('pt')) {
  language = 'pt'
  setLocale('pt ')
}
else {
  language = 'en'
  setLocale('en')
};

function App() {
  useEffect(() => {
    addResponseMessage(translate('welcome'));
  }, []);

  const makeAPIRequest = (message) => {
    var request_body = {
      lang: language,
      version: 'v3',
      question: message
    }
    console.log(request_body)
    axios.post("http://localhost:8000/ask_question", request_body)
      .then(res => {
          var answer = res.data.result.answer
          var url = res.data.result.url
          console.log(answer)
          console.log(url)
          addResponseMessage(`${translate('found')} "${answer}". ${translate('more')} [${translate('source')}](${url}).`)
        }
      )
      .catch(error => {
          console.log(error)
          addResponseMessage(translate('sorry'))
        }
      )
  }

  const handleNewUserMessage = (newMessage) => {
    console.log(`New message incoming! ${newMessage}`);
    // Now send the message throught the backend API
    addResponseMessage(translate('think'));
    addResponseMessage(translate('exit'));

    // fetching answer...
    makeAPIRequest(newMessage)
  };

    return (
      <div className="App">
        <Widget
          handleNewUserMessage={handleNewUserMessage}
          title={translate('title')}
          subtitle={translate('subtitle')}
          senderPlaceHolder={translate('placeholder')}
          showTimeStamp
          profileAvatar={dr_eugenius}
          titleAvatar={covid19}
        />
      </div>
    );
}

export default App;
