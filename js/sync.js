/**
 * 数据同步模块
 * 由于PHP服务器不可用，我们使用此模块实现一个基于云存储的同步方案
 */

const QuoteSync = {
    // 云存储服务配置
    // 这里使用免费的JSON存储服务 JSONBin.io 作为示例
    // 实际使用时需要注册并获取API密钥
    apiUrl: 'https://api.jsonbin.io/v3/b',
    apiKey: '', // 需要在实际使用时填入
    binId: '',  // 需要在实际使用时填入
    
    /**
     * 初始化同步服务
     * @param {Object} config 配置信息
     */
    init: function(config = {}) {
        if (config.apiKey) this.apiKey = config.apiKey;
        if (config.binId) this.binId = config.binId;
        
        // 检查是否配置了API密钥
        if (!this.apiKey || !this.binId) {
            console.warn('QuoteSync: 未配置API密钥或Bin ID，将使用本地存储模式');
        }
    },
    
    /**
     * 从云端获取数据
     * @returns {Promise} 包含数据的Promise
     */
    fetchFromCloud: async function() {
        // 如果没有配置API密钥，则从本地存储获取
        if (!this.apiKey || !this.binId) {
            return this.getFromLocalStorage();
        }
        
        try {
            const response = await fetch(`${this.apiUrl}/${this.binId}`, {
                method: 'GET',
                headers: {
                    'X-Master-Key': this.apiKey,
                    'X-Bin-Meta': false
                }
            });
            
            if (!response.ok) {
                throw new Error('网络响应不正常');
            }
            
            const data = await response.json();
            // 同时更新本地存储作为备份
            this.saveToLocalStorage(data);
            return data;
        } catch (error) {
            console.error('从云端获取数据失败:', error);
            // 如果云端获取失败，尝试从本地获取
            return this.getFromLocalStorage();
        }
    },
    
    /**
     * 保存数据到云端
     * @param {Object} data 要保存的数据
     * @returns {Promise} 操作结果的Promise
     */
    saveToCloud: async function(data) {
        // 始终保存到本地存储作为备份
        this.saveToLocalStorage(data);
        
        // 如果没有配置API密钥，则只保存到本地
        if (!this.apiKey || !this.binId) {
            console.log('仅保存到本地存储');
            return { success: true, message: '数据已保存到本地' };
        }
        
        try {
            const response = await fetch(`${this.apiUrl}/${this.binId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': this.apiKey
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                throw new Error('网络响应不正常');
            }
            
            const result = await response.json();
            return { success: true, message: '数据已同步到云端', result };
        } catch (error) {
            console.error('保存数据到云端失败:', error);
            return { 
                success: false, 
                message: '保存到云端失败，但数据已保存到本地。其他设备可能无法同步此更改。',
                error: error.message 
            };
        }
    },
    
    /**
     * 从本地存储获取数据
     * @returns {Object} 存储的数据
     */
    getFromLocalStorage: function() {
        const quotes = localStorage.getItem('quotes');
        const settings = localStorage.getItem('quoteSettings');
        const backgroundMusic = localStorage.getItem('backgroundMusic');
        
        return {
            quotes: quotes ? JSON.parse(quotes) : null,
            settings: settings ? JSON.parse(settings) : null,
            backgroundMusic: backgroundMusic || null
        };
    },
    
    /**
     * 保存数据到本地存储
     * @param {Object} data 要保存的数据
     */
    saveToLocalStorage: function(data) {
        if (data.quotes) {
            localStorage.setItem('quotes', JSON.stringify(data.quotes));
        }
        
        if (data.settings) {
            localStorage.setItem('quoteSettings', JSON.stringify(data.settings));
        }
        
        if (data.backgroundMusic) {
            localStorage.setItem('backgroundMusic', data.backgroundMusic);
        }
    },
    
    /**
     * 创建新的云存储Bin
     * 仅在首次设置时使用
     * @param {Object} initialData 初始数据
     * @returns {Promise} 包含新Bin ID的Promise
     */
    createNewBin: async function(initialData = {}) {
        if (!this.apiKey) {
            console.error('未配置API密钥，无法创建新的Bin');
            return { success: false, message: '未配置API密钥' };
        }
        
        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': this.apiKey,
                    'X-Bin-Private': false,
                    'X-Bin-Name': '灵感名言数据'
                },
                body: JSON.stringify(initialData)
            });
            
            if (!response.ok) {
                throw new Error('网络响应不正常');
            }
            
            const result = await response.json();
            this.binId = result.metadata.id;
            
            return { 
                success: true, 
                message: '已创建新的云存储Bin', 
                binId: this.binId 
            };
        } catch (error) {
            console.error('创建新的Bin失败:', error);
            return { success: false, message: error.message };
        }
    }
};