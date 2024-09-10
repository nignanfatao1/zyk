const { zokou } = require('../framework/zokou');

zokou(
    {
        nomCom: 'menun',
        categorie: 'Other'
    },
    async (dest, zk, commandeOptions) => {
        const { repondre, arg, ms } = commandeOptions;

        if (!arg || arg.length === 0)  {
            const lien = 'https://telegra.ph/file/201aa2dc22b1fb47ba885.jpg';
            const msg = 'salut';
            zk.sendMessage(
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
);
