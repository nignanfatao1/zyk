const { zokou } = require('../framework/zokou');
const yts = require('yt-search');
const youtubedl = require('youtube-dl-exec');
const fs = require('fs');
const path = require('path');

// Commande pour télécharger une chanson
zokou({
  nomCom: 'song',
  categorie: 'Recherche',
  reaction: '💿'
}, async (origineMessage, zk, commandeOptions) => {
  const { ms, repondre, arg } = commandeOptions;
  
  if (!arg[0]) {
    repondre('Veuillez entrer un terme de recherche s\'il vous plaît.');
    return;
  }

  try {
    let searchTerm = arg.join(' ');
    const searchResults = await yts(searchTerm);
    const videos = searchResults.videos;

    if (videos && videos.length > 0 && videos[0]) {
      const videoUrl = videos[0].url;
      let infoMess = {
        image: { url: videos[0].thumbnail },
        caption: `\n*nom de l'audio :* _${videos[0].title}_\n\n*Durée :* _${videos[0].timestamp}_\n*Lien :* _${videos[0].url}_\n\n_*En cours de téléchargement...*_\n\n`
      };

      zk.sendMessage(origineMessage, infoMess, { quoted: ms });

      const filename = path.join(__dirname, 'audio.mp3');

      youtubedl(videoUrl, {
        extractAudio: true,
        audioFormat: 'mp3',
        output: filename
      }).then(() => {
        zk.sendMessage(origineMessage, { audio: { url: filename }, mimetype: 'audio/mp4' }, { quoted: ms, ptt: false });
        console.log('Envoi du fichier audio terminé !');
      }).catch(error => {
        console.error('Erreur lors du téléchargement de l\'audio :', error);
        repondre('Une erreur est survenue lors du téléchargement de l\'audio.');
      });
    } else {
      repondre('Aucune vidéo trouvée.');
    }
  } catch (error) {
    console.error('Erreur lors de la recherche ou du téléchargement de la vidéo :', error);
    repondre('Une erreur est survenue lors de la recherche ou du téléchargement de la vidéo.');
  }
});

// Commande pour télécharger une vidéo
zokou({
  nomCom: 'video',
  categorie: 'Recherche',
  reaction: '🎥'
}, async (origineMessage, zk, commandeOptions) => {
  const { arg, ms, repondre } = commandeOptions;
  
  if (!arg[0]) {
    repondre('Veuillez entrer un terme de recherche s\'il vous plaît.');
    return;
  }

  const searchTerm = arg.join(' ');
  try {
    const searchResults = await yts(searchTerm);
    const videos = searchResults.videos;

    if (videos && videos.length > 0 && videos[0]) {
      const videoInfo = videos[0];
      let infoMess = {
        image: { url: videos[0].thumbnail },
        caption: `*nom de la vidéo :* _${videoInfo.title}_\n*Durée :* _${videoInfo.timestamp}_\n*Lien :* _${videoInfo.url}_\n\n_*En cours de téléchargement...*_\n\n`
      };

      zk.sendMessage(origineMessage, infoMess, { quoted: ms });

      const filename = path.join(__dirname, 'video.mp4');

      youtubedl(videoInfo.url, {
        format: 'mp4',
        output: filename
      }).then(() => {
        zk.sendMessage(origineMessage, { video: { url: filename }, caption: '*Zokou-Md*', gifPlayback: false }, { quoted: ms });
      }).catch(error => {
        console.error('Erreur lors du téléchargement de la vidéo :', error);
        repondre('Une erreur est survenue lors du téléchargement de la vidéo.');
      });
    } else {
      repondre('Aucune vidéo trouvée.');
    }
  } catch (error) {
    console.error('Erreur lors de la recherche ou du téléchargement de la vidéo :', error);
    repondre('Une erreur est survenue lors de la recherche ou du téléchargement de la vidéo.');
  }
});
