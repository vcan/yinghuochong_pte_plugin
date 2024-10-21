// ==UserScript==
// @name         萤火虫PTE答案快捷键
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  使用 Control+1 查看和关闭答案，Control+2 控制音频播放/暂停，Control+3 打开/关闭评分，Control+左箭头 切换到上一题，Control+右箭头 切换到下一题，自动跳过音频准备，自动聚焦输入框
// @match        https://www.fireflyau.com/ptehome/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 添加一个调试函数
    function debug(message) {
        console.log('[萤火虫PTE答案快捷键]', message);
    }

    debug('脚本已加载');

    function findButton(text) {
        return Array.from(document.querySelectorAll('button')).find(button => 
            button.textContent.trim() === text &&
            button.className.includes('el-button--danger') &&
            button.style.background.includes('linear-gradient')
        );
    }

    function clickSkipButton() {
        const skipButton = document.querySelector('div.audio-ready-btn');
        if (skipButton && skipButton.textContent.trim() === 'Skip') {
            debug('找到Skip按钮，自动点击');
            skipButton.click();
        } else {
            debug('未找到Skip按钮或按钮不可见');
        }
    }

    function focusTextarea() {
        const textarea = document.querySelector('textarea.el-textarea__inner');
        if (textarea) {
            debug('找到输入框，自动聚焦');
            textarea.focus();
        } else {
            debug('未找到输入框');
        }
    }

    let isChangingQuestion = false;

    function handleDOMChange(mutations) {
        if (isChangingQuestion) {
            clickSkipButton();
            focusTextarea();
            isChangingQuestion = false;
        }
    }

    // 创建一个MutationObserver来监视DOM变化
    const observer = new MutationObserver(handleDOMChange);

    // 配置观察选项
    const config = { childList: true, subtree: true };

    // 开始观察文档体的变化
    observer.observe(document.body, config);

    // 页面加载完成后尝试聚焦输入框
    window.addEventListener('load', focusTextarea);

    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey) {
            if (e.key === '1') {
                debug('检测到 Control+1 快捷键');
                e.preventDefault();

                // 查找答案按钮
                const answerButton = document.querySelector('button.el-button.el-button--warning.el-button--small.is-plain');
                const closeButton = document.querySelector('button.el-dialog__headerbtn');
                
                if (closeButton && closeButton.offsetParent !== null) {
                    debug('找到关按钮，模拟点击');
                    closeButton.click();
                } else if (answerButton) {
                    debug('找到答案按钮，模拟点击');
                    answerButton.click();
                } else {
                    debug('未找到答案按钮或关闭按钮');
                }
            } else if (e.key === '2') {
                debug('检测到 Control+2 快捷键');
                e.preventDefault();

                const playPauseButton = document.querySelector('div.audio-pause-btn');
                if (playPauseButton) {
                    debug('找到播放/暂停按钮，模拟点击');
                    playPauseButton.click();
                } else {
                    debug('未找到播放/暂停按钮');
                }
            } else if (e.key === '3') {
                debug('检测到 Control+3 快捷键');
                e.preventDefault();

                const scoreButton = findButton('评分');
                const closeButton = document.querySelector('.el-dialog__wrapper:not([style*="display: none"]) button.el-dialog__headerbtn');

                if (closeButton) {
                    debug('找到关闭评分按钮，模拟点击');
                    closeButton.click();
                } else if (scoreButton) {
                    debug('找到评分按钮，模拟点击');
                    scoreButton.click();
                } else {
                    debug('未找到评分按钮或关闭按钮');
                }
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                debug(`检测到 Control+${e.key === 'ArrowLeft' ? '左' : '右'}箭头 快捷键`);
                e.preventDefault();

                const buttonText = e.key === 'ArrowLeft' ? '上一题' : '下一题';
                const button = findButton(buttonText);

                if (button) {
                    debug(`找到${buttonText}按钮，模拟点击`);
                    isChangingQuestion = true;
                    button.click();
                } else {
                    debug(`未找到${buttonText}按钮`);
                    // 添加更多调��信息
                    const allButtons = document.querySelectorAll('button');
                    debug(`页面上共有 ${allButtons.length} 个按钮`);
                    allButtons.forEach((button, index) => {
                        debug(`按钮 ${index + 1}: 文本="${button.textContent.trim()}", 类名="${button.className}", 样式="${button.getAttribute('style')}"`);
                    });
                }
            }
        }
    });

    // 添加一个视觉提示
    const statusDiv = document.createElement('div');
    statusDiv.style.position = 'fixed';
    statusDiv.style.top = '10px';
    statusDiv.style.right = '10px';
    statusDiv.style.padding = '5px 10px';
    statusDiv.style.background = 'rgba(0, 0, 0, 0.7)';
    statusDiv.style.color = 'white';
    statusDiv.style.borderRadius = '5px';
    statusDiv.style.zIndex = '9999';
    statusDiv.textContent = '萤火虫PTE答案快捷键已启用 (Ctrl+1: 答案, Ctrl+2: 播放/暂停, Ctrl+3: 评分, Ctrl+←: 上一题, Ctrl+→: 下一题)';
    document.body.appendChild(statusDiv);

    setTimeout(() => {
        statusDiv.style.display = 'none';
    }, 5000);
})();
