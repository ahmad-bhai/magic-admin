module.exports = (req, res) => {
    // Universal CORS Access Headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Input Emoji Readout
    const emoji = req.query.emoji || req.query.e || '❤️';

    try {
        // UTF-32 Code Point Conversion for Apple Assets
        const codePoints = [];
        for (const char of emoji) {
            codePoints.push(char.codePointAt(0).toString(16));
        }
        
        // Remove Variation Selector (-fe0f) for Clean CDN Resolution
        const cleanHex = codePoints.join('-').replace(/-fe0f/g, '');
        const appleEmojiUrl = `https://fastly.jsdelivr.net/npm/emoji-datasource-apple@15.0.1/img/apple/64/${cleanHex}.png`;

        // Direct Clean Output
        return res.status(200).json({
            status: "success",
            input: emoji,
            hex: cleanHex,
            appleEmojiUrl: appleEmojiUrl,
            htmlTag: `<img class="tg-apple-emoji" src="${appleEmojiUrl}" style="height:18px; width:18px; vertical-align:-3px; display:inline-block; margin:0 0.5px;" alt="${emoji}" />`
        });

    } catch (error) {
        return res.status(500).json({ status: "error", message: error.message });
    }
};
