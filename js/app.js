/**
 * Çarkıfelek uygulamasının ana mantığı
 */
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elemanları
    const wheelCanvas = document.getElementById('wheel');
    const spinButton = document.getElementById('spin-button');
    const settingsButton = document.getElementById('settings-button');
    const resultDiv = document.getElementById('result');
    const discountMessage = document.getElementById('discount-message');
    
    let theWheel;
    let isSpinning = false;
    let audioPermissionGranted = false;

    // Test sesi oluştur
    const testSound = new Audio('data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAAzIyMzUAVFNTRQAAAA8AAANMYXZmNTguNDUuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV');
    testSound.volume = 0.1;

    // Ses izni kontrolü ve isteği
    async function requestAudioPermission() {
        if (audioPermissionGranted) return true;

        // Ses izni modalı oluştur
        const permissionModal = document.createElement('div');
        permissionModal.className = 'modal permission-modal';
        permissionModal.innerHTML = `
            <div class="modal-content">
                <h2>Ses İzni Gerekli</h2>
                <p>Çarkıfelek uygulamasının tam deneyimi için ses izni gereklidir. Lütfen aşağıdaki butona tıklayarak ses iznini test edin.</p>
                <div class="volume-warning">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                        <path fill="currentColor" d="M12 1.5l-8 8v5h2.5v6h11v-6h2.5v-5l-8-8zm-1.5 14h3v4h-3v-4zm0-3v-1.5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v1.5h-5z"/>
                    </svg>
                    <span>Lütfen cihazınızın sesinin açık olduğundan emin olun!</span>
                </div>
                <div class="modal-buttons">
                    <button id="test-audio" class="btn primary">SESİ TEST ET</button>
                </div>
            </div>
        `;

        document.body.appendChild(permissionModal);

        return new Promise((resolve) => {
            const testButton = document.getElementById('test-audio');
            
            testButton.onclick = async () => {
                try {
                    // Ses testi yap
                    await testSound.play();
                    
                    // Test başarılı
                    audioPermissionGranted = true;
                    permissionModal.remove();
                    resolve(true);

                    // Başarılı mesajı göster
                    showMessage('Ses testi başarılı! Çarkı çevirebilirsiniz.', 'success');
                } catch (error) {
                    // Test başarısız
                    console.error('Ses izni alınamadı:', error);
                    showMessage('Ses izni alınamadı. Lütfen tarayıcı ayarlarınızı kontrol edin.', 'error');
                    resolve(false);
                }
            };
        });
    }

    // Mesaj gösterme fonksiyonu
    function showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        document.body.appendChild(messageDiv);

        // 3 saniye sonra mesajı kaldır
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }

    // Sayfa yüklendiğinde ses iznini kontrol et
    requestAudioPermission();

    // Varsayılan mesajlar
    const defaultMessages = {
        'İndirim Yok': [
            'Maalesef bu sefer şans yanınızda değildi. Bir dahaki sefere!',
            'Bu kez indirim çıkmadı ama yine bekleriz!',
            'Şansınızı bir dahaki sefere deneyebilirsiniz!',
            'Bazen olmaz ama vazgeçmemek lazım!'
        ],
        '%5 İndirim': [
            'Tebrikler! Yüzde 5 indirim kazandınız!',
            'Harika! Size özel yüzde 5 indirim!',
            'Güzel bir başlangıç! Yüzde 5 indirim sizin!',
            'Yüzde 5 indirimle kahveniz daha lezzetli olacak!'
        ],
        '%10 İndirim': [
            'Muhteşem! Yüzde 10 indirim kazandınız!',
            'Harika bir gün! Size özel yüzde 10 indirim!',
            'Bu güzel fırsat kaçmaz! Yüzde 10 indirim sizin!',
            'Yüzde 10 indirimle kahve keyfiniz ikiye katlansın!'
        ],
        '%15 İndirim': [
            'İnanılmaz! Yüzde 15 indirim sizin oldu!',
            'Jackpot! Size özel yüzde 15 indirim!',
            'Şanslı gününüzdesiniz! Yüzde 15 indirim kazandınız!',
            'Yüzde 15 indirimle bugün çok güzel olacak!'
        ],
        '%20 İndirim': [
            'Büyük şans! Yüzde 20 indirim kazandınız!',
            'Vay canına! Size özel yüzde 20 indirim!',
            'Bu harika bir fırsat! Yüzde 20 indirim sizin!',
            'Yüzde 20 indirimle kahveniz bedavaya gelecek gibi!'
        ]
    };

    // Mesaj yöneticisi sınıfı
    class MessageManager {
        constructor() {
            this.messages = this.loadMessages() || defaultMessages;
        }

        // Mesajları lokalden yükle
        loadMessages() {
            try {
                const saved = localStorage.getItem('wheelMessages');
                return saved ? JSON.parse(saved) : null;
            } catch (error) {
                console.error('Mesajlar yüklenirken hata:', error);
                return null;
            }
        }

        // Mesajları lokale kaydet
        saveMessages() {
            try {
                localStorage.setItem('wheelMessages', JSON.stringify(this.messages));
            } catch (error) {
                console.error('Mesajlar kaydedilirken hata:', error);
            }
        }

        // Belirli bir indirim için mesajları getir
        getMessages(discountText) {
            return this.messages[discountText] || [discountText];
        }

        // Yeni indirim ekle
        addDiscount(discountText) {
            if (!this.messages[discountText]) {
                this.messages[discountText] = [
                    `Tebrikler! ${discountText} kazandınız!`,
                    `Harika! Size özel ${discountText}!`,
                    `Şanslı gününüzdesiniz! ${discountText} sizin!`,
                    `Bu güzel fırsat kaçmaz! ${discountText} kazandınız!`
                ];
                this.saveMessages();
            }
        }

        // İndirimi sil
        removeDiscount(discountText) {
            if (this.messages[discountText]) {
                delete this.messages[discountText];
                this.saveMessages();
            }
        }

        // Tüm indirimleri güncelle
        updateDiscounts(segments) {
            // Yeni mesajlar nesnesi oluştur
            const newMessages = {};
            
            // Her segment için mesaj kontrolü yap
            segments.forEach(segment => {
                if (this.messages[segment.text]) {
                    // Mevcut mesajları koru
                    newMessages[segment.text] = this.messages[segment.text];
                } else {
                    // Yeni indirim için varsayılan mesajlar oluştur
                    const discountText = segment.text;
                    newMessages[discountText] = [
                        `Tebrikler! ${discountText} kazandınız!`,
                        `Harika! Size özel ${discountText}!`,
                        `Şanslı gününüzdesiniz! ${discountText} sizin!`,
                        `Bu güzel fırsat kaçmaz! ${discountText} kazandınız!`
                    ];
                }
            });

            // Mesajları güncelle ve kaydet
            this.messages = newMessages;
            this.saveMessages();

            // Eğer modal açıksa, içeriğini güncelle
            const existingModal = document.querySelector('.modal');
            if (existingModal) {
                this.showModal();
            }
        }

        // Mesaj düzenleme modalını göster
        showModal() {
            // Varolan modalı temizle
            const existingModal = document.querySelector('.modal');
            if (existingModal) {
                existingModal.remove();
            }

            // Yeni modal oluştur
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    <h2>Mesaj Ayarları</h2>
                    <div id="message-settings">
                        ${Object.entries(this.messages).map(([discount, messages]) => `
                            <div class="message-group">
                                <h3>${discount}</h3>
                                <div class="message-list">
                                    ${messages.map((msg, idx) => `
                                        <div class="message-item">
                                            <textarea class="message-input" data-discount="${discount}" data-index="${idx}">${msg}</textarea>
                                            <button class="delete-message" data-discount="${discount}" data-index="${idx}">Sil</button>
                                        </div>
                                    `).join('')}
                                </div>
                                <button class="add-message" data-discount="${discount}">Yeni Mesaj Ekle</button>
                            </div>
                        `).join('')}
                    </div>
                    <div class="modal-buttons">
                        <button id="save-messages">KAYDET</button>
                        <button id="reset-messages">VARSAYILANA DÖN</button>
                        <button id="close-messages">KAPAT</button>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            // Event listeners
            const closeBtn = modal.querySelector('.close-modal');
            closeBtn.onclick = () => modal.remove();

            modal.querySelector('#save-messages').onclick = () => {
                const newMessages = {};
                Object.keys(this.messages).forEach(discount => {
                    newMessages[discount] = Array.from(
                        modal.querySelectorAll(`textarea[data-discount="${discount}"]`)
                    ).map(textarea => textarea.value.trim()).filter(msg => msg !== '');
                });
                this.messages = newMessages;
                this.saveMessages();
                modal.remove();
            };

            modal.querySelector('#reset-messages').onclick = () => {
                if (confirm('Tüm mesajlar varsayılan haline dönecek. Emin misiniz?')) {
                    this.messages = {...defaultMessages};
                    this.saveMessages();
                    modal.remove();
                    this.showModal();
                }
            };

            modal.querySelector('#close-messages').onclick = () => modal.remove();

            // Yeni mesaj ekleme
            modal.querySelectorAll('.add-message').forEach(button => {
                button.onclick = () => {
                    const discount = button.dataset.discount;
                    const messageList = button.previousElementSibling;
                    const messageItem = document.createElement('div');
                    messageItem.className = 'message-item';
                    messageItem.innerHTML = `
                        <textarea class="message-input" data-discount="${discount}" data-index="${messageList.children.length}"></textarea>
                        <button class="delete-message" data-discount="${discount}" data-index="${messageList.children.length}">Sil</button>
                    `;
                    messageList.appendChild(messageItem);

                    // Yeni eklenen mesaj için silme butonu olayı
                    const deleteBtn = messageItem.querySelector('.delete-message');
                    deleteBtn.onclick = function() {
                        if (messageList.children.length > 1) {
                            messageItem.remove();
                        } else {
                            alert('Her indirim için en az bir mesaj olmalıdır!');
                        }
                    };
                };
            });

            // Mevcut silme butonları için olay dinleyicileri
            modal.querySelectorAll('.delete-message').forEach(button => {
                button.onclick = function() {
                    const messageItem = this.parentElement;
                    const messageList = messageItem.parentElement;
                    if (messageList.children.length > 1) {
                        messageItem.remove();
                    } else {
                        alert('Her indirim için en az bir mesaj olmalıdır!');
                    }
                };
            });
        }
    }

    // Mesaj yöneticisi oluştur
    const messageManager = new MessageManager();
    
    // Canvas'ın mobil cihazlara uyum sağlaması
    function resizeCanvas() {
        const container = wheelCanvas.parentElement;
        const containerWidth = container.clientWidth;
        
        if (containerWidth < 400) {
            wheelCanvas.width = containerWidth;
            wheelCanvas.height = containerWidth;
        } else {
            wheelCanvas.width = 400;
            wheelCanvas.height = 400;
        }
        
        // Çarkı yeniden oluştur
        if (theWheel) {
            createWheel(settings.getSegments());
        }
    }
    
    // Sayfa yüklendiğinde ve boyutu değiştiğinde canvas'ı yeniden boyutlandır
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Çarkı oluştur
    function createWheel(segments) {
        const wheelSegments = segments.map(segment => ({
            'text': segment.text,
            'fillStyle': segment.color,
            'textFontFamily': 'Poppins',
            'textFontSize': 16,
            'textFontWeight': 600,
            'textFillStyle': 'white',
            'textAlignment': 'center',
            'strokeStyle': 'white',
            'lineWidth': 1
        }));
        
        theWheel = new Winwheel({
            'canvasId': 'wheel',
            'numSegments': segments.length,
            'segments': wheelSegments,
            'outerRadius': wheelCanvas.width / 2 - 20,
            'centerX': wheelCanvas.width / 2,
            'centerY': wheelCanvas.height / 2,
            'textAlignment': 'center',
            'rotationAngle': 270,
            'textOrientation': 'horizontal',
            'textMargin': 0,
            'pointerAngle': 90,
            'animation': {
                'type': 'spinToStop',
                'duration': 5,
                'spins': 8,
                'easing': 'Power4.easeOut',
                'callbackFinished': 'winwheelStopHandler()'
            }
        });
        
        // Çarkı çiz
        theWheel.draw();
    }
    
    // Ayarlar yöneticisi oluştur
    const settings = new WheelSettings((segments) => {
        // Ayarlar güncellendiğinde çarkı güncelle
        createWheel(segments);
        // Mesajları güncelle
        messageManager.updateDiscounts(segments);
    });
    
    // İlk çarkı oluştur
    createWheel(settings.getSegments());
    
    // Çarkı döndür butonuna tıklama
    spinButton.addEventListener('click', () => {
        if (isSpinning) return;
        
        // Sonuç alanını gizle
        resultDiv.classList.add('hidden');
        resultDiv.classList.remove('show');
        
        // Butonu devre dışı bırak
        spinButton.disabled = true;
        spinButton.textContent = 'Çark Dönüyor...';
        
        // Olasılık hesaplaması
        const segments = settings.getSegments();
        const totalProbability = segments.reduce((sum, segment) => sum + parseFloat(segment.probability || 0), 0);
        let randomValue = Math.random() * totalProbability;
        let selectedIndex = 0;
        
        for (let i = 0; i < segments.length; i++) {
            const probability = parseFloat(segments[i].probability || 0);
            if (randomValue <= probability) {
                selectedIndex = i;
                break;
            }
            randomValue -= probability;
        }
        
        // Çarkı resetle
        theWheel.stopAnimation(false);
        theWheel.rotationAngle = 270;
        theWheel.draw();
        
        // Seçilen dilime göre dönüş açısını hesapla
        const stopAt = theWheel.getRandomForSegment(selectedIndex + 1);
        
        // Çarkı döndür
        isSpinning = true;
        theWheel.animation.stopAngle = stopAt;
        theWheel.startAnimation();
    });
    
    // Ayarlar butonuna tıklama
    settingsButton.addEventListener('click', () => {
        // Eğer zaten bir ayarlar menüsü varsa kaldır
        const existingMenu = document.querySelector('.settings-menu');
        if (existingMenu) {
            existingMenu.remove();
            return;
        }

        // Ayarlar menüsünü oluştur
        const settingsMenu = document.createElement('div');
        settingsMenu.className = 'settings-menu';
        settingsMenu.innerHTML = `
            <button id="wheel-settings">ÇARK AYARLARI</button>
            <button id="message-settings">MESAJ AYARLARI</button>
        `;
        
        document.body.appendChild(settingsMenu);

        // Çark ayarları butonu tıklama olayı
        const wheelSettingsBtn = settingsMenu.querySelector('#wheel-settings');
        wheelSettingsBtn.addEventListener('click', () => {
            settingsMenu.remove();
            settings.showModal();
        });

        // Mesaj ayarları butonu tıklama olayı
        const messageSettingsBtn = settingsMenu.querySelector('#message-settings');
        messageSettingsBtn.addEventListener('click', () => {
            settingsMenu.remove();
            messageManager.showModal();
        });

        // Menüyü konumlandır
        const buttonRect = settingsButton.getBoundingClientRect();
        settingsMenu.style.position = 'fixed';
        settingsMenu.style.bottom = `${window.innerHeight - buttonRect.top + 10}px`;
        settingsMenu.style.right = '30px';

        // Dışarı tıklandığında menüyü kapat
        const closeMenu = (e) => {
            if (!settingsMenu.contains(e.target) && e.target !== settingsButton) {
                settingsMenu.remove();
                document.removeEventListener('click', closeMenu);
            }
        };
        
        // Hemen kapanmaması için küçük bir gecikme ekle
        setTimeout(() => {
            document.addEventListener('click', closeMenu);
        }, 100);
    });
    
    // Çark durduğunda çalışacak fonksiyon
    window.winwheelStopHandler = function() {
        isSpinning = false;
        spinButton.disabled = false;
        spinButton.textContent = 'ÇARKI ÇEVİR';
        
        const winningSegment = theWheel.getIndicatedSegment();
        showResult(winningSegment);
    };
    
    /**
     * Sonucu seslendirir
     * @param {string} discountText - İndirim metni
     */
    function speakResult(discountText) {
        if (!window.speechSynthesis) {
            console.log('Tarayıcınız ses sentezini desteklemiyor.');
            return;
        }

        speechSynthesis.cancel();

        // Mesaj yöneticisinden mesajları al
        const messages = messageManager.getMessages(discountText);
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];

        const utterance = new SpeechSynthesisUtterance(randomMessage);
        utterance.lang = 'tr-TR';
        utterance.volume = 1;
        utterance.rate = 1.2;
        utterance.pitch = 1.2;

        speechSynthesis.speak(utterance);
    }
    
    /**
     * Kazanan dilimi ekranda gösterir
     * @param {Object} segment - Kazanan segment
     */
    function showResult(segment) {
        // Mesajı ayarla (ekranda hala orijinal indirim metnini göster)
        discountMessage.textContent = segment.text;
        
        // Sonuç alanını göster ve animasyonu başlat
        resultDiv.classList.remove('hidden');
        
        // Animasyonu başlatmak için kısa gecikme
        setTimeout(() => {
            resultDiv.classList.add('show');
            // Sonucu seslendir
            speakResult(segment.text);
        }, 50);
        
        // Confetti efekti (eğer indirim kazandıysa)
        if (segment.text !== 'İndirim Yok') {
            createConfetti();
        }
    }
    
    /**
     * Basit bir konfeti efekti oluşturur
     */
    function createConfetti() {
        const confettiCount = 200;
        const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#D4A86A', '#5D6E3E', '#8A9A5B'];
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
            confetti.style.opacity = Math.random() * 0.6 + 0.4;
            
            // Rastgele şekil ve boyut
            const shape = Math.floor(Math.random() * 3);
            const size = Math.random() * 10 + 8;
            
            if (shape === 1) {
                confetti.style.borderRadius = '50%';
            } else if (shape === 2) {
                confetti.style.width = size * 0.5 + 'px';
                confetti.style.height = size * 1.5 + 'px';
                confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            } else {
                confetti.style.width = size + 'px';
                confetti.style.height = size + 'px';
            }
            
            document.body.appendChild(confetti);
            
            // Konfetileri belirli bir süre sonra kaldır
            setTimeout(() => {
                confetti.remove();
            }, 5000);
        }
    }
}); 