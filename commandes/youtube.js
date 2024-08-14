const { zokou } = require('../framework/zokou');
const yts = require('yt-search');
const { exec } = require('child_process');

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
    const searchTerm = arg.join(' ');
    const searchResults = await yts(searchTerm);
    const videos = searchResults.videos;

    if (videos && videos.length > 0) {
      const videoInfo = videos[0];
      const videoUrl = videoInfo.url;
      let infoMess = {
        image: { url: videoInfo.thumbnail },
        caption: `\n*Nom de l'audio :* _${videoInfo.title}_\n\n*Durée :* _${videoInfo.timestamp}_\n*Lien :* _${videoInfo.url}_\n\n_*En cours de téléchargement...*_\n\n`
      };

      zk.sendMessage(origineMessage, infoMess, { quoted: ms });

      const filename = 'audio.mp3';
      exec(`yt-dlp -x --audio-format mp3 -o ${filename} ${videoUrl}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Erreur lors du téléchargement de l'audio : ${error.message}`);
          repondre('Une erreur est survenue lors du téléchargement de l\'audio.');
          return;
        }

        zk.sendMessage(origineMessage, { audio: { url: filename }, mimetype: 'audio/mp4' }, { quoted: ms, ptt: false });
        console.log('Envoi du fichier audio terminé !');
      });
    } else {
      repondre('Aucune vidéo trouvée.');
    }
  } catch (error) {
    console.error('Erreur lors de la recherche ou du téléchargement de la vidéo :', error);
    repondre('Une erreur est survenue lors de la recherche ou du téléchargement de la vidéo.');
  }
});


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

    if (videos && videos.length > 0) {
      const videoInfo = videos[0];
      const videoUrl = videoInfo.url;
      let infoMess = {
        image: { url: videoInfo.thumbnail },
        caption: `*Nom de la vidéo :* _${videoInfo.title}_\n*Durée :* _${videoInfo.timestamp}_\n*Lien :* _${videoInfo.url}_\n\n_*En cours de téléchargement...*_\n\n`
      };

      zk.sendMessage(origineMessage, infoMess, { quoted: ms });

      const filename = 'video.mp4';
      exec(`yt-dlp -f mp4 -o ${filename} ${videoUrl}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Erreur lors du téléchargement de la vidéo : ${error.message}`);
          repondre('Une erreur est survenue lors du téléchargement de la vidéo.');
          return;
        }

        zk.sendMessage(origineMessage, { video: { url: filename }, caption: '*Zokou-Md*', gifPlayback: false }, { quoted: ms });
        console.log('Envoi du fichier vidéo terminé !');
      });
    } else {
      repondre('Aucune vidéo trouvée.');
    }
  } catch (error) {
    console.error('Erreur lors de la recherche ou du téléchargement de la vidéo :', error);
    repondre('Une erreur est survenue lors de la recherche ou du téléchargement de la vidéo.');
  }
});
