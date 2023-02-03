//var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition;
//var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechGrammarList = SpeechGrammarList || window.webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

/*var phrases = [
  'I love to sing because it\'s fun',
  'where are you going',
  'can I call you tomorrow',
  'why did you talk while I was talking',
  'she enjoys reading books and playing games',
  'where are you going',
  'have a great day',
  'she sells seashells on the seashore'
];*/

var phrases = [
    'shades up',
    'shades down',
    'reading light on',
    'reading light off',
    'overhead light on',
    'overhead light off',
    'activate sunset scene',
    'pause movie',
    'play movie'
];

var phrasePara = document.querySelector('.phrase');
var resultPara = document.querySelector('.result');
var diagnosticPara = document.querySelector('.output');
var versionText = document.querySelector('.version');
versionText.textContent = "version: 0.0.9";

var testBtn = document.querySelector('button');
var phraseNumber = 0;

console.log("voice control scipt.js");

function randomPhrase() {
  var number = Math.floor(Math.random() * phrases.length);
  return number;
}

function testSpeech() {
  testBtn.disabled = true;
  testBtn.textContent = 'Test in progress';

  phraseNumber++; if(phraseNumber > phrases.length) phraseNumber = 0;
  var phrase = phrases[phraseNumber]; //phrases[randomPhrase()];
  // To ensure case consistency while checking with the returned output text
  phrase = phrase.toLowerCase();
  phrasePara.textContent = phrase;
  resultPara.textContent = 'Right or wrong?';
  resultPara.style.background = 'rgba(0,0,0,0.2)';
  diagnosticPara.textContent = '...diagnostic messages';

  //var grammar = '#JSGF V1.0; grammar phrase; public <phrase> = ' + phrase +';';
  var recognition = new SpeechRecognition();
  //var speechRecognitionList = new SpeechGrammarList();
  //speechRecognitionList.addFromString(grammar, 1);
  //recognition.grammars = speechRecognitionList;

  if (SpeechGrammarList) {
    // SpeechGrammarList is not currently available in Safari, and does not have any effect in any other browser.
    // This code is provided as a demonstration of possible capability. You may choose not to use it.
    var speechRecognitionList = new SpeechGrammarList();
    //var grammar = '#JSGF V1.0; grammar colors; public <color> = ' + colors.join(' | ') + ' ;'
    var grammar = '#JSGF V1.0; grammar phrase; public <phrase> = ' + phrase +';';
    speechRecognitionList.addFromString(grammar, 1);
    recognition.grammars = speechRecognitionList;
  }
  recognition.continuous = false;
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();

  recognition.onresult = function(event) {
    // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
    // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
    // It has a getter so it can be accessed like an array
    // The first [0] returns the SpeechRecognitionResult at position 0.
    // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
    // These also have getters so they can be accessed like arrays.
    // The second [0] returns the SpeechRecognitionAlternative at position 0.
    // We then return the transcript property of the SpeechRecognitionAlternative object 
    var speechResult = event.results[0][0].transcript.toLowerCase();
    diagnosticPara.textContent = 'Speech received: ' + speechResult + '.';
    if(speechResult === phrase) {
      resultPara.textContent = 'I heard the correct phrase!';
      resultPara.style.background = 'green';
    } else {
      resultPara.textContent = 'That didn\'t sound right.';
      resultPara.style.background = 'darkred';
    }
    recognition.stop();
    testBtn.disabled = false;
    testBtn.textContent = 'Speak';

    console.log('Confidence: ' + event.results[0][0].confidence);
  }

  recognition.onspeechend = function() {
    //recognition.stop();
    //testBtn.disabled = false;
    //testBtn.textContent = 'Speak';
  }

  recognition.onerror = function(event) {
    testBtn.disabled = false;
    testBtn.textContent = 'Speak';
    diagnosticPara.textContent = 'Error occurred in recognition: ' + event.error;
  }
  
  recognition.onaudiostart = function(event) {
      //Fired when the user agent has started to capture audio.
      console.log('SpeechRecognition.onaudiostart');
  }
  
  recognition.onaudioend = function(event) {
      //Fired when the user agent has finished capturing audio.
      console.log('SpeechRecognition.onaudioend');
  }
  
  recognition.onend = function(event) {
      //Fired when the speech recognition service has disconnected.
      console.log('SpeechRecognition.onend');
  }
  
  recognition.onnomatch = function(event) {
      //Fired when the speech recognition service returns a final result with no significant recognition. This may involve some degree of recognition, which doesn't meet or exceed the confidence threshold.
      console.log('SpeechRecognition.onnomatch');
  }
  
  recognition.onsoundstart = function(event) {
      //Fired when any sound — recognisable speech or not — has been detected.
      console.log('SpeechRecognition.onsoundstart');
  }
  
  recognition.onsoundend = function(event) {
      //Fired when any sound — recognisable speech or not — has stopped being detected.
      console.log('SpeechRecognition.onsoundend');
  }
  
  recognition.onspeechstart = function (event) {
      //Fired when sound that is recognised by the speech recognition service as speech has been detected.
      console.log('SpeechRecognition.onspeechstart');
  }
  recognition.onstart = function(event) {
      //Fired when the speech recognition service has begun listening to incoming audio with intent to recognize grammars associated with the current SpeechRecognition.
      console.log('SpeechRecognition.onstart');
  }
}

testBtn.addEventListener('click', testSpeech);