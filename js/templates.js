const CAMPAIGN = {
    title: "MAHASISWA BARU 2026/2027",
    faculty: "FAKULTAS TEKNOLOGI INFORMASI UNISKA MAB",
    welcome: "SELAMAT BERGABUNG DI KELUARGA BESAR UNISKA MAB",
    smart: "SMART IT UNISKA MAB",
    hashtags: "#ftiuniskbjm #gabungftiuniskabjm #mabaftiuniskabjm"
};

const ASSET_PATHS = {
    wordmark: "assets/logos/logo-fti-wordmark.png",
    emblem: "assets/logos/logo-fti-resmi.png"
};

const baseLayout = {
    campaignY: 142,
    facultyY: 202,
    welcomeY: 1530,
    smartY: 1600,
    wordmark: {
        x: 102,
        y: 150,
        width: 142,
        height: 142
    },
    emblem: {
        x: 978,
        y: 150,
        width: 142,
        height: 142
    },
    fixedTextColor: "#ffffff",
    fixedTextShadow: true,
    caption: {
        x: 540,
        topY: 380,
        middleY: 1450,
        bottomY: 1740,
        maxWidth: 780,
        color: "#ffffff",
        shadow: true
    }
};

/*
 * Seluruh foto pengguna sekarang ditempatkan sebagai background penuh
 * dengan ukuran kanvas 1080 × 1920 di bawah file PNG template.
 *
 * Gunakan properti `initialPhotoScale` untuk mengatur ukuran awal foto.
 * Nilai 1 berarti foto menutup seluruh kanvas (cover).
 * Nilai lebih besar, misalnya 1.15, membuat foto lebih zoom saat dibuka.
 *
 * Anda tetap dapat menambahkan layout khusus pada tiap template ketika
 * posisi teks atau logo harus berbeda dari nilai default.
 */
const TEMPLATE_DEFINITIONS = [
    {
        id: "template-01",
        name: "Smart IT Blue",
        file: "assets/templates/template-01.png",
        theme: "#1475dd",
        initialPhotoScale: 1
    },
    {
        id: "template-02",
        name: "Heritage Maroon",
        file: "assets/templates/template-02.png",
        theme: "#6e1729",
        initialPhotoScale: 1
    },
    {
        id: "template-03",
        name: "Green Tech Campus",
        file: "assets/templates/template-03.png",
        theme: "#12683f",
        initialPhotoScale: 1
    },
    {
        id: "template-04",
        name: "Digital Blue Grid",
        file: "assets/templates/template-04.png",
        theme: "#083b72",
        initialPhotoScale: 1
    },
    {
        id: "template-05",
        name: "Smart IT Cyan",
        file: "assets/templates/template-05.png",
        theme: "#0e9fb7",
        initialPhotoScale: 1
    },
    {
        id: "template-06",
        name: "Banjar Tech Gold",
        file: "assets/templates/template-06.png",
        theme: "#74411e",
        initialPhotoScale: 1
    },
    {
        id: "template-07",
        name: "Campus Future Green",
        file: "assets/templates/template-07.png",
        theme: "#207d5a",
        initialPhotoScale: 1
    },
    {
        id: "template-08",
        name: "Academic Navy",
        file: "assets/templates/template-08.png",
        theme: "#102c55",
        initialPhotoScale: 1
    },
    {
        id: "template-09",
        name: "FTI Digital Spectrum",
        file: "assets/templates/template-09.png",
        theme: "#4a4ecf",
        initialPhotoScale: 1
    }
].map((template) => ({
    ...template,
    layout: {
        ...baseLayout,
        ...(template.layout || {}),
        wordmark: {
            ...baseLayout.wordmark,
            ...(template.layout?.wordmark || {})
        },
        emblem: {
            ...baseLayout.emblem,
            ...(template.layout?.emblem || {})
        },
        caption: {
            ...baseLayout.caption,
            ...(template.layout?.caption || {})
        }
    }
}));