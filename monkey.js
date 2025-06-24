const affen = [
    {
        name: 'Gorilla',
        beschreibung: 'Stark, ruhig, dunkle Farben. Du wirkst wie ein stiller Beobachter.',
        bild: 'monkeys/gorilla.jpeg'
    },
    {
        name: 'Orang Utan',
        beschreibung: 'Lässig, etwas wild, warmes Farbspektrum. Passt perfekt zu dir!',
        bild: 'monkeys/orangutan.jpeg'
    },
    {
        name: 'Schimpanse',
        beschreibung: 'Sehr ausgeglichen, normale Farben, durchschnittliche Proportionen.',
        bild: 'monkeys/schimpanse.jpeg'
    },
    {
        name: 'Nasenaffe',
        beschreibung: 'Langes Gesicht erkannt! Du hast eindeutig Nasenaffe-Vibes.',
        bild: 'monkeys/nasenaffe.jpeg'
    },
    {
        name: 'Mandrill',
        beschreibung: 'Starke Farben und hoher Kontrast. Mandrill-Level erreicht!',
        bild: 'monkeys/mandrill.jpeg'
    },
    {
        name: 'Plumploris',
        beschreibung: 'Kleine Größe, sanfte Farben, du bist eher zurückhaltend wie ein Plumploris.',
        bild: 'monkeys/plumploris.jpeg'
    },
    {
        name: 'Bonobo',
        beschreibung: 'Sehr soziale Ausstrahlung erkannt – ein typischer Bonobo!',
        bild: 'monkeys/'
    },
    {
        name: 'Pavian',
        beschreibung: 'Kräftige Struktur, markante Züge – das schreit nach Pavian!',
        bild: 'monkeys/'
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
        affe = affen.find(a => a.name === 'Plumploris');
    } else if (aspectRatio > 1.4) {
        affe = affen.find(a => a.name === 'Pavian');
    } else if (aspectRatio < 0.7) {
        affe = affen.find(a => a.name === 'Nasenaffe');
    } else if (avgR > avgG && avgR > avgB) {
        affe = affen.find(a => a.name === 'Orang Utan');
    } else if (avgB > avgR && avgB > avgG) {
        affe = affen.find(a => a.name === 'Mandrill');
    } else if (avgG > avgR && avgG > avgB) {
        affe = affen.find(a => a.name === 'Bonobo');
    } else {
        affe = affen.find(a => a.name === 'Schimpanse');
    }

    zeigeAffeVergleich(imgElement.src, affe);
}

function zeigeAffeVergleich(userImgSrc, affe) {
    const preview = document.getElementById('preview');
    preview.innerHTML = '';

    const userImg = document.createElement('img');
    userImg.src = userImgSrc;
    userImg.style.maxWidth = '45%';
    userImg.style.margin = '10px';

    const affeImg = document.createElement('img');
    affeImg.src = affe.bild;
    affeImg.style.maxWidth = '45%';
    affeImg.style.margin = '10px';

    const text = document.createElement('p');
    text.textContent = `Du bist ein ${affe.name}! ${affe.beschreibung}`;
    text.style.fontSize = '18px';
    text.style.marginTop = '15px';

    preview.appendChild(userImg);
    preview.appendChild(affeImg);
    preview.appendChild(text);
}

// Hook in bestehende Logik einbauen
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
