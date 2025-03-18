document.addEventListener('DOMContentLoaded', function() {
    const musicToggle = document.getElementById('music-toggle');
    const backgroundMusic = document.getElementById('background-music');
    const scriptureDisplay = document.getElementById('scripture-display');
    
    // 音乐控制
    musicToggle.addEventListener('click', function() {
        if (backgroundMusic.paused) {
            backgroundMusic.play().catch(error => {
                console.error('播放音频失败:', error);
                alert('音频播放失败，请检查音频文件格式是否正确。');
                musicToggle.textContent = '播放音乐';
            });
            musicToggle.textContent = '暂停音乐';
        } else {
            backgroundMusic.pause();
            musicToggle.textContent = '播放音乐';
        }
    });
    
    // 从localStorage加载设置
    const loadSettings = function() {
        const savedSettings = localStorage.getItem('scriptureSettings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            
            // 更新文图内容
            if (settings.scriptureText && settings.scriptureReference) {
                scriptureDisplay.innerHTML = `
                    <div class="quote-mark open-quote">"</div>
                    <div class="scripture-text">${settings.scriptureText}</div>
                    <div class="quote-mark close-quote">"</div>
                    <div class="scripture-reference">${settings.scriptureReference}</div>
                `;
            }
            
            // 更新背景颜色
            if (settings.colorTop && settings.colorBottom) {
                document.body.style.background = `linear-gradient(to bottom, ${settings.colorTop}, ${settings.colorBottom})`;
            }
        }
        
        // 加载自定义背景音乐
        const savedMusic = localStorage.getItem('backgroundMusic');
        let audioLoadFailed = false;
        
        if (savedMusic && backgroundMusic) {
            try {
                // 移除现有的音频源
                while (backgroundMusic.firstChild) {
                    backgroundMusic.removeChild(backgroundMusic.firstChild);
                }
                
                // 添加新的音频源
                const source = document.createElement('source');
                
                // 检查Data URL的大小，GitHub Pages可能对大型Data URL支持有限
                if (savedMusic.startsWith('data:audio/') && savedMusic.length > 5000000) { // 约5MB
                    console.warn('音频数据过大，可能在GitHub Pages上无法正常加载');
                    audioLoadFailed = true;
                } else {
                    source.src = savedMusic;
                    // 对于Data URL格式的音频，需要根据其内容确定类型
                    if (savedMusic.startsWith('data:audio/')) {
                        // 从Data URL中提取MIME类型
                        const mimeType = savedMusic.substring(5, savedMusic.indexOf(';'));
                        source.type = mimeType;
                    } else {
                        // 默认类型
                        source.type = 'audio/mpeg';
                    }
                    backgroundMusic.appendChild(source);
                }
                
                // 添加错误处理
                backgroundMusic.onerror = function(e) {
                    console.error('音频加载失败:', e);
                    audioLoadFailed = true;
                    loadDefaultAudio();
                };
                
                if (!audioLoadFailed) {
                    // 重新加载音频元素
                    backgroundMusic.load();
                    
                    // 添加加载完成事件处理
                    backgroundMusic.oncanplaythrough = function() {
                        console.log('音频加载完成，可以播放');
                    };
                }
            } catch (error) {
                console.error('处理音频时出错:', error);
                audioLoadFailed = true;
                loadDefaultAudio();
            }
        }
        
        // 当自定义音频加载失败时，加载默认音频
        function loadDefaultAudio() {
            console.log('尝试加载默认音频文件');
            // 清除现有音频源
            while (backgroundMusic.firstChild) {
                backgroundMusic.removeChild(backgroundMusic.firstChild);
            }
            
            // 添加默认音频源
            const defaultSource = document.createElement('source');
            defaultSource.src = 'music/background.mp3';
            defaultSource.type = 'audio/mpeg';
            backgroundMusic.appendChild(defaultSource);
            backgroundMusic.load();
        }
    };
    
    // 加载设置
    loadSettings();
});