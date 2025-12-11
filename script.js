
const slides = ["[[i]]'Izinkan diriku menangkan hatimu, yang ku kagumi sejak awalnya kita pertama bertemu ...'[[/i]]", "Iya, aku sejak pertama ketemu mba dewi udah tertarik dan kagum. Keliatan asik banget, energik, positive vibes pokoknya.", "Terus kita jadi 1 di AoC, makin deket makin ada komunikasi lebih, aku masih kagum dalam diam tapi rasa itu tetep tumbuh.", "Aku mendem perasaan ini karena beberapa hal\u2026 kondisi kita yang berbeda pasti ini jadi penghalang besar. Selain itu, aku juga gak tau mba dewi udah punya pacar atau belum\u2026 bingung mau cari tau ke siapa.", "Seiring berjalannya waktu, aku makin tau gimana mba dewi, memang belum punya pacar lalu kriteria yang dicari itu gimana. Aku memang gak masuk kriterianya sih haha.", "Tapi temen-temenku bilang, ya dicoba aja daripada dipendem terus. Mau itu karena perbedaan kondisi kita atau hal lainnya, gapapa kalo ditolak\u2014setidaknya aku udah mencoba jujur sama perasaanku sendiri.", "Aku bingung mau confess kayak mana, terus kepikiran ide bikin website sederhana kayak gini karena kayaknya langka haha.", "Aku gak maksa atau apapun, keputusan ada di mba dewi."];
let current = 0;
let charIndex = 0;
const speed = 25;
const audio = document.getElementById('bgm');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');

function convertTags(text) {
  return text
    .replaceAll('[[i]]', '<i>')
    .replaceAll('[[/i]]', '</i>');
}

function typeWriter() {
  const el = document.getElementById('text');
  if (charIndex < slides[current].length) {
    el.innerHTML = convertTags(slides[current].substring(0, charIndex + 1));
    charIndex++;
    setTimeout(typeWriter, speed);
  } else {
    nextBtn.style.display = 'inline-block';
    updateProgress();
  }
}

function showSlide(n) {
  current = n;
  charIndex = 0;
  document.getElementById('text').innerHTML = '';
  nextBtn.style.display = 'none';
  prevBtn.style.display = (current === 0) ? 'none' : 'inline-block';
  typeWriter();
}

function nextSlide() {
  if (current < slides.length - 1) {
    showSlide(current + 1);
  } else {
    document.getElementById('controls').style.display = 'none';
    document.getElementById('choices').style.display = 'flex';
  }
}

function prevSlide() {
  if (current > 0) showSlide(current - 1);
}

function updateProgress() {
  document.querySelector('.progress > i').style.width = (((current + 1) / slides.length) * 100) + '%';
}

// onNextClick: first click will attempt to play audio and then advance/type
function onNextClick() {
  if (audio && audio.paused) {
    audio.play().catch(()=>{ /* autoplay blocked sometimes */ });
  }
  // if still typing, complete instantly
  const el = document.getElementById('text');
  if (charIndex < slides[current].length) {
    el.innerHTML = slides[current];
    charIndex = slides[current].length;
    nextBtn.style.display = 'inline-block';
    updateProgress();
  } else {
    nextSlide();
  }
}

function showAccept() {
  document.querySelector('.container').innerHTML = `
    <div style="padding:20px">
      <h2>💖 Terima Kasih</h2>
      <p style="font-size:18px; margin-top:12px">
        Terima kasih ya, mba dew. Aku akan berusaha untuk jadi yang terbaik untuk mba dewi, walau aku sendiri banyak kekurangannya.
      </p>
    </div>`;

  spawnParticles("🌹");
  setTimeout(() => spawnParticles("💖"), 200);

  notifyAnswer("Dewi memilih: TERIMA ❤️");
}

function showDecline() {
  document.querySelector('.container').innerHTML = `
    <div style="padding:20px">
      <h2>💔 Tidak Apa-apa</h2>
      <p style="font-size:18px; margin-top:12px">
        Gapapa, kita masih bisa temenan kan ya? hehe...
      </p>
    </div>`;

  spawnParticles("💔");
  setTimeout(() => spawnParticles("🥀"), 200);

  notifyAnswer("Dewi memilih: TOLAK 💔");
}

function spawnParticles(emoji) {
    const total = 18; // jumlah partikel lebih banyak

    for (let i = 0; i < total; i++) {
        const p = document.createElement("div");
        p.classList.add("particle");
        p.innerText = emoji;

        // posisi acak biar menyebar di layar
        p.style.left = (Math.random() * 80 + 10) + "vw";   // 10% - 90% lebar layar
        p.style.top  = (Math.random() * 40 + 30) + "vh";   // 30% - 70% tinggi layar

        // durasi animasi lebih lama (2–3 detik)
        p.style.animationDuration = (2 + Math.random()) + "s";

        // sedikit rotasi acak biar natural
        p.style.transform = `rotate(${Math.random() * 40 - 20}deg)`;

        document.body.appendChild(p);

        setTimeout(() => p.remove(), 3000); // hapus setelah animasi selesai
    }
}

function notifyAnswer(answer) {
  emailjs.send("service_vgyz5ag", "template_plqdja5", {
    jawaban: answer,
    waktu: new Date().toLocaleString("id-ID")
  })
  .then(() => console.log("Notif terkirim:", answer))
  .catch(err => console.error("Gagal:", err));
}

window.addEventListener('DOMContentLoaded', ()=>{
  prevBtn.style.display = 'none';
  showSlide(0); 
});
