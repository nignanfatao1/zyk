const { zokou } = require("../framework/zokou");
const yts = require('yt-search');
const ytdl = require('ytdl-core');
const fs = require('fs');

// Cookies intégrés directement dans le code
const cookies = [
  { name: "__Secure-1PAPISID", value: "TRmg_a16Nm7K4sFq/ApNVQwU3wSerJGxT1" },
  { name: "__Secure-1PSID", value: "g.a000nAjuqBpiK9uhR51WTPo0qCkv64QMparTwexMf_LQMiYGD5rqufn0wpyIhSKHyZObYpnT4gACgYKAX4SARISFQHGX2Mi1wm4AF9-LNLT4gnqAab9MRoVAUF8yKoDh4YdA1gU_N00VBS3zC220076" },
  { name: "__Secure-1PSIDCC", value: "AKEyXzWtTTy9C-SZ4OfR-aN2exnjXOmyqvl6kegdfqAXDBsq7mgrPSCeN5OHV_MGbCIdHGHG" },
  { name: "__Secure-1PSIDTS", value: "sidts-CjEBUFGoh3XCHnUDeBpe6YMoJnlh0Kb5zJG8sWN-RhClJh0QIOdMccPydQnJRnXFgwKdEAA" },
  { name: "__Secure-3PAPISID", value: "TRmg_a16Nm7K4sFq/ApNVQwU3wSerJGxT1" },
  { name: "__Secure-3PSID", value: "g.a000nAjuqBpiK9uhR51WTPo0qCkv64QMparTwexMf_LQMiYGD5rqxe7p9XAR9diGlY9Dp5fV7AACgYKAVQSARISFQHGX2MizAuU3fadr0OzT3XOO7UtFhoVAUF8yKpfSvdVghAyYU4u_AX_N9PF0076" },
  { name: "__Secure-3PSIDCC", value: "AKEyXzV0F1i3gVUcanKbQN1Rfwwhe5BBTAbqxO8vlPL3XxESNC7p4RK9AkbYJJz3tmsZ7X2p" },
  { name: "__Secure-3PSIDTS", value: "sidts-CjEBUFGoh3XCHnUDeBpe6YMoJnlh0Kb5zJG8sWN-RhClJh0QIOdMccPydQnJRnXFgwKdEAA" },
  { name: "APISID", value: "rVAwCvEfI6gREkzh/AO6Q31NQ9qPPv5rw1" },
  { name: "GPS", value: "1" },
  { name: "HSID", value: "AttK0RRK6ADq9d9-d" },
  { name: "LOGIN_INFO", value: "AFmmF2swRQIhANw6CmcA84xZWLAbfdzXjW-BbQZ3AHoCkUO5rC04TcAmAiBsyPsd2_adKbHJYAFWgqaNBPCiRZgwzkoDSmZiFGqNtg:QUQ3MjNmekdFbzBkVWVRQTBZbDRhRDBkQlJlNDM1U25jODZ2MXktMlNIQmtxS0ExZmpVTVpVbm44dURmYXdiMzU5ZVItX1Q3REhORWtNUTN1SlJPYzBQS0xSWjltNmZ6WkRFMVRINHU4a0tOdy04cndwY2ItZHJLZ09uLTRjNVZsZHNtN0MtWHdWMzl0THUyS0RvWnk5QzRnMjlLd1U5Tjdn" },
  { name: "PREF", value: "f6=40000000&tz=Africa.Ouagadougou" },
  { name: "SAPISID", value: "TRmg_a16Nm7K4sFq/ApNVQwU3wSerJGxT1" },
  { name: "SID", value: "g.a000nAjuqBpiK9uhR51WTPo0qCkv64QMparTwexMf_LQMiYGD5rqpTaSytMtcQ-D146qt7OMowACgYKAYsSARISFQHGX2Mi__26UTszePUfYNi5Wa99IhoVAUF8yKp47_whtDnRZmC7cQl20t8N0076" },
  { name: "SIDCC", value: "AKEyXzWvlyt-e64Q2TUnJul857uP6AWL_EyRPf0h6-2u3JSwqPU2jghBcnDa2tFtR51PVh0_" },
  { name: "SSID", value: "AqdIjPYb1Zcbu9rHV" },
];

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
        caption: `\n*nom de la video :* _${videos[0].title}_

*Durée :* _${videos[0].timestamp}_

*Lien :* _${videos[0].url}_

_*En cours de téléchargement...*_\n\n`
      };

      zk.sendMessage(origineMessage, infoMess, { quoted: ms });

      const filename = 'video.mp4';

      await downloadVideo(urlElement, filename);

      zk.sendMessage(origineMessage, { video: { url: filename } }, { quoted: ms, caption: `*Titre :* ${videos[0].title}\n*Durée :* ${videos[0].timestamp}` });
      console.log("Envoi du fichier vidéo terminé !");
    } else {
      repondre('Aucune vidéo trouvée.');
    }
  } catch (error) {
    console.error('Erreur lors de la recherche ou du téléchargement de la vidéo :', error);
    repondre('Une erreur est survenue lors de la recherche ou du téléchargement de la vidéo.');
  }
});
