# veyselerkoyuncu.com.tr — 3D kişisel site

Muhammed Veysel Erkoyuncu'nun kişisel sitesi. Tek sayfa; kaydırdıkça 20.000'e varan parçacıktan oluşan
bir 3D bulut her bölümde başka bir şekle dönüşür:

| Bölüm | Şekil |
| --- | --- |
| Giriş | Sinir ağı çekirdeği (küre) |
| Hakkımda | DNA sarmalı |
| Uzmanlık / Yetenekler | Yörünge halkaları |
| Projeler | Veri arazisi |
| İletişim | Galaksi |

**Yığın:** Vite, React 19, TypeScript, three.js + @react-three/fiber (özel shader),
framer-motion, Lenis. Türkçe / İngilizce.

## Geliştirme

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # tür denetimi + dist/
```

İçeriğin tamamı (metinler, projeler, sosyal hesaplar) `src/content.ts` içindedir.
Yeni proje eklemek için `projects` dizisine bir kayıt eklemek yeterli.

| Klasör | İçerik |
| --- | --- |
| `src/three/` | Parçacık şekilleri (`shapes.ts`), shader ve morf mantığı (`Particles.tsx`), sahne |
| `src/components/` | Bölümler, yükleme ekranı, imleç, menü, proje penceresi |
| `src/lib/` | Kaydırma durumu (Lenis), dil, yardımcı hook'lar |
| `deploy/` | Docker Compose, nginx ayarı, yayın betiği |

## Yayın (ev sunucusu)

```bash
bash deploy/deploy.sh
```

Betik kodu `veysel@192.168.1.4:~/apps/veyselerkoyuncu-3d/app` dizinine kopyalar, imajı sunucuda
derler ve konteyneri yeniden başlatır. Konteyner ortak `web` ağına `veysel3d` adıyla bağlanır;
Cloudflare Tunnel'da yayın adresi `http://veysel3d:80` olmalıdır.

Erişilebilirlik: `prefers-reduced-motion` açıkken yumuşak kaydırma ve ağır animasyonlar kapanır;
WebGL yoksa 3D sahne yerine durağan bir arka plan gösterilir.
