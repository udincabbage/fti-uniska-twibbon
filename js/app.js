(() => {

    /*
     * ========================================================
     * ELEMENT
     * ========================================================
     */

    const canvas = document.getElementById("twibbonCanvas");
    const ctx = canvas.getContext("2d", {
        alpha: false
    });

    const stage = document.getElementById("canvasStage");

    const photoInput =
        document.getElementById("photoInput");

    const zoomRange =
        document.getElementById("zoomRange");

    const captionInput =
        document.getElementById("captionInput");

    const captionPosition =
        document.getElementById("captionPosition");

    const captionSize =
        document.getElementById("captionSize");

    const templateLabel =
        document.getElementById("templateLabel");

    const emptyState =
        document.getElementById("emptyState");

    const statusMessage =
        document.getElementById("statusMessage");

    const shareDialog =
        document.getElementById("shareDialog");


    /*
     * ========================================================
     * CACHE IMAGE
     * ========================================================
     */

    const imageCache = new Map();


    /*
     * ========================================================
     * TEMPLATE AKTIF
     * ========================================================
     */

    // let activeTemplate =
    //     FINAL_TEMPLATE_DEFINITIONS[
    //     Math.floor(
    //         Math.random() *
    //         FINAL_TEMPLATE_DEFINITIONS.length
    //     )
    //     ];

    // Sementara lagi desain
    let activeTemplate = FINAL_TEMPLATE_DEFINITIONS[1];

    /*
     * ========================================================
     * PHOTO STATE
     * ========================================================
     */

    let photoImage = null;

    let drag = null;

    let photoState = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        scale: 1
    };


    /*
     * ========================================================
     * STATUS
     * ========================================================
     */

    function status(message) {

        statusMessage.textContent = message;

        window.clearTimeout(status.timer);

        status.timer = window.setTimeout(() => {

            statusMessage.textContent = "";

        }, 4200);
    }


    /*
     * ========================================================
     * LOAD IMAGE
     * ========================================================
     */

    function imageFrom(src) {

        if (!src) {
            return Promise.resolve(null);
        }

        if (imageCache.has(src)) {
            return imageCache.get(src);
        }

        const request = new Promise((resolve) => {

            const image = new Image();

            image.onload = () => resolve(image);

            image.onerror = () => resolve(null);

            image.src = src;
        });

        imageCache.set(src, request);

        return request;
    }


    /*
     * ========================================================
     * RESET PHOTO
     * ========================================================
     */

    function resetPhoto() {

        photoState = {

            x: canvas.width / 2,

            y: canvas.height / 2,

            scale:
                activeTemplate.initialPhotoScale || 1
        };

        zoomRange.value =
            photoState.scale;
    }


    /*
     * ========================================================
     * HITUNG UKURAN FOTO
     * ========================================================
     */

    function photoCoverDimensions(
        image,
        scaleOverride = null
    ) {

        const coverScale = Math.max(

            canvas.width / image.width,

            canvas.height / image.height
        );

        const userScale =
            scaleOverride !== null
                ? scaleOverride
                : photoState.scale;

        const finalScale =
            coverScale * userScale;

        return {

            width:
                image.width * finalScale,

            height:
                image.height * finalScale
        };
    }


    /*
     * ========================================================
     * BACKGROUND AWAL
     *
     * Saat belum ada foto:
     * putih.
     * ========================================================
     */

    function drawInitialBackground() {

        ctx.save();

        ctx.fillStyle = "#ffffff";

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        ctx.restore();
    }


    /*
     * ========================================================
     * FOTO BACKGROUND
     *
     * Foto user diperbesar untuk memenuhi seluruh canvas.
     *
     * Ini menjadi "ambient background".
     *
     * Jadi apabila foto utama kecil:
     *
     *       [ foto utama ]
     *
     * area di luarnya tetap merupakan foto yang sama.
     *
     * ========================================================
     */

    function drawPhotoAmbientBackground() {

        if (!photoImage) {
            drawInitialBackground();
            return;
        }

        const background =
            activeTemplate.layout.background;

        const dimensions =
            photoCoverDimensions(
                photoImage,
                background.scale || 1.15
            );

        ctx.save();

        /*
         * Blur background
         */

        if (background.blur > 0) {

            ctx.filter =
                `blur(${background.blur}px)`;
        }

        ctx.globalAlpha =
            background.opacity ?? 1;

        ctx.drawImage(

            photoImage,

            canvas.width / 2 -
            dimensions.width / 2,

            canvas.height / 2 -
            dimensions.height / 2,

            dimensions.width,

            dimensions.height
        );

        ctx.restore();


        /*
         * Darken / overlay
         */

        const darken =
            background.darken || 0;

        if (darken > 0) {

            ctx.save();

            ctx.fillStyle =
                `rgba(0,0,0,${darken})`;

            ctx.fillRect(
                0,
                0,
                canvas.width,
                canvas.height
            );

            ctx.restore();
        }
    }


    /*
     * ========================================================
     * FOTO UTAMA
     * ========================================================
     */

    function drawPhotoMain() {

        if (!photoImage) {
            return;
        }

        const dimensions =
            photoCoverDimensions(
                photoImage
            );

        ctx.save();

        ctx.drawImage(

            photoImage,

            photoState.x -
            dimensions.width / 2,

            photoState.y -
            dimensions.height / 2,

            dimensions.width,

            dimensions.height
        );

        ctx.restore();
    }


    /*
     * ========================================================
     * FALLBACK TEMPLATE
     * ========================================================
     */

    function drawFallbackTemplate() {

        const gradient =
            ctx.createLinearGradient(
                0,
                0,
                canvas.width,
                canvas.height
            );

        gradient.addColorStop(
            0,
            activeTemplate.theme
        );

        gradient.addColorStop(
            0.48,
            "#082b56"
        );

        gradient.addColorStop(
            1,
            "#051930"
        );

        ctx.fillStyle =
            gradient;

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        ctx.globalAlpha = 0.22;

        for (
            let x = -400;
            x < 1600;
            x += 155
        ) {

            ctx.fillStyle = "#ffffff";

            ctx.fillRect(
                x,
                0,
                52,
                canvas.height
            );
        }

        ctx.globalAlpha = 1;
    }


    /*
     * ========================================================
     * DRAW TEXT
     * ========================================================
     */

    function drawText(
        text,
        x,
        y,
        options = {}
    ) {

        const {

            size = 38,

            maxWidth = 820,

            color = "#ffffff",

            weight = 700,

            align = "center",

            shadow = true,

            lineHeight = 1.22

        } = options;


        const words =
            String(text || "")
                .trim()
                .split(/\s+/)
                .filter(Boolean);


        if (!words.length) {
            return;
        }


        ctx.save();


        ctx.font =
            `${weight} ${size}px Montserrat, Arial, sans-serif`;


        ctx.fillStyle =
            color;


        ctx.textAlign =
            align;


        ctx.textBaseline =
            "middle";


        if (shadow) {

            ctx.shadowColor =
                "rgba(0, 0, 0, 0.6)";

            ctx.shadowBlur =
                12;

            ctx.shadowOffsetY =
                3;
        }


        /*
         * Word wrapping
         */

        const lines = [];

        let line = "";


        words.forEach((word) => {

            const candidate =
                line
                    ? `${line} ${word}`
                    : word;


            if (
                ctx.measureText(candidate).width >
                maxWidth &&
                line
            ) {

                lines.push(line);

                line = word;

            } else {

                line = candidate;
            }
        });


        if (line) {
            lines.push(line);
        }


        const blockHeight =
            (lines.length - 1) *
            size *
            lineHeight;


        lines.forEach(
            (item, index) => {

                ctx.fillText(

                    item,

                    x,

                    y -
                    blockHeight / 2 +
                    index *
                    size *
                    lineHeight
                );
            }
        );


        ctx.restore();
    }


    /*
     * ========================================================
     * DRAW LOGOS
     * ========================================================
     */

    async function drawLogos() {

        const {
            wordmark,
            emblem
        } = activeTemplate.layout;


        const [
            wordmarkImage,
            emblemImage
        ] = await Promise.all([

            imageFrom(
                ASSET_PATHS.wordmark
            ),

            imageFrom(
                ASSET_PATHS.emblem
            )
        ]);


        /*
         * WORDMARK
         */

        if (wordmarkImage) {

            ctx.save();

            ctx.globalAlpha =
                wordmark.opacity ?? 1;

            ctx.drawImage(

                wordmarkImage,

                wordmark.x -
                wordmark.width / 2,

                wordmark.y -
                wordmark.height / 2,

                wordmark.width,

                wordmark.height
            );

            ctx.restore();
        }


        /*
         * EMBLEM
         */

        if (emblemImage) {

            ctx.save();

            ctx.globalAlpha =
                emblem.opacity ?? 1;

            ctx.drawImage(

                emblemImage,

                emblem.x -
                emblem.width / 2,

                emblem.y -
                emblem.height / 2,

                emblem.width,

                emblem.height
            );

            ctx.restore();
        }
    }


    /*
     * ========================================================
     * CAPTION Y
     * ========================================================
     */

    function getCaptionY() {

        const caption =
            activeTemplate.layout.caption;


        switch (
        captionPosition.value
        ) {

            case "top":
                return caption.topY;

            case "bottom":
                return caption.bottomY;

            case "middle":
            default:
                return caption.middleY;
        }
    }


    /*
     * ========================================================
     * RENDER
     * ========================================================
     */

    async function render() {

        const templateImage =
            await imageFrom(
                activeTemplate.file
            );


        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        /*
         * ====================================================
         * LAYER 0
         *
         * Putih ketika belum ada foto.
         *
         * Ketika ada foto:
         * foto menjadi ambient background.
         * ====================================================
         */

        drawPhotoAmbientBackground();


        /*
         * ====================================================
         * LAYER 1
         *
         * Foto utama user.
         * ====================================================
         */

        drawPhotoMain();


        /*
         * ====================================================
         * LAYER 2
         *
         * Template PNG.
         * ====================================================
         */

        if (templateImage) {

            ctx.drawImage(

                templateImage,

                0,
                0,

                canvas.width,
                canvas.height
            );

        } else {

            drawFallbackTemplate();
        }


        /*
         * ====================================================
         * LAYER 3
         *
         * TEXT CAMPAIGN
         * ====================================================
         */

        const layout =
            activeTemplate.layout;


        drawText(

            CAMPAIGN.title,

            layout.campaign.x,

            layout.campaign.y,

            {

                size:
                    layout.campaign.size,

                maxWidth:
                    layout.campaign.maxWidth,

                weight:
                    layout.campaign.weight,

                color:
                    layout.campaign.color,

                shadow:
                    layout.campaign.shadow,

                align:
                    layout.campaign.align
            }
        );


        /*
         * FACULTY
         */

        drawText(

            CAMPAIGN.faculty,

            layout.faculty.x,

            layout.faculty.y,

            {

                size:
                    layout.faculty.size,

                maxWidth:
                    layout.faculty.maxWidth,

                weight:
                    layout.faculty.weight,

                color:
                    layout.faculty.color,

                shadow:
                    layout.faculty.shadow,

                align:
                    layout.faculty.align
            }
        );


        /*
         * WELCOME
         */

        drawText(

            CAMPAIGN.welcome,

            layout.welcome.x,

            layout.welcome.y,

            {

                size:
                    layout.welcome.size,

                maxWidth:
                    layout.welcome.maxWidth,

                weight:
                    layout.welcome.weight,

                color:
                    layout.welcome.color,

                shadow:
                    layout.welcome.shadow,

                align:
                    layout.welcome.align
            }
        );


        /*
         * SMART
         */

        drawText(

            CAMPAIGN.smart,

            layout.smart.x,

            layout.smart.y,

            {

                size:
                    layout.smart.size,

                maxWidth:
                    layout.smart.maxWidth,

                weight:
                    layout.smart.weight,

                color:
                    layout.smart.color,

                shadow:
                    layout.smart.shadow,

                align:
                    layout.smart.align
            }
        );


        /*
         * ====================================================
         * LOGO
         * ====================================================
         */

        await drawLogos();


        /*
         * ====================================================
         * LAYER 4
         *
         * USER CAPTION
         * ====================================================
         */

        const caption =
            layout.caption;


        /*
         * Ukuran caption user.
         *
         * Template menentukan base size.
         */

        const sizeMultiplier = {

            small: 0.8,

            medium: 1,

            large: 1.25
        };


        const finalCaptionSize =

            caption.size *
            (
                sizeMultiplier[
                captionSize.value
                ] || 1
            );


        drawText(

            captionInput.value,

            caption.x,

            getCaptionY(),

            {

                size:
                    finalCaptionSize,

                maxWidth:
                    caption.maxWidth,

                weight:
                    caption.weight,

                color:
                    caption.color,

                shadow:
                    caption.shadow,

                align:
                    caption.align
            }
        );


        /*
         * Label template
         */

        templateLabel.textContent =
            `Desain aktif: ${activeTemplate.name}`;
    }


    /*
     * ========================================================
     * POINTER POSITION
     * ========================================================
     */

    function pointerPosition(event) {

        const rect =
            canvas.getBoundingClientRect();


        const point =
            event.touches
                ? event.touches[0]
                : event;


        return {

            x:
                (
                    point.clientX -
                    rect.left
                ) *
                canvas.width /
                rect.width,

            y:
                (
                    point.clientY -
                    rect.top
                ) *
                canvas.height /
                rect.height
        };
    }


    /*
     * ========================================================
     * DRAG START
     * ========================================================
     */

    function startDrag(event) {

        if (!photoImage) {
            return;
        }


        const point =
            pointerPosition(event);


        drag = {

            x:
                point.x,

            y:
                point.y,

            photoX:
                photoState.x,

            photoY:
                photoState.y
        };


        canvas.setPointerCapture?.(
            event.pointerId
        );
    }


    /*
     * ========================================================
     * DRAG MOVE
     * ========================================================
     */

    function moveDrag(event) {

        if (!drag) {
            return;
        }


        const point =
            pointerPosition(event);


        photoState.x =

            drag.photoX +
            point.x -
            drag.x;


        photoState.y =

            drag.photoY +
            point.y -
            drag.y;


        render();
    }


    /*
     * ========================================================
     * DRAG END
     * ========================================================
     */

    function endDrag() {

        drag = null;
    }


    /*
     * ========================================================
     * SHARE TEXT
     * ========================================================
     */

    function getShareText() {

        const caption =
            captionInput.value.trim();


        return (

            caption
                ? `${caption}\n\n`
                : ""
        ) +
            CAMPAIGN.hashtags;
    }


    /*
     * ========================================================
     * CANVAS -> BLOB
     * ========================================================
     */

    function blobFromCanvas() {

        return new Promise(
            (resolve) => {

                canvas.toBlob(

                    resolve,

                    "image/png",

                    1
                );
            }
        );
    }


    /*
     * ========================================================
     * DOWNLOAD
     * ========================================================
     */

    async function downloadPng() {

        await render();


        const blob =
            await blobFromCanvas();


        if (!blob) {

            status(
                "Gagal menyiapkan gambar. Coba lagi."
            );

            return;
        }


        const url =
            URL.createObjectURL(blob);


        const link =
            document.createElement("a");


        link.href = url;


        link.download =
            "twibbon-maba-fti-uniska-mab-2026-2027.png";


        document.body.appendChild(link);


        link.click();


        link.remove();


        URL.revokeObjectURL(url);


        status(
            "PNG berhasil dibuat."
        );
    }


    /*
     * ========================================================
     * COPY CAPTION
     * ========================================================
     */

    async function copyCaption() {

        try {

            await navigator.clipboard.writeText(
                getShareText()
            );


            status(
                "Caption dan hashtag telah disalin."
            );

        } catch {

            status(
                "Tidak dapat menyalin otomatis. Silakan salin caption secara manual."
            );
        }
    }


    /*
     * ========================================================
     * NATIVE SHARE
     * ========================================================
     */

    async function nativeShare() {

        if (
            !navigator.share ||
            !navigator.canShare
        ) {

            return false;
        }


        await render();


        const blob =
            await blobFromCanvas();


        if (!blob) {

            return false;
        }


        const file =

            new File(

                [blob],

                "twibbon-maba-fti-uniska-mab-2026-2027.png",

                {
                    type: "image/png"
                }
            );


        const payload = {

            title:
                "Twibbon Maba FTI UNISKA MAB",

            text:
                getShareText(),

            files:
                [file]
        };


        if (
            !navigator.canShare(payload)
        ) {

            return false;
        }


        try {

            await navigator.share(
                payload
            );

            return true;

        } catch (error) {

            return (
                error.name ===
                "AbortError"
            );
        }
    }


    /*
     * ========================================================
     * SOCIAL SHARE
     * ========================================================
     */

    function openShare(platform) {

        const shareText =
            encodeURIComponent(
                getShareText()
            );


        const pageUrl =
            encodeURIComponent(
                location.href
            );


        if (
            platform === "whatsapp"
        ) {

            window.open(

                `https://wa.me/?text=${shareText}`,

                "_blank",

                "noopener"
            );
        }


        if (
            platform === "x"
        ) {

            window.open(

                `https://twitter.com/intent/tweet?text=${shareText}`,

                "_blank",

                "noopener"
            );
        }


        if (
            platform === "facebook"
        ) {

            window.open(

                `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}&quote=${shareText}`,

                "_blank",

                "noopener"
            );
        }


        if (
            platform === "instagram" ||
            platform === "tiktok"
        ) {

            downloadPng();

            copyCaption();


            const appName =
                platform === "instagram"
                    ? "Instagram"
                    : "TikTok";


            status(

                `Gambar diunduh dan caption disalin. Unggah ke ${appName} dari aplikasi Anda.`
            );
        }
    }


    /*
     * ========================================================
     * PHOTO UPLOAD
     * ========================================================
     */

    photoInput.addEventListener(
        "change",
        (event) => {

            const [file] =
                event.target.files;


            if (!file) {
                return;
            }


            if (
                !file.type.startsWith(
                    "image/"
                )
            ) {

                status(
                    "Pilih file gambar yang valid."
                );

                return;
            }


            const reader =
                new FileReader();


            reader.onload = () => {

                const image =
                    new Image();


                image.onload = () => {

                    photoImage =
                        image;


                    resetPhoto();


                    emptyState.classList.add(
                        "is-hidden"
                    );


                    render();
                };


                image.src =
                    reader.result;
            };


            reader.readAsDataURL(file);
        }
    );


    /*
     * ========================================================
     * ZOOM
     * ========================================================
     */

    zoomRange.addEventListener(
        "input",
        () => {

            photoState.scale =
                Number(
                    zoomRange.value
                );


            render();
        }
    );


    /*
     * ========================================================
     * CAPTION
     * ========================================================
     */

    captionInput.addEventListener(
        "input",
        render
    );


    captionPosition.addEventListener(
        "change",
        render
    );


    captionSize.addEventListener(
        "change",
        render
    );


    /*
     * ========================================================
     * RESET PHOTO
     * ========================================================
     */

    document
        .getElementById("resetPhoto")
        .addEventListener(
            "click",
            () => {

                resetPhoto();

                render();
            }
        );


    /*
     * ========================================================
     * RANDOM TEMPLATE
     * ========================================================
     */

    document
        .getElementById("randomTemplate")
        .addEventListener(
            "click",
            () => {

                const alternatives =
                    FINAL_TEMPLATE_DEFINITIONS.filter(

                        (item) =>
                            item.id !==
                            activeTemplate.id
                    );


                activeTemplate =

                    alternatives[
                    Math.floor(
                        Math.random() *
                        alternatives.length
                    )
                    ];


                resetPhoto();

                render();
            }
        );


    /*
     * ========================================================
     * DOWNLOAD
     * ========================================================
     */

    document
        .getElementById("downloadButton")
        .addEventListener(
            "click",
            downloadPng
        );


    /*
     * ========================================================
     * COPY
     * ========================================================
     */

    document
        .getElementById("copyButton")
        .addEventListener(
            "click",
            copyCaption
        );


    /*
     * ========================================================
     * SHARE
     * ========================================================
     */

    document
        .getElementById("shareButton")
        .addEventListener(
            "click",
            async () => {

                if (
                    await nativeShare()
                ) {

                    return;
                }


                shareDialog.showModal();
            }
        );


    /*
     * ========================================================
     * DIALOG DOWNLOAD
     * ========================================================
     */

    document
        .getElementById("dialogDownload")
        .addEventListener(
            "click",
            downloadPng
        );


    /*
     * ========================================================
     * DIALOG COPY
     * ========================================================
     */

    document
        .getElementById("dialogCopy")
        .addEventListener(
            "click",
            copyCaption
        );


    /*
     * ========================================================
     * SOCIAL BUTTON
     * ========================================================
     */

    document
        .querySelectorAll(
            "[data-share]"
        )
        .forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    () =>
                        openShare(
                            button.dataset.share
                        )
                );
            }
        );


    /*
     * ========================================================
     * POINTER EVENTS
     * ========================================================
     */

    canvas.addEventListener(
        "pointerdown",
        startDrag
    );


    canvas.addEventListener(
        "pointermove",
        moveDrag
    );


    canvas.addEventListener(
        "pointerup",
        endDrag
    );


    canvas.addEventListener(
        "pointercancel",
        endDrag
    );


    canvas.addEventListener(
        "pointerleave",
        (event) => {

            if (
                event.buttons === 0
            ) {

                endDrag();
            }
        }
    );


    /*
     * ========================================================
     * MOUSE WHEEL ZOOM
     * ========================================================
     */

    stage.addEventListener(

        "wheel",

        (event) => {

            if (!photoImage) {
                return;
            }


            event.preventDefault();


            const delta =
                event.deltaY > 0
                    ? -0.06
                    : 0.06;


            photoState.scale =

                Math.max(

                    0.25,

                    Math.min(

                        3,

                        photoState.scale +
                        delta
                    )
                );


            zoomRange.value =
                photoState.scale;


            render();
        },

        {
            passive: false
        }
    );


    /*
     * ========================================================
     * INITIAL RENDER
     *
     * Pada kondisi awal canvas putih.
     * ========================================================
     */

    resetPhoto();

    render();

})();