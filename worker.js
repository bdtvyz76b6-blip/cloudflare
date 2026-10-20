export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname; 
    
    const parts = path.split('/');
    if (parts.length < 4) return new Response("Bad Request", { status: 400 });

    const tariff = parts[2];
    const uid = parts[3].replace('.json', '');
    
    // Берем соль из переменных окружения Cloudflare
    const salt = env.SUB_SALT || "d3hsR6"; 
    const token = env.GITHUB_TOKEN;

    // Используем API GitHub вместо raw
    const ghApiUrl = `https://api.github.com/repos/bdtvyz76b6-blip/ixxybotnow/contents/servers/sub_${tariff}_${salt}_${uid}.json`;
    
    const response = await fetch(ghApiUrl, {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/vnd.github.v3.raw",
            "User-Agent": "ixxy-worker"
        }
    });
    
    if (!response.ok) {
      return new Response(`404 Not Found.\nAPI URL: ${ghApiUrl}`, { status: 404 });
    }
    
    const jsonBody = await response.text();
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