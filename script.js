document.addEventListener('DOMContentLoaded', function() {
    const imageUpload = document.getElementById('imageUpload');
    const readyButton = document.getElementById('readyButton');
    const previewImagesContainer = document.getElementById('previewImages');
    const studentContainer = document.getElementById('studentContainer');
    const uploadArea = document.querySelector('.upload-area');

    let uploadedImageHashes = new Set(); // Armazena os hashes das imagens para evitar duplicatas
    let lastSelectedImage = null; // Armazena a última imagem selecionada para troca

    imageUpload.addEventListener('change', function(event) {
        if (previewImagesContainer.children.length >= 8) {
            alert('Máximo de 8 imagens atingido.'); // Mostra alerta se já tiver 8 imagens
            return; // Interrompe o processamento de mais arquivos
        }

        Array.from(event.target.files).forEach(file => {
            // Verifica se adicionar a imagem corrente ultrapassa o limite de 8
            if (previewImagesContainer.children.length < 8) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const hash = getHashFromString(e.target.result);
                    if (uploadedImageHashes.has(hash)) {
                        console.log('Imagem duplicada bloqueada');
                        return;
                    }
                    uploadedImageHashes.add(hash);
                    if (previewImagesContainer.children.length < 8) {
                        displayImage(e.target.result, hash);
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    });

    readyButton.addEventListener('click', function() {
        uploadArea.style.display = 'none';
        transferImagesToStudentContainer();
        studentContainer.style.display = 'flex';
        studentContainer.style.flexDirection = 'row';
        studentContainer.style.alignItems = 'center';
        studentContainer.style.justifyContent = 'flex-start'; // Ajuste para alinhar imagens à esquerda
        studentContainer.style.width = '100vw';
        studentContainer.style.height = '100vh';
        studentContainer.style.overflowX = 'auto';
        document.body.style.overflow = 'hidden';
    });

    function displayImage(imageSrc, hash) {
        const imageWrapper = document.createElement('div');
        imageWrapper.className = 'image-wrapper';

        const imgElement = document.createElement('img');
        imgElement.src = imageSrc;

        const closeButton = document.createElement('button');
        closeButton.className = 'close-btn';
        closeButton.innerHTML = '&times;';
        closeButton.onclick = function() {
            previewImagesContainer.removeChild(imageWrapper);
            uploadedImageHashes.delete(hash);
        };

        imageWrapper.appendChild(imgElement);
        imageWrapper.appendChild(closeButton);
        previewImagesContainer.appendChild(imageWrapper);
    }

    function transferImagesToStudentContainer() {
        while (previewImagesContainer.firstChild) {
            const wrapper = previewImagesContainer.firstChild;
            wrapper.removeChild(wrapper.lastChild); // Remove o botão de fechar
            wrapper.firstChild.classList.add('student-image');
            wrapper.firstChild.addEventListener('click', selectImage);
            studentContainer.appendChild(wrapper);
        }
    }

    function selectImage(event) {
        const selectedImageWrapper = event.target.parentNode;
        if (lastSelectedImage && lastSelectedImage !== selectedImageWrapper) {
            swapImages(selectedImageWrapper, lastSelectedImage);
            lastSelectedImage.classList.remove('selected');
            lastSelectedImage = null;
        } else if (!selectedImageWrapper.classList.contains('selected')) {
            selectedImageWrapper.classList.add('selected');
            lastSelectedImage = selectedImageWrapper;
        } else {
            selectedImageWrapper.classList.remove('selected');
            lastSelectedImage = null;
        }
    }

    function swapImages(img1, img2) {
        const parent = img1.parentNode;
        const next1 = img1.nextSibling === img2 ? img1 : img1.nextSibling;
        parent.insertBefore(img1, img2);
        parent.insertBefore(img2, next1);
    }

    function getHashFromString(string) {
        let hash = 0, i, chr;
        for (i = 0; i < string.length; i++) {
            chr = string.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Converte para 32-bit inteiro
        }
        return hash;
    }
});