const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('fileInput');
const fileButton = document.getElementById('fileButton');
const preview = document.getElementById('preview');

// Klick auf Button → öffnet Dateiauswahl
fileButton.addEventListener('click', () => fileInput.click());

// Datei über Dialog auswählen
fileInput.addEventListener('change', () => {
    handleFiles(fileInput.files);
});

// Drag-Events
['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, e => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.add('dragover');
    });
});

['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, e => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.remove('dragover');
    });
});

// Datei wird gedroppt
dropzone.addEventListener('drop', e => {
    const files = e.dataTransfer.files;
    handleFiles(files);
});

function handleFiles(files) {
    preview.innerHTML = '';
    for (const file of files) {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = e => {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.onload = () => {
                    analysiereBildUndVergleiche(img);
                };
            };
            reader.readAsDataURL(file);
        } else {
            alert('Nur Bilddateien werden unterstützt.');
        }
    }
}

const affen = [
    {
        name: 'Gorilla',
        beschreibung: 'Strong jaw, broad shoulders, heavy brow — almost gorilla-like appearance.',
        bild: 'monkeys/gorilla.jpeg',
        link: 'https://en.wikipedia.org/wiki/Gorilla'
    },
    {
        name: 'Orangutan',
        beschreibung: 'Long arms, reddish hair, flat nose — resembles an orangutan clearly.',
        bild: 'monkeys/orangutan.jpeg',
        link: 'https://en.wikipedia.org/wiki/Orangutan'
    },
    {
        name: 'Chimpanzee',
        beschreibung: 'Wide grin, long limbs, expressive eyes — resembles a chimpanzee strongly.',
        bild: 'monkeys/schimpanse.jpeg',
        link: 'https://en.wikipedia.org/wiki/Chimpanzee'
    },
    {
        name: 'Proboscis monkey',
        beschreibung: 'Big nose, pot belly, reddish fur — like a proboscis monkey.',
        bild: 'monkeys/nasenaffe.jpeg',
        link: 'https://en.wikipedia.org/wiki/Proboscis_monkey'
    },
    {
        name: 'Mandrill',
        beschreibung: 'Bright face, sharp canines, colorful snout — resembles a mandrill exactly.',
        bild: 'monkeys/mandrill.jpeg',
        link: 'https://en.wikipedia.org/wiki/Mandrill'
    },
    {
        name: 'Slow loris',
        beschreibung: 'Large eyes, small frame, gentle movements — resembles a slow loris.',
        bild: 'monkeys/plumploris.jpeg',
        link: 'https://en.wikipedia.org/wiki/Slow_loris'
    },
    {
        name: 'Bonobo',
        beschreibung: 'Slender build, high forehead, curious gaze — resembles a bonobo distinctly.',
        bild: 'monkeys/bonobo.jpeg',
        link: 'https://en.wikipedia.org/wiki/Bonobo'
    },
    {
        name: 'Baboon',
        beschreibung: 'Red face, pronounced muzzle, strong build — resembles a baboon closely.',
        bild: 'monkeys/pavian.jpeg',
        link: 'https://en.wikipedia.org/wiki/Baboon'
    }
];

function analysiereBildUndVergleiche(imgElement) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = imgElement.naturalWidth;
    canvas.height = imgElement.naturalHeight;
    ctx.drawImage(imgElement, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const { data, width, height } = imageData;

    let rSum = 0, gSum = 0, bSum = 0;
    let brightnessSum = 0;

    // Einfacher Durchschnitt der Farbwerte und Helligkeit
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        rSum += r;
        gSum += g;
        bSum += b;
        brightnessSum += (r + g + b) / 3;
    }

    const pixelCount = data.length / 4;
    const avgR = rSum / pixelCount;
    const avgG = gSum / pixelCount;
    const avgB = bSum / pixelCount;
    const avgBrightness = brightnessSum / pixelCount;

    const aspectRatio = width / height;
    const size = width * height;

    // Heuristische Affen-Auswahl
    let affe;

    if (avgBrightness < 60) {
        affe = affen.find(a => a.name === 'Gorilla');
    } else if (avgBrightness > 200) {
        affe = affen.find(a => a.name === 'Slow loris');
    } else if (aspectRatio > 1.4) {
        affe = affen.find(a => a.name === 'Baboon');
    } else if (aspectRatio < 0.7) {
        affe = affen.find(a => a.name === 'Proboscis monkey');
    } else if (avgR > avgG && avgR > avgB) {
        affe = affen.find(a => a.name === 'Orang Utan');
    } else if (avgB > avgR && avgB > avgG) {
        affe = affen.find(a => a.name === 'Mandrill');
    } else if (avgG > avgR && avgG > avgB) {
        affe = affen.find(a => a.name === 'Bonobo');
    } else {
        affe = affen.find(a => a.name === 'Chimpanzee');
    }

    zeigeAffeVergleich(imgElement.src, affe);
}

function zeigeAffeVergleich(userImgSrc, affe) {
    const preview = document.getElementById('preview');
    preview.innerHTML = '';

    // Create main container
    const comparisonContainer = document.createElement('div');
    comparisonContainer.className = 'comparison-container';

    // Create images container
    const imagesContainer = document.createElement('div');
    imagesContainer.className = 'images-container';

    // User image wrapper
    const userWrapper = document.createElement('div');
    userWrapper.className = 'image-wrapper';
    const userImg = document.createElement('img');
    userImg.src = userImgSrc;
    userImg.className = 'user-image';
    const userLabel = document.createElement('div');
    userLabel.className = 'image-label';
    userLabel.textContent = 'Du';
    userWrapper.appendChild(userImg);
    userWrapper.appendChild(userLabel);

    // VS divider
    const vsDivider = document.createElement('i');
    vsDivider.className = 'fa-solid fa-arrow-right vs-divider';

    // Ape image wrapper
    const apeWrapper = document.createElement('div');
    apeWrapper.className = 'image-wrapper';
    const apeImg = document.createElement('img');
    apeImg.src = affe.bild;
    apeImg.className = 'ape-image';
    const apeLabel = document.createElement('div');
    apeLabel.className = 'image-label';
    apeLabel.textContent = affe.name;
    apeWrapper.appendChild(apeImg);
    apeWrapper.appendChild(apeLabel);

    // Add images to container
    imagesContainer.appendChild(userWrapper);
    imagesContainer.appendChild(vsDivider);
    imagesContainer.appendChild(apeWrapper);

    // Create result text
    const resultText = document.createElement('div');
    resultText.innerHTML = `You are a ${affe.name}!<br>${affe.beschreibung}`;

    // Create learn more link
    const learnMoreLink = document.createElement('a');
    learnMoreLink.href = affe.link;
    learnMoreLink.target = '_blank';
    learnMoreLink.className = 'learn-more-link';
    learnMoreLink.textContent = `Learn more about ${affe.name}`;

    // Assemble everything
    comparisonContainer.appendChild(imagesContainer);
    comparisonContainer.appendChild(resultText);
    comparisonContainer.appendChild(learnMoreLink);

    preview.appendChild(comparisonContainer);
}
