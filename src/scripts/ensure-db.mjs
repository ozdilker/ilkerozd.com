// Build öncesi çalışır: `data/portfolio.db` yoksa seed'ler, varsa dokunmaz.
// Böylece db'siz bir ortamda (ör. doğrudan dosya yükleme ile deploy) build
// içerik üretir; commit'li bir db varsa (git tabanlı deploy) korunur —
// admin'den yapılan düzenlemeler ezilmez.
import fs from 'node:fs';
import { execSync } from 'node:child_process';

const dbPath = 'data/portfolio.db';

if (fs.existsSync(dbPath)) {
  console.log('ensure-db: data/portfolio.db mevcut, seed atlandı.');
} else {
  console.log('ensure-db: data/portfolio.db yok, seed çalıştırılıyor...');
  execSync('npm run seed', { stdio: 'inherit' });
}
