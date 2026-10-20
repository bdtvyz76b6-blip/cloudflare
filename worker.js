export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname; // Например: /sub/supra/123456789.json
    
    // 1. Забираем чистый JSON из твоего GitHub
    // Путь формируется как: servers/sub_ТАРИФ_SALT_UID.json
    const parts = path.split('/'); // ['', 'sub', 'supra', '123456789.json']
    if (parts.length < 4) return new Response("Bad Request", { status: 400 });

    const tariff = parts[2];
    const uid = parts[3].replace('.json', '');
    const salt = "2ix847xy"; // Твой SUB_SALT из .env
    
    const ghUrl = `https://raw.githubusercontent.com/bdtvyz76b6-blip/ixxybotnow/main/servers/sub_${tariff}_${salt}_${uid}.json`;
    
    // 2. Скачиваем файл
    const response = await fetch(ghUrl);
    if (!response.ok) return new Response("Not Found", { status: 404 });
    const jsonBody = await response.text();

    // 3. Считаем Expire (пока ставим 30 дней от текущего момента, так как воркер не знает реальную дату)
    const expireTs = Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60);

    // 4. Формируем заголовки Happ UI
    const headers = {
      "content-type": "application/json; charset=utf-8",
      "profile-title": "☂️ IXXY VPN",
      "profile-update-interval": "1",
      "subscription-userinfo": `expire=${expireTs}; upload=0; download=0; total=0`,
      "support-url": "https://t.me/orelvpntopbot",
      "profile-web-page-url": "https://t.me/orelvpntopbot"
    };

    return new Response(jsonBody, { status: 200, headers });
  },
};