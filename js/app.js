(() => {
    const canvas = document.getElementById("twibbonCanvas");
    const ctx = canvas.getContext("2d", { alpha: false });
    const stage = document.getElementById("canvasStage");
    const photoInput = document.getElementById("photoInput");
    const zoomRange = document.getElementById("zoomRange");
    const captionInput = document.getElementById("captionInput");
    const captionPosition = document.getElementById("captionPosition");
    const captionSize = document.getElementById("captionSize");
    const templateLabel = document.getElementById("templateLabel");
    const emptyState = document.getElementById("emptyState");
    const statusMessage = document.getElementById("statusMessage");
    const shareDialog = document.getElementById("shareDialog");

    const imageCache = new Map();

    let activeTemplate = TEMPLATE_DEFINITIONS[
        Math.floor(Math.random() * TEMPLATE_DEFINITIONS.length)
    ];

    let photoImage = null;
    let drag = null;
    let photoState = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        scale: 1
    };

    function status(message) {
        statusMessage.textContent = message;
        window.clearTimeout(status.timer);
        status.timer = window.setTimeout(() => {
            statusMessage.textContent = "";
        }, 4200);
    }

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

    function resetPhoto() {
        photoState = {
            x: canvas.width / 2,
            y: canvas.height / 2,
            scale: activeTemplate.initialPhotoScale || 1
        };

        zoomRange.value = photoState.scale;
    }

    function photoCoverDimensions(image) {
        const coverScale = Math.max(
            canvas.width / image.width,
            canvas.height / image.height
        );

        const finalScale = coverScale * photoState.scale;

        return {
            width: image.width * finalScale,
            height: image.height * finalScale
        };
    }

    /*
     * FOTO PENGGUNA: layer paling belakang, selalu menutup seluruh kanvas.
     * Tidak ada clipping circle/rounded rectangle. Area transparan dari frame
     * PNG dapat berada di mana saja dan semuanya akan memperlihatkan foto ini.
     */
    function drawPhotoBackground() {
        if (!photoImage) {
            return;
        }

        const dimensions = photoCoverDimensions(photoImage);

        ctx.drawImage(
            photoImage,
            photoState.x - dimensions.width / 2,
            photoState.y - dimensions.height / 2,
            dimensions.width,
            dimensions.height
        );
    }

    function drawFallbackTemplate() {
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);

        gradient.addColorStop(0, activeTemplate.theme);
        gradient.addColorStop(0.48, "#082b56");
        gradient.addColorStop(1, "#051930");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.globalAlpha = 0.22;

        for (let x = -400; x < 1600; x += 155) {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(x, 0, 52, canvas.height);
        }

        ctx.globalAlpha = 1;
    }

    function drawText(text, x, y, options = {}) {
        const {
            size = 38,
            maxWidth = 820,
            color = "#ffffff",
            weight = 700,
            align = "center",
            shadow = true,
            lineHeight = 1.22
        } = options;

        const words = String(text || "")
            .trim()
            .split(/\s+/)
            .filter(Boolean);

        if (!words.length) {
            return;
        }

        ctx.save();
        ctx.font = `${weight} ${size}px Montserrat, Arial, sans-serif`;
        ctx.fillStyle = color;
        ctx.textAlign = align;
        ctx.textBaseline = "middle";

        if (shadow) {
            ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
            ctx.shadowBlur = 12;
            ctx.shadowOffsetY = 3;
        }

        const lines = [];
        let line = "";

        words.forEach((word) => {
            const candidate = line ? `${line} ${word}` : word;

            if (ctx.measureText(candidate).width > maxWidth && line) {
                lines.push(line);
                line = word;
            } else {
                line = candidate;
            }
        });

        if (line) {
            lines.push(line);
        }

        const blockHeight = (lines.length - 1) * size * lineHeight;

        lines.forEach((item, index) => {
            ctx.fillText(
                item,
                x,
                y - blockHeight / 2 + index * size * lineHeight
            );
        });

        ctx.restore();
    }

    async function drawLogos() {
        const { wordmark, emblem } = activeTemplate.layout;

        const [wordmarkImage, emblemImage] = await Promise.all([
            imageFrom(ASSET_PATHS.wordmark),
            imageFrom(ASSET_PATHS.emblem)
        ]);

        if (wordmarkImage) {
            ctx.drawImage(
                wordmarkImage,
                wordmark.x - wordmark.width / 2,
                wordmark.y - wordmark.height / 2,
                wordmark.width,
                wordmark.height
            );
        }

        if (emblemImage) {
            ctx.drawImage(
                emblemImage,
                emblem.x - emblem.width / 2,
                emblem.y - emblem.height / 2,
                emblem.width,
                emblem.height
            );
        }
    }

    async function render() {
        const templateImage = await imageFrom(activeTemplate.file);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Layer dasar bila foto belum dipilih atau bila tepi foto tidak menutup.
        ctx.fillStyle = "#0b315c";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Layer 1: foto pengguna memenuhi SELURUH area kanvas.
        drawPhotoBackground();

        // Layer 2: template PNG transparan berada di atas foto.
        if (templateImage) {
            ctx.drawImage(templateImage, 0, 0, canvas.width, canvas.height);
        } else {
            drawFallbackTemplate();
        }

        // Layer 3: tulisan permanen kampanye dan logo.
        const layout = activeTemplate.layout;

        drawText(CAMPAIGN.title, 540, layout.campaignY, {
            size: 41,
            maxWidth: 690,
            weight: 800,
            color: layout.fixedTextColor,
            shadow: layout.fixedTextShadow
        });

        drawText(CAMPAIGN.faculty, 540, layout.facultyY, {
            size: 25,
            maxWidth: 790,
            weight: 700,
            color: layout.fixedTextColor,
            shadow: layout.fixedTextShadow
        });

        drawText(CAMPAIGN.welcome, 540, layout.welcomeY, {
            size: 29,
            maxWidth: 820,
            weight: 800,
            color: layout.fixedTextColor,
            shadow: layout.fixedTextShadow
        });

        drawText(CAMPAIGN.smart, 540, layout.smartY, {
            size: 25,
            maxWidth: 780,
            weight: 700,
            color: layout.fixedTextColor,
            shadow: layout.fixedTextShadow
        });

        await drawLogos();

        // Layer 4: caption pengguna.
        const sizeMap = {
            small: 27,
            medium: 34,
            large: 42
        };

        const yMap = {
            top: layout.caption.topY,
            middle: layout.caption.middleY,
            bottom: layout.caption.bottomY
        };

        drawText(captionInput.value, layout.caption.x, yMap[captionPosition.value], {
            size: sizeMap[captionSize.value],
            maxWidth: layout.caption.maxWidth,
            weight: 700,
            color: layout.caption.color,
            shadow: layout.caption.shadow
        });

        templateLabel.textContent = `Desain aktif: ${activeTemplate.name}`;
    }

    function pointerPosition(event) {
        const rect = canvas.getBoundingClientRect();
        const point = event.touches ? event.touches[0] : event;

        return {
            x: ((point.clientX - rect.left) * canvas.width) / rect.width,
            y: ((point.clientY - rect.top) * canvas.height) / rect.height
        };
    }

    /*
     * Drag berlaku pada seluruh canvas, bukan hanya pada satu slot foto.
     * Ini selaras dengan foto yang menjadi background penuh.
     */
    function startDrag(event) {
        if (!photoImage) {
            return;
        }

        const point = pointerPosition(event);

        drag = {
            x: point.x,
            y: point.y,
            photoX: photoState.x,
            photoY: photoState.y
        };

        canvas.setPointerCapture?.(event.pointerId);
    }

    function moveDrag(event) {
        if (!drag) {
            return;
        }

        const point = pointerPosition(event);
        photoState.x = drag.photoX + point.x - drag.x;
        photoState.y = drag.photoY + point.y - drag.y;
        render();
    }

    function endDrag() {
        drag = null;
    }

    function getShareText() {
        const caption = captionInput.value.trim();
        return `${caption ? `${caption}\n\n` : ""}${CAMPAIGN.hashtags}`;
    }

    function blobFromCanvas() {
        return new Promise((resolve) => {
            canvas.toBlob(resolve, "image/png", 1);
        });
    }

    async function downloadPng() {
        await render();
        const blob = await blobFromCanvas();

        if (!blob) {
            status("Gagal menyiapkan gambar. Coba lagi.");
            return;
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "twibbon-maba-fti-uniska-mab-2026-2027.png";

        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);

        status("PNG berhasil dibuat.");
    }

    async function copyCaption() {
        try {
            await navigator.clipboard.writeText(getShareText());
            status("Caption dan hashtag telah disalin.");
        } catch {
            status("Tidak dapat menyalin otomatis. Silakan salin caption secara manual.");
        }
    }

    async function nativeShare() {
        if (!navigator.share || !navigator.canShare) {
            return false;
        }

        await render();
        const blob = await blobFromCanvas();

        if (!blob) {
            return false;
        }

        const file = new File(
            [blob],
            "twibbon-maba-fti-uniska-mab-2026-2027.png",
            { type: "image/png" }
        );

        const payload = {
            title: "Twibbon Maba FTI UNISKA MAB",
            text: getShareText(),
            files: [file]
        };

        if (!navigator.canShare(payload)) {
            return false;
        }

        try {
            await navigator.share(payload);
            return true;
        } catch (error) {
            return error.name === "AbortError";
        }
    }

    function openShare(platform) {
        const shareText = encodeURIComponent(getShareText());
        const pageUrl = encodeURIComponent(location.href);

        if (platform === "whatsapp") {
            window.open(`https://wa.me/?text=${shareText}`, "_blank", "noopener");
        }

        if (platform === "x") {
            window.open(`https://twitter.com/intent/tweet?text=${shareText}`, "_blank", "noopener");
        }

        if (platform === "facebook") {
            window.open(
                `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}&quote=${shareText}`,
                "_blank",
                "noopener"
            );
        }

        if (platform === "instagram" || platform === "tiktok") {
            downloadPng();
            copyCaption();
            const appName = platform === "instagram" ? "Instagram" : "TikTok";
            status(`Gambar diunduh dan caption disalin. Unggah ke ${appName} dari aplikasi Anda.`);
        }
    }

    photoInput.addEventListener("change", (event) => {
        const [file] = event.target.files;

        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {
            status("Pilih file gambar yang valid.");
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            const image = new Image();

            image.onload = () => {
                photoImage = image;
                resetPhoto();
                emptyState.classList.add("is-hidden");
                render();
            };

            image.src = reader.result;
        };

        reader.readAsDataURL(file);
    });

    zoomRange.addEventListener("input", () => {
        photoState.scale = Number(zoomRange.value);
        render();
    });

    captionInput.addEventListener("input", render);
    captionPosition.addEventListener("change", render);
    captionSize.addEventListener("change", render);

    document.getElementById("resetPhoto").addEventListener("click", () => {
        resetPhoto();
        render();
    });

    document.getElementById("randomTemplate").addEventListener("click", () => {
        const alternatives = TEMPLATE_DEFINITIONS.filter(
            (item) => item.id !== activeTemplate.id
        );

        activeTemplate = alternatives[
            Math.floor(Math.random() * alternatives.length)
        ];

        resetPhoto();
        render();
    });

    document.getElementById("downloadButton").addEventListener("click", downloadPng);
    document.getElementById("copyButton").addEventListener("click", copyCaption);

    document.getElementById("shareButton").addEventListener("click", async () => {
        if (await nativeShare()) {
            return;
        }

        shareDialog.showModal();
    });

    document.getElementById("dialogDownload").addEventListener("click", downloadPng);
    document.getElementById("dialogCopy").addEventListener("click", copyCaption);

    document.querySelectorAll("[data-share]").forEach((button) => {
        button.addEventListener("click", () => openShare(button.dataset.share));
    });

    canvas.addEventListener("pointerdown", startDrag);
    canvas.addEventListener("pointermove", moveDrag);
    canvas.addEventListener("pointerup", endDrag);
    canvas.addEventListener("pointercancel", endDrag);

    canvas.addEventListener("pointerleave", (event) => {
        if (event.buttons === 0) {
            endDrag();
        }
    });

    stage.addEventListener(
        "wheel",
        (event) => {
            if (!photoImage) {
                return;
            }

            event.preventDefault();
            const delta = event.deltaY > 0 ? -0.06 : 0.06;
            photoState.scale = Math.max(0.25, Math.min(3, photoState.scale + delta));
            zoomRange.value = photoState.scale;
            render();
        },
        { passive: false }
    );

    resetPhoto();
    render();
})();