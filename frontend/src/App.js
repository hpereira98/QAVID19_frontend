import React, { useEffect } from 'react';
import { Widget, addResponseMessage } from 'react-chat-theme';
import detectBrowserLanguage from 'detect-browser-language'
import { setTranslations, setLocale } from 'react-i18nify';
import { translate } from 'react-i18nify';
import axios from 'axios';

import 'react-chat-theme/lib/styles.css';

import logo from './logo.svg';

var language = detectBrowserLanguage()

setTranslations({
  pt: {
    welcome: "Bem-vindo(a) ao **QAVID-19**! Eu sou o _Dr. Eugenius_ e estou aqui para responder a qualquer questão que possas ter sobre a COVID-19! Então, como posso ajudar-te?",
    think: "Hmmm deixa-me pensar...",
    exit: "Por favor, espera um momento enquanto procuro nas minhas fontes seguras!",
    sorry: "Desculpa, mas não consegui encontrar uma resposta... Queres perguntar-me algo mais?",
    found: "Isto foi o que encontrei:",
    more: "Podes descobrir mais",
    source: "aqui"
  },
  en: {
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
  setLocale('pt')
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
          profileAvatar={logo}
          title="QAVID-19"
          subtitle="Get a trustworthy answer for your COVID-19 questions!"
          showTimeStamp
          profileAvatar="https://lh3.googleusercontent.com/proxy/pHF5qCozmHN0R1ASFNMANhZoDAUHpDsQ1olvp0UAfSrYfQCLqK3iVuItWFdPwIdKLrIMNNH96X5ypwN9zsGxs9vg5zDc_fRky3knGX_-nFk3UGCLQ_fegL6nfoMeWFSL0jjUVPMjkcojrgDAePPBvBwXOalk"
          titleAvatar="https://cdn.icon-icons.com/icons2/2238/PNG/512/virus_coronavirus_covid_covid_icon_134782.png"
        />
      </div>
    );
}

export default App;
