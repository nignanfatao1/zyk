const { zokou } = require('../framework/zokou');
const yts = require('yt-search');
const youtubedl = require('youtube-dl-exec');
const fs = require('fs');
const path = require('path');

// Configuration commune pour youtube-dl-exec
const commonOptions = {
  dumpSingleJson: true,
  noCheckCertificates: true,
  noWarnings: true,
  preferFreeFormats: true,
  addHeader: ['referer:youtube.com', 'user-agent:googlebot']
};

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
        caption: `\n*Nom de l'audio :* _${videos[0].title}_\n\n*Durée :* _${videos[0].timestamp}_\n*Lien :* _${videos[0].url}_\n\n_*En cours de téléchargement...*_\n\n`
      };

      zk.sendMessage(origineMessage, infoMess, { quoted: ms });

      const filename = path.join(__dirname, 'audio.mp3');

      youtubedl(videoUrl, {
        ...commonOptions,
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
  const { arg, ms, repondre } = commande
