const { zokou } = require('../framework/zokou');

/*zokou(
    {
        nomCom: 'menun',
        categorie: 'Other'
    },
    async (dest, zk, commandeOptions) => {
        const { repondre, arg, ms } = commandeOptions;

        if (!arg || arg.length === 0)  {
            const lien = 'https://telegra.ph/file/201aa2dc22b1fb47ba885.jpg';
            const msg = 'salut';
            zk.sendButtonImage(
                dest,
                {
                    image: { url: lien },
                    caption: msg,
                    buttons: [
                        { "name": "quick_reply", "buttonParamsJson": "{\"display_text\":\"test\",\"id\":\"+test\"}" },
                        { "name": "quick_reply", "buttonParamsJson": "{\"display_text\":\"test1\",\"id\":\"+test1\"}" }
                    ]
                },
                { quoted: ms }
            );
        }
    }
);*/

const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

const imgbbAPIKey = "109d00b272a1b32c5552a60571660c54";  // Remplace par ta clé API

async function uploadToImgBB(Path) {
    if (!fs.existsSync(Path)) {
        throw new Error("Fichier non existant");
    }

    try {
        const form = new FormData();
        form.append("image", fs.createReadStream(Path)); // Ajoute le fichier au formulaire

        const { data } = await axios.post(`https://api.imgbb.com/1/upload?key=${imgbbAPIKey}`, form, {
            headers: {
                ...form.getHeaders(),
            },
        });

        if (data && data.data && data.data.url) {
            return data.data.url; // Retourne l'URL de l'image/vidéo
        } else {
            throw new Error("Erreur lors de la récupération du lien de l'image/vidéo");
        }
    } catch (err) {
        throw new Error(String(err));
    }
}

// Utilisation de la fonction dans ta commande
zokou({ nomCom: "urls", categorie: "Conversion", reaction: "👨🏿‍💻" }, async (origineMessage, zk, commandeOptions) => {
    const { msgRepondu, repondre } = commandeOptions;

    if (!msgRepondu) {
        repondre('Veuillez mentionner une vidéo ou une image.');
        return;
    }

    let mediaPath;

    if (msgRepondu.videoMessage) {
        mediaPath = await zk.downloadAndSaveMediaMessage(msgRepondu.videoMessage);
    } else if (msgRepondu.imageMessage) {
        mediaPath = await zk.downloadAndSaveMediaMessage(msgRepondu.imageMessage);
    } else {
        repondre('Veuillez mentionner une vidéo ou une image.');
        return;
    }

    try {
        const imgbbUrl = await uploadToImgBB(mediaPath);
        fs.unlinkSync(mediaPath);  // Supprime le fichier après utilisation

        repondre(imgbbUrl);  // Répond avec le lien
    } catch (error) {
        console.error('Erreur lors de la création du lien ImgBB :', error);
        repondre('Erreur lors de la création du lien ImgBB.');
    }
});

