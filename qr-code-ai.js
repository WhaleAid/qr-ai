(function () {
  document.head.insertAdjacentHTML('beforeend', '<link href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.16/tailwind.min.css" rel="stylesheet">');

  window.generatePhrase = function () {
    let url = "https://api.openai.com/v1/chat/completions";
    let OPENAI_API_KEY = "YOUR_API_KEY";

    let headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENAI_API_KEY}`
    };

    let body = {
      "model": "gpt-3.5-turbo",
      "messages": [
        {
          "role": "system",
          "content": "You are simply a catchphrase generator, you'll be told what product to talk about and you generate a simple but catchy catchphrase in 1 or 2 sentences```The phrase you generate must be in french```."
        },
        {
          "role": "user",
          "content": "Generate a catchphrase for a new coffe machine."
        }
      ],
      "temperature": 1,
      "max_tokens": 256,
      "top_p": 1,
      "frequency_penalty": 0,
      "presence_penalty": 0
    };
    fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body)
    })
      .then(response => response.json())
      .then(data => {
        let phrase = data['choices'][0]['message']['content'];
        phrase = phrase.replace(/['"]+/g, '');
        changeText(phrase);
        updateQRCode(phrase);
      })
      .catch(error => {
        console.error('Error:', error);
        document.getElementById('catchphrase').innerText = "Error fetching data";
      });
  };

  function changeText(text) {
    const catchphraseElement = document.getElementById('catchphrase');
    gsap.to(catchphraseElement, {
      duration: 0.25, opacity: 0, onComplete: () => {
        catchphraseElement.innerText = text;
        gsap.to(catchphraseElement, { duration: 0.25, opacity: 1 });
      }
    });
  }

  function updateQRCode(data) {
    const qrImage = document.querySelector('img[alt="QR code"]');
    const newSrc = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(data)}`;
    gsap.to(qrImage, {
      duration: 0.25, opacity: 0, onComplete: () => {
        qrImage.src = newSrc;
        gsap.to(qrImage, { duration: 0.25, opacity: 1 });
      }
    });
  }

})();
