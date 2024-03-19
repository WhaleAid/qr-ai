(function () {
  document.head.insertAdjacentHTML('beforeend', '<link href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.16/tailwind.min.css" rel="stylesheet">');

  // get the string from the backend.link.txt text file and store it in a variable called backendLink
  let backendLink;
  fetch('backend.link.txt')
    .then(response => response.text())
    .then(data => {
      backendLink = data;
    });

  window.generatePhrase = function () {
    let url = `${backendLink}/generate-completion`;

    let headers = {
      "Content-Type": "application/json",
    };

    let body = {
      "prompt": "A catchphrase for a QR code that links to the website of google."
    };
    fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body)
    })
      .then(response => response.json())
      .then(data => {
        let { phrase, generationId } = data;
        generateColors(generationId)
        phrase = phrase.replace(/['"]+/g, '');
        changeText(phrase);
        updateQRCode(generationId);
      })
      .catch(error => {
        console.error('Error:', error);
        document.getElementById('catchphrase').innerText = "Error fetching data";
      });
  };

  function generateColors(generationId) {
    let url = `${backendLink}/generate-colors/${generationId}`;
    const imageLink = document.getElementById('logo').src
    let dominantColor
    colorjs.prominent(imageLink, { amount: 3, format: 'hex' }).then((colors) => {
      let headers = {
        "Content-Type": "application/json",
      };

      let body = {
        "colors": colors,
        "prompt": `generate an array of hex colors inspired by these colors ${colors}`
      }

      fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body)
      })
        .then(response => response.json())
        .then(data => {
          let colors = data;
          updateColors(colors);
        })
        .catch(error => {
          console.error('Error:', error);
          document.getElementById('catchphrase').innerText = "Error fetching data";
        });
    })
  }

  function changeText(text) {
    const catchphraseElement = document.getElementById('catchphrase');
    gsap.to(catchphraseElement, {
      duration: 0.25, onComplete: () => {
        catchphraseElement.innerText = text;
        gsap.to(catchphraseElement, { duration: 0.25 });
      }
    });
  }

  function updateQRCode(generationId) {
    const qrImageContainer = document.querySelector('#qr-code-container');
    qrImageContainer.innerHTML = '';
    const apiUrl = `${backendLink}/scan/${generationId}`
    const redirectUrl = 'https://www.google.com'
    const fullUrl = `${apiUrl}?redirectUrl=${encodeURIComponent(redirectUrl)}`;

    let qr = qrcode(8, 'M')
    qr.addData(fullUrl);
    qr.make();
    gsap.to(qrImageContainer, {
      duration: 0.25, opacity: 0, onComplete: () => {
        qrImageContainer.innerHTML = qr.createImgTag();
        gsap.to(qrImageContainer, { duration: 0.25, opacity: 1 });
      }
    });
  }

  function updateColors(colors) {
    const colorsArray = JSON.parse(colors);
    const canvas = document.querySelectorAll('.gradients-container');
    const button = document.getElementById('generate-button');
    const qrImageContainer = document.querySelector('#qr-code-container');
    const catchphraseElement = document.getElementById('catchphrase')

    gsap.to(canvas, {
      duration: 0.25, onComplete: () => {
        document.documentElement.style.setProperty('--color-bg1', colorsArray[1].replace(/['"]+/g, ''));
        document.documentElement.style.setProperty('--color-bg2', colorsArray[2].replace(/['"]+/g, ''));
        document.documentElement.style.setProperty('--color1', colorsArray[3].replace(/['"]+/g, ''));
        document.documentElement.style.setProperty('--color2', colorsArray[4].replace(/['"]+/g, ''));
        gsap.to(canvas, { duration: 0.25 })
      }
    })
    const randomIndex = Math.floor(Math.random() * colorsArray.length)
    gsap.to(qrImageContainer, {
      duration: 0.25, opacity: 0, onComplete: () => {
        qrImageContainer.style.borderColor = colorsArray[
          randomIndex
        ].replace(/['"]+/g, '');
        gsap.to(qrImageContainer, { duration: 0.25, opacity: 1 })
      }
    })

    gsap.to(button, {
      duration: 0.25, onComplete: () => {
        button.style.backgroundColor = colorsArray[
          randomIndex === 0 ? 1 : randomIndex
        ].replace(/['"]+/g, '');
        button.style.color = colorsArray[0].replace(/['"]+/g, '');
        gsap.to(button, { duration: 0.25 })
      }
    })

    gsap.to(catchphraseElement, {
      duration: 0.25, opacity: 0, onComplete: () => {
        catchphraseElement.style.color = colorsArray[0].replace(/['"]+/g, '');
        gsap.to(catchphraseElement, { duration: 0.25, opacity: 1 })
      }
    })
  }

})();