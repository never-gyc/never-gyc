document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const scriptureForm = document.getElementById('scripture-form');
    const scriptureText = document.getElementById('scripture-text');
    const scriptureReference = document.getElementById('scripture-reference');
    const backgroundImage = document.getElementById('background-image');
    const backgroundMusicUpload = document.getElementById('background-music-upload');
    const colorTop = document.getElementById('color-top');
    const colorBottom = document.getElementById('color-bottom');
    const previewBtn = document.getElementById('preview-btn');
    const imagePreview = document.getElementById('image-preview');
    const audioPreview = document.getElementById('audio-preview');
    
    // 图片预览功能
    backgroundImage.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.innerHTML = `<img src="${e.target.result}" style="max-width: 100%; max-height: 200px;">`;
            };
            reader.readAsDataURL(file);
        }
    });
    
    // 音频预览功能
    backgroundMusicUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                audioPreview.innerHTML = `
                    <audio controls style="width: 100%;">
                        <source src="${e.target.result}" type="${file.type}">
                        您的浏览器不支持音频播放。
                    </audio>
                `;
            };
            reader.readAsDataURL(file);
        }
    });
    
    // 预览功能
    previewBtn.addEventListener('click', function() {
        // 获取表单数据
        const text = scriptureText.value;
        const reference = scriptureReference.value;
        const topColor = colorTop.value;
        const bottomColor = colorBottom.value;
        
        // 创建预览窗口
        const previewWindow = window.open('', '_blank', 'width=800,height=600');
        
        // 处理文本格式化
        let formattedText = text;
        // 处理首字母大写标记
        formattedText = formattedText.replace(/\[first-letter\](.*?)\[\/first-letter\]/g, '<span class="first-letter">$1</span>');
        
        // 构建预览HTML
        const previewHTML = `
        <!DOCTYPE html>
        <html lang="zh-CN">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>文图预览</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: 'Arial', sans-serif;
                    height: 100vh;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    background: linear-gradient(to bottom, ${topColor}, ${bottomColor});
                    color: white;
                    overflow: hidden;
                    position: relative;
                }
                
                .scripture-container {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 20px;
                    position: relative;
                }
                
                .scripture-content {
                    text-align: center;
                    max-width: 800px;
                    padding: 40px 20px;
                    position: relative;
                }
                
                .quote-mark {
                    font-size: 6rem;
                    line-height: 1;
                    position: absolute;
                    opacity: 0.7;
                }
                
                .open-quote {
                    top: 0;
                    left: 0;
                    transform: translateX(-50%);
                }
                
                .close-quote {
                    bottom: 60px;
                    right: 0;
                    transform: translateX(50%);
                }
                
                .scripture-text {
                    font-size: 2.5rem;
                    line-height: 1.4;
                    margin: 20px 0;
                    font-weight: 300;
                    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
                }
                
                .first-letter {
                    font-size: 4rem;
                    font-weight: bold;
                }
                
                .scripture-reference {
                    font-size: 1.5rem;
                    margin-top: 20px;
                    font-style: italic;
                    opacity: 0.9;
                }
            </style>
        </head>
        <body>
            <div class="scripture-container">
                <div class="scripture-content">
                    <div class="quote-mark open-quote">"</div>
                    <div class="scripture-text">${formattedText}</div>
                    <div class="quote-mark close-quote">"</div>
                    <div class="scripture-reference">${reference}</div>
                </div>
            </div>
        </body>
        </html>
        `;
        
        // 写入预览内容
        previewWindow.document.write(previewHTML);
        previewWindow.document.close();
    });
    
    // 表单提交处理
    scriptureForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 获取表单数据
        const text = scriptureText.value;
        const reference = scriptureReference.value;
        const topColor = colorTop.value;
        const bottomColor = colorBottom.value;
        
        // 处理文本格式化
        let formattedText = text;
        // 处理首字母大写标记
        formattedText = formattedText.replace(/\[first-letter\](.*?)\[\/first-letter\]/g, '<span class="first-letter">$1</span>');
        
        // 保存设置到localStorage
        const settings = {
            scriptureText: formattedText,
            scriptureReference: reference,
            colorTop: topColor,
            colorBottom: bottomColor,
            lastUpdated: new Date().toISOString()
        };
        
        localStorage.setItem('scriptureSettings', JSON.stringify(settings));
        
        // 处理背景音乐上传
        const musicFile = backgroundMusicUpload.files[0];
        if (musicFile) {
            const reader = new FileReader();
            reader.onload = function(e) {
                localStorage.setItem('backgroundMusic', e.target.result);
            };
            reader.readAsDataURL(musicFile);
        }
        
        alert('设置已保存！请刷新首页查看效果。');
    });
    
    // 加载已保存的设置（如果有）
    const savedSettings = localStorage.getItem('scriptureSettings');
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        
        // 反向处理首字母大写标记
        let rawText = settings.scriptureText || '';
        rawText = rawText.replace(/<span class="first-letter">(.*?)<\/span>/g, '[first-letter]$1[/first-letter]');
        
        scriptureText.value = rawText;
        scriptureReference.value = settings.scriptureReference || '';
        colorTop.value = settings.colorTop || '#a7c5e6';
        colorBottom.value = settings.colorBottom || '#2a5298';
    }
});