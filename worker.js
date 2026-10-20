export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname; 
    
    // Ожидаем путь вида: /sub/supra/123456789.json
    const parts = path.split('/');
    if (parts.length < 4) return new Response("Bad Request: Invalid path", { status: 400 });

    const tariff = parts[2];
    const uid = parts[3].replace('.json', '');
    
    // ВНИМАНИЕ: Здесь должна быть ТАЖЕ соль, что и в .env бота (SUB_SALT)
    const salt = "2ix847xy"; 
    
    // Формируем URL к GitHub
    const ghUrl = `https://raw.githubusercontent.com/bdtvyz76b6-blip/ixxybotnow/main/servers/sub_${tariff}_${salt}_${uid}.json`;
    
    // Скачиваем файл
    const response = await fetch(ghUrl);
    
    if (!response.ok) {
      // Если файл не найден, выводим точный URL, который мы искали
      return new Response(`404 Not Found.\nWe tried to fetch: ${ghUrl}`, { 
          status: 404,
          headers: { "Content-Type": "text/plain; charset=utf-8" }
      });
    }
    
    const jsonBody = await response.text();

    // Считаем Expire (30 дней от текущего момента)
    const expireTs = Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60);

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