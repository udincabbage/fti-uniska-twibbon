/*
 * ============================================================
 * KONFIGURASI KAMPANYE
 * ============================================================
 */

const CAMPAIGN = {
    title: "MAHASISWA BARU 2026/2027",
    faculty: "FAKULTAS TEKNOLOGI INFORMASI UNISKA MAB",
    welcome: "SELAMAT BERGABUNG DI KELUARGA BESAR UNISKA MAB",
    smart: "SMART IT UNISKA MAB",

    hashtags:
        "#ftiuniskbjm #gabungftiuniskabjm #mabaftiuniskabjm #SmartITUNISKA"
};


/*
 * ============================================================
 * ASSET
 * ============================================================
 */

const ASSET_PATHS = {
    wordmark: "assets/logos/logo-fti-wordmark.png",
    emblem: "assets/logos/logo-fti-resmi.png"
};


/*
 * ============================================================
 * DEFAULT LAYOUT
 *
 * Semua template akan memakai konfigurasi ini terlebih dahulu.
 * Template tertentu dapat melakukan override.
 *
 * Canvas: 1080 × 1920
 * ============================================================
 */

const baseLayout = {

    /*
     * --------------------------------------------------------
     * BACKGROUND
     * --------------------------------------------------------
     *
     * type:
     * - "photo"       = gunakan foto user sebagai background
     * - "photo-blur"  = foto user + blur
     *
     * opacity:
     * tingkat transparansi overlay foto background.
     *
     * blur:
     * tingkat blur background dalam pixel.
     */

    background: {
        type: "photo-blur",
        scale: 1.48,
        blur: 18,
        opacity: 0.75,
        darken: 0.05
    },


    /*
     * --------------------------------------------------------
     * TEKS KAMPANYE
     * --------------------------------------------------------
     */

    campaign: {
        x: 540,
        y: 142,
        size: 41,
        color: "#ffffff",
        weight: 800,
        maxWidth: 690,
        align: "center",
        shadow: true
    },

    faculty: {
        x: 540,
        y: 202,
        size: 25,
        color: "#ffffff",
        weight: 700,
        maxWidth: 790,
        align: "center",
        shadow: true
    },

    welcome: {
        x: 540,
        y: 1530,
        size: 29,
        color: "#ffffff",
        weight: 800,
        maxWidth: 820,
        align: "center",
        shadow: true
    },

    smart: {
        x: 540,
        y: 1600,
        size: 25,
        color: "#ffffff",
        weight: 700,
        maxWidth: 780,
        align: "center",
        shadow: true
    },


    /*
     * --------------------------------------------------------
     * LOGO WORDMARK
     * --------------------------------------------------------
     */

    wordmark: {
        x: 102,
        y: 160,
        width: 142,
        height: 102,
        opacity: 1
    },


    /*
     * --------------------------------------------------------
     * LOGO EMBLEM
     * --------------------------------------------------------
     */

    emblem: {
        x: 978,
        y: 150,
        width: 184,
        height: 184,
        opacity: 1
    },


    /*
     * --------------------------------------------------------
     * CAPTION USER
     * --------------------------------------------------------
     *
     * x / y:
     * posisi default caption.
     *
     * position:
     * posisi visual:
     *
     * top
     * middle
     * bottom
     *
     * Namun masing-masing template tetap dapat menentukan
     * koordinat yang berbeda.
     */

    caption: {
        x: 540,

        topY: 380,
        middleY: 1450,
        bottomY: 1740,

        maxWidth: 780,

        size: 34,

        color: "#ffffff",

        weight: 700,

        shadow: true,

        align: "center"
    }
};


/*
 * ============================================================
 * TEMPLATE
 * ============================================================
 *
 * Cukup tambahkan object baru di bawah.
 *
 * Semua konfigurasi yang tidak ditulis akan mengikuti
 * baseLayout.
 * ============================================================
 */

const TEMPLATE_DEFINITIONS = [

    /*
     * ========================================================
     * TEMPLATE 01
     * ========================================================
     */

    {
        id: "template-01",

        name: "Sky Blue",

        file: "assets/templates/template-01.png",

        theme: "#1475dd",

        initialPhotoScale: 1,

        layout: {

            campaign: {
                x: 540,
                y: 142,
                size: 41,
                color: "#3434a3",
                weight: 800,
                maxWidth: 690,
                align: "center",
                shadow: true
            },

            faculty: {
                x: 540,
                y: 202,
                size: 25,
                color: "#ffffff",
                weight: 700,
                maxWidth: 790,
                align: "center",
                shadow: true
            },

            welcome: {
                x: 310,
                y: 1530,
                size: 54,
                color: "#ffffff",
                weight: 800,
                maxWidth: 700,
                align: "left",
                shadow: true
            },

            smart: {
                x: 640,
                y: 1800,
                size: 45,
                color: "#ffffff",
                weight: 700,
                maxWidth: 780,
                align: "center",
                shadow: true
            },

            caption: {
                x: 1060,
                topY: 120,
                middleY: 590,
                bottomY: 770,
                maxWidth: 780,
                size: 45,
                color: "#fff",
                weight: 700,
                shadow: true,
                align: "right"
            },


            wordmark: {
                x: 200,
                y: 1300,
                width: 350,
                height: 270
            },

        }
    },


    /*
     * ========================================================
     * TEMPLATE 02
     * ========================================================
     */

    {
        id: "template-02",

        name: "Heritage Maroon",

        file: "assets/templates/template-02.png",

        theme: "#6e1729",

        initialPhotoScale: 1,

        layout: {

            campaign: {
                x: 540,
                y: 125,
                size: 38,
                color: "#ffffff",
                weight: 800,
                maxWidth: 700,
                align: "center",
                shadow: true
            },

            faculty: {
                x: 540,
                y: 180,
                size: 23,
                color: "#ffffff",
                weight: 700,
                maxWidth: 790,
                align: "center",
                shadow: true
            },

            welcome: {
                x: 1040,
                y: 1710,
                size: 48,
                color: "#ffffff",
                weight: 800,
                maxWidth: 820,
                align: "right",
                shadow: true
            },

            smart: {
                x: 540,
                y: 1805,
                size: 24,
                color: "#ffd700",
                weight: 800,
                maxWidth: 780,
                align: "center",
                shadow: true
            },

            caption: {
                x: 540,
                topY: 300,
                middleY: 770,
                bottomY: 960,
                maxWidth: 820,
                size: 42,
                color: "#ffffff",
                weight: 700,
                shadow: true,
                align: "center"
            }
        }
    },


    /*
     * ========================================================
     * TEMPLATE 03
     * ========================================================
     */

    {
        id: "template-03",

        name: "Green Tech Campus",

        file: "assets/templates/template-03.png",

        theme: "#207d5a",

        initialPhotoScale: 1,

        layout: {

            campaign: {
                x: 540,
                y: 135,
                size: 38,
                color: "#ffffff",
                weight: 800,
                maxWidth: 720,
                align: "center",
                shadow: true
            },

            faculty: {
                x: 540,
                y: 195,
                size: 24,
                color: "#ffffff",
                weight: 700,
                maxWidth: 780,
                align: "center",
                shadow: true
            },

            caption: {
                x: 540,
                topY: 360,
                middleY: 1450,
                bottomY: 1730,
                maxWidth: 800,
                size: 32,
                color: "#ffffff",
                weight: 700,
                shadow: true,
                align: "center"
            }
        }
    },


    /*
     * ========================================================
     * TEMPLATE 04
     * ========================================================
     */

    {
        id: "template-04",

        name: "Cokelat Bunder",

        file: "assets/templates/template-04.png",

        theme: "#1475dd",

        initialPhotoScale: 1,

        layout: {

            campaign: {
                x: 540,
                y: 105,
                size: 45,
                color: "#fff",
                weight: 800,
                maxWidth: 900,
                align: "center",
                shadow: false
            },

            faculty: {
                x: 540,
                y: 170,
                size: 22,
                color: "#cfcfcf",
                weight: 700,
                maxWidth: 760,
                align: "center",
                shadow: false
            },

            caption: {
                x: 100,
                topY: 250,
                middleY: 1350,
                bottomY: 1600,
                maxWidth: 550,
                size: 46,
                color: "#fff",
                weight: 700,
                shadow: true,
                align: "left"
            },

            wordmark: {
                x: 140,
                y: 1700,
                width: 170,
                height: 120
            },

            emblem: {
                x: 930,
                y: 1700,
                width: 140,
                height: 140
            }
        }
    },


    /*
     * ========================================================
     * TEMPLATE 05
     * ========================================================
     */

    {
        id: "template-05",

        name: "Smart IT Cyan",

        file: "assets/templates/template-05.png",

        theme: "#1475dd",

        initialPhotoScale: 1.05,

        layout: {

            campaign: {
                x: 540,
                y: 130,
                size: 40,
                color: "#ffffff",
                weight: 800,
                maxWidth: 700,
                align: "center",
                shadow: true
            },

            faculty: {
                x: 540,
                y: 190,
                size: 24,
                color: "#ffffff",
                weight: 700,
                maxWidth: 790,
                align: "center",
                shadow: true
            },

            caption: {
                x: 540,
                topY: 400,
                middleY: 1440,
                bottomY: 1750,
                maxWidth: 760,
                size: 36,
                color: "#ffffff",
                weight: 700,
                shadow: true,
                align: "center"
            }
        }
    },


    /*
     * ========================================================
     * TEMPLATE 06
     * ========================================================
     */

    {
        id: "template-06",

        name: "Banjar Tech Gold",

        file: "assets/templates/template-06.png",

        theme: "#74411e",

        initialPhotoScale: 1,

        layout: {

            campaign: {
                x: 540,
                y: 140,
                size: 38,
                color: "#ffffff",
                weight: 800,
                maxWidth: 700,
                align: "center",
                shadow: true
            },

            faculty: {
                x: 540,
                y: 200,
                size: 23,
                color: "#ffffff",
                weight: 700,
                maxWidth: 780,
                align: "center",
                shadow: true
            },

            smart: {
                x: 540,
                y: 1600,
                size: 25,
                color: "#ffd166",
                weight: 800,
                maxWidth: 780,
                align: "center",
                shadow: true
            },

            caption: {
                x: 540,
                topY: 380,
                middleY: 1450,
                bottomY: 1740,
                maxWidth: 780,
                size: 34,
                color: "#ffffff",
                weight: 700,
                shadow: true,
                align: "center"
            }
        }
    },


    /*
     * ========================================================
     * TEMPLATE 07
     * ========================================================
     */

    {
        id: "template-07",

        name: "Campus Future Green",

        file: "assets/templates/template-07.png",

        theme: "#207d5a",

        initialPhotoScale: 1,

        layout: {

            campaign: {
                x: 540,
                y: 135,
                size: 37,
                color: "#ffffff",
                weight: 800,
                maxWidth: 700,
                align: "center",
                shadow: true
            },

            faculty: {
                x: 540,
                y: 190,
                size: 23,
                color: "#ffffff",
                weight: 700,
                maxWidth: 780,
                align: "center",
                shadow: true
            },

            caption: {
                x: 540,
                topY: 360,
                middleY: 1450,
                bottomY: 1760,
                maxWidth: 800,
                size: 34,
                color: "#ffffff",
                weight: 700,
                shadow: true,
                align: "center"
            }
        }
    },


    /*
     * ========================================================
     * TEMPLATE 08
     * ========================================================
     */

    {
        id: "template-08",

        name: "Academic Navy",

        file: "assets/templates/template-08.png",

        theme: "#12683f",

        initialPhotoScale: 1,

        layout: {

            campaign: {
                x: 540,
                y: 140,
                size: 38,
                color: "#ffffff",
                weight: 800,
                maxWidth: 700,
                align: "center",
                shadow: true
            },

            faculty: {
                x: 540,
                y: 200,
                size: 23,
                color: "#ffffff",
                weight: 700,
                maxWidth: 780,
                align: "center",
                shadow: true
            },

            caption: {
                x: 540,
                topY: 400,
                middleY: 1450,
                bottomY: 1740,
                maxWidth: 780,
                size: 34,
                color: "#ffffff",
                weight: 700,
                shadow: true,
                align: "center"
            }
        }
    },


    /*
     * ========================================================
     * TEMPLATE 09
     * ========================================================
     */

    {
        id: "template-09",

        name: "FTI Digital Spectrum",

        file: "assets/templates/template-09.png",

        theme: "#12683f",

        initialPhotoScale: 1,

        layout: {

            campaign: {
                x: 540,
                y: 130,
                size: 39,
                color: "#ffffff",
                weight: 800,
                maxWidth: 700,
                align: "center",
                shadow: true
            },

            faculty: {
                x: 540,
                y: 195,
                size: 24,
                color: "#ffffff",
                weight: 700,
                maxWidth: 790,
                align: "center",
                shadow: true
            },

            caption: {
                x: 540,
                topY: 380,
                middleY: 1450,
                bottomY: 1740,
                maxWidth: 800,
                size: 34,
                color: "#ffffff",
                weight: 700,
                shadow: true,
                align: "center"
            }
        }
    },


    {
        id: "template-10",

        name: "FTI Future",

        file: "assets/templates/template-10.png",

        theme: "#123456",

        initialPhotoScale: 1,

        layout: {

            campaign: {
                x: 540,
                y: 120,
                size: 35,
                color: "#000000",
                weight: 800,
                maxWidth: 700,
                align: "center",
                shadow: false
            },

            faculty: {
                x: 540,
                y: 175,
                size: 22,
                color: "#000000",
                weight: 700,
                maxWidth: 780,
                align: "center",
                shadow: false
            },

            caption: {
                x: 850,
                topY: 350,
                middleY: 1450,
                bottomY: 1700,
                maxWidth: 400,
                size: 20,
                color: "#000000",
                weight: 700,
                shadow: false,
                align: "right"
            },

            wordmark: {
                x: 140,
                y: 1700,
                width: 170,
                height: 120
            },

            emblem: {
                x: 930,
                y: 1700,
                width: 140,
                height: 140
            }
        }
    },


];


/*
 * ============================================================
 * MERGE CONFIGURATION
 * ============================================================
 *
 * Agar template tidak perlu menulis semua konfigurasi.
 * Yang tidak ditentukan template akan mengambil baseLayout.
 * ============================================================
 */

function mergeLayout(base, custom) {

    return {
        ...base,
        ...custom,

        background: {
            ...base.background,
            ...(custom.background || {})
        },

        campaign: {
            ...base.campaign,
            ...(custom.campaign || {})
        },

        faculty: {
            ...base.faculty,
            ...(custom.faculty || {})
        },

        welcome: {
            ...base.welcome,
            ...(custom.welcome || {})
        },

        smart: {
            ...base.smart,
            ...(custom.smart || {})
        },

        wordmark: {
            ...base.wordmark,
            ...(custom.wordmark || {})
        },

        emblem: {
            ...base.emblem,
            ...(custom.emblem || {})
        },

        caption: {
            ...base.caption,
            ...(custom.caption || {})
        }
    };
}


/*
 * ============================================================
 * EXPORT CONFIG FINAL
 * ============================================================
 */

const FINAL_TEMPLATE_DEFINITIONS = TEMPLATE_DEFINITIONS.map(
    (template) => ({
        ...template,

        layout: mergeLayout(
            baseLayout,
            template.layout || {}
        )
    })
);