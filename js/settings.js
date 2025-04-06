/**
 * Çarkıfelek Ayarlarını Yönetme Sınıfı
 */
class WheelSettings {
    /**
     * @param {Function} onUpdate - Ayarlar güncellendiğinde çağrılacak fonksiyon
     */
    constructor(onUpdate) {
        this.onUpdate = onUpdate;
        this.defaultSegments = [
            { text: '%30 İndirim', color: '#9B59B6', probability: 10 },
            { text: '%25 İndirim', color: '#E67E22', probability: 15 },
            { text: '%20 İndirim', color: '#2ECC71', probability: 20 },
            { text: '%15 İndirim', color: '#3498DB', probability: 25 },
            { text: '%10 İndirim', color: '#E74C3C', probability: 25 },
            { text: 'İndirim Yok', color: '#95A5A6', probability: 5 }
        ];
        
        this.segments = this.loadSegments();
        this.setupModal();
        
        // Modalı başlangıçta gizle
        const modal = document.getElementById('settings-modal');
        if (modal) {
            modal.style.display = 'none';
        }
        
        this.renderSegments();
    }
    
    /**
     * Modal'ı kurulumu
     */
    setupModal() {
        const modal = document.getElementById('settings-modal');
        const settingsBtn = document.getElementById('settings-button');
        const closeBtn = document.querySelector('.close-modal');
        const saveBtn = document.getElementById('save-settings');
        const resetBtn = document.getElementById('reset-settings');
        const container = document.getElementById('segments-container');
        
        settingsBtn.onclick = () => {
            modal.style.display = 'block';
            this.renderSegments();
        };
        
        closeBtn.onclick = () => {
            modal.style.display = 'none';
        };
        
        window.onclick = (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        };
        
        saveBtn.onclick = () => {
            this.saveChanges();
            modal.style.display = 'none';
        };
        
        resetBtn.onclick = () => {
            if (confirm('Tüm ayarları varsayılana döndürmek istediğinize emin misiniz?')) {
                this.segments = [...this.defaultSegments];
                this.saveSegments();
                this.renderSegments();
                this.onUpdate(this.segments);
            }
        };
    }
    
    /**
     * Segmentleri render eder
     */
    renderSegments() {
        const container = document.getElementById('segments-container');
        container.innerHTML = '';
        
        // Toplam olasılığı hesapla
        const totalProbability = this.segments.reduce((sum, segment) => sum + parseFloat(segment.probability || 0), 0);
        
        this.segments.forEach((segment, index) => {
            const segmentDiv = document.createElement('div');
            segmentDiv.className = 'segment-item';
            
            const percentage = ((segment.probability / totalProbability) * 100).toFixed(1);
            
            segmentDiv.innerHTML = `
                <div class="segment-inputs">
                    <input type="text" class="segment-text" value="${segment.text}" placeholder="İndirim Metni">
                    <input type="number" class="segment-probability" value="${segment.probability}" min="0" max="100" step="1" placeholder="Ağırlık">
                    <input type="color" class="segment-color" value="${segment.color}">
                    <span class="probability-display">(${percentage}%)</span>
                    ${this.segments.length > 3 ? `
                        <button class="remove-segment" data-index="${index}">×</button>
                    ` : ''}
                </div>
            `;
            
            container.appendChild(segmentDiv);
            
            // Event listeners
            const removeBtn = segmentDiv.querySelector('.remove-segment');
            if (removeBtn) {
                removeBtn.onclick = () => {
                    this.segments.splice(index, 1);
                    this.renderSegments();
                };
            }
            
            // Input değişikliklerini anlık göster
            const probabilityInput = segmentDiv.querySelector('.segment-probability');
            probabilityInput.oninput = () => {
                const newValue = parseFloat(probabilityInput.value) || 0;
                this.segments[index].probability = newValue;
                this.renderSegments();
            };
        });
        
        // Yeni segment ekleme butonu
        if (this.segments.length < 8) {
            const addButton = document.createElement('button');
            addButton.id = 'add-segment';
            addButton.className = 'btn secondary';
            addButton.textContent = 'Yeni Dilim Ekle';
            addButton.onclick = () => {
                this.segments.push({
                    text: 'Yeni İndirim',
                    color: '#' + Math.floor(Math.random()*16777215).toString(16),
                    probability: 10
                });
                this.renderSegments();
            };
            container.appendChild(addButton);
        }
    }
    
    /**
     * Değişiklikleri kaydeder
     */
    saveChanges() {
        const container = document.getElementById('segments-container');
        const items = container.getElementsByClassName('segment-item');
        
        Array.from(items).forEach((item, index) => {
            const textInput = item.querySelector('.segment-text');
            const probabilityInput = item.querySelector('.segment-probability');
            const colorInput = item.querySelector('.segment-color');
            
            this.segments[index].text = textInput.value;
            this.segments[index].probability = parseFloat(probabilityInput.value) || 0;
            this.segments[index].color = colorInput.value;
        });
        
        this.saveSegments();
        this.onUpdate(this.segments);
    }
    
    /**
     * Mevcut ayarları localStorage'dan yükler
     * @returns {Array|null} - Kayıtlı segment listesi veya null
     */
    loadSegments() {
        const saved = localStorage.getItem('wheelSegments');
        return saved ? JSON.parse(saved) : [...this.defaultSegments];
    }
    
    /**
     * Ayarları localStorage'a kaydeder
     */
    saveSegments() {
        localStorage.setItem('wheelSegments', JSON.stringify(this.segments));
    }
    
    /**
     * Ayarları döndürür
     * @returns {Array} - Mevcut segment listesi
     */
    getSegments() {
        return this.segments;
    }
} 