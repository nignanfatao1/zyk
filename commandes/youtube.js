const { zokou } = require("../framework/zokou");
const yts = require('yt-search');
const ytdl = require('ytdl-core');
const fs = require('fs');

// Chemin vers votre fichier de cookies
const cookieFilePath = '../bdd/coki.json';

// Vérifiez si le fichier de cookies existe
if (!fs.existsSync(cookieFilePath)) {
  console.error('Erreur : Le fichier de cookies n\'existe pas. Assurez-vous que le chemin est correct et que le fichier est présent.');
  process.exit(1);
}

// Lire le fichier de cookies
const cookies = JSON.parse(fs.readFileSync(cookieFilePath, 'utf-8'));

// Convertir les cookies en un en-tête de requête
const cookieHeader = cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');

async function downloadAudio(url, outputPath) {
  return new Promise((resolve, reject) => {
    const audioStream = ytdl(url, {
      filter: 'audioonly',
      quality: 'highestaudio',
      requestOptions: {
        headers: {
          Cookie: cookieHeader
        }
      }
    });

    const fileStream = fs.createWriteStream(outputPath);
    audioStream.pipe(fileStream);

    fileStream.on('finish', () => {
      resolve();
    });

    fileStream.on('error', (error) => {
      reject(error);
    });
  });
}

async function downloadVideo(url, outputPath) {
  return new Promise((resolve, reject) => {
    const videoStream = ytdl(url, {
      filter: 'videoandaudio',
      quality: 'highestvideo',
      requestOptions: {
        headers: {
          Cookie: cookieHeader
        }
      }
    });

    const fileStream = fs.createWriteStream(outputPath);
    videoStream.pipe(fileStream);

    fileStream.on('finish', () => {
      resolve();
    });

    fileStream.on('error', (error) => {
      reject(error);
    });
  });
}

zokou({
  nomCom: "song",
  categorie: "Recherche",
  reaction: "💿"
}, async (origineMessage, zk, commandeOptions) => {
  const { ms, repondre, arg } = commandeOptions;

  if (!arg[0]) {
    repondre("Veuillez entrer un terme de recherche s'il vous plaît.");
    return;
  }

  try {
    let topo = arg.join(" ");
    const search = await yts(topo);
    const videos = search.videos;

    if (videos && videos.length > 0 && videos[0]) {
      const urlElement = videos[0].url;

      let infoMess = {
        image: { url: videos[0].thumbnail },
        caption: `\n*nom de l'audio :* _${videos[0].title}_

*Durée :* _${videos[0].timestamp}_

*Lien :* _${videos[0].url}_

_*En cours de téléchargement...*_\n\n`
      };

      zk.sendMessage(origineMessage, infoMess, { quoted: ms });

      const filename = 'audio.mp3';

      await downloadAudio(urlElement, filename);

      zk.sendMessage(origineMessage, { audio: { url: filename }, mimetype: 'audio/mp4' }, { quoted: ms, ptt: false });
      console.log("Envoi du fichier audio terminé !");
    } else {
      repondre('Aucune vidéo trouvée.');
    }
  } catch (error) {
    console.error('Erreur lors de la recherche ou du téléchargement de la vidéo :', error);
    repondre('Une erreur est survenue lors de la recherche ou du téléchargement de la vidéo.');
  }
});

zokou({
  nomCom: "video",
  categorie: "Recherche",
  reaction: "🎥"
}, async (origineMessage, zk, commandeOptions) => {
  const { arg, ms, repondre } = commandeOptions;

  if (!arg[0]) {
    repondre("Veuillez entrer un terme de recherche s'il vous plaît");
    return;
  }

  const topo = arg.join(" ");
  try {
    const search = await yts(topo);
    const videos = search.videos;

    if (videos && videos.length > 0 && videos[0]) {
      const Element = videos[0];

      let InfoMess = {
        image: { url: videos[0].thumbnail },
        caption: `*nom de la vidéo :* _${Element.title}_
*Durée :* _${Element.timestamp}_
*Lien :* _${Element.url}_
_*En cours de téléchargement...*_\n\n`
      };

      zk.sendMessage(origineMessage, InfoMess, { quoted: ms });

      const filename = 'video.mp4';

      await downloadVideo(Element.url, filename);

      zk.sendMessage(origineMessage, { video: { url: filename }, caption: "*Zokou-Md", gifPlayback: false }, { quoted: ms });
    } else {
      repondre('Aucune vidéo trouvée.');
    }
  } catch (error) {
    console.error('Erreur lors de la recherche ou du téléchargement de la vidéo :', error);
    repondre('Une erreur est survenue lors de la recherche ou du téléchargement de la vidéo.');
  }
});
