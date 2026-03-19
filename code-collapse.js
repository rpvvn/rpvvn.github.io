/**
 * 代码块折叠功能
 * 按行数限制，超过指定行数的代码块添加折叠按钮
 */

function initCodeBlockCollapse() {
  const startTime = performance.now();
  
  // 获取所有代码块
  const codeBlocks = document.querySelectorAll('pre.shiki');
  
  // 如果没有代码块，直接返回
  if (codeBlocks.length === 0) {
    return;
  }
  
  codeBlocks.forEach((codeBlock) => {
    // 跳过已经处理过的
    if (codeBlock.dataset.collapsed !== undefined) {
      return;
    }
    
    // 计算代码块的行数
    const lines = codeBlock.querySelectorAll('[class*="line"]').length;
    const maxLines = 20; // 最大显示行数
    
    // 只有超过最大行数的代码块才添加折叠功能
    if (lines <= maxLines) {
      return;
    }
    
    // 标记为已处理
    codeBlock.dataset.collapsed = 'true';
    
    // 计算应该显示的高度（每行约1.5em）
    const lineHeight = 1.5; // em单位
    const maxHeight = maxLines * lineHeight; // em
    
    // 创建包装器
    const wrapper = document.createElement('div');
    wrapper.className = 'code-block-wrapper collapsed';
    wrapper.style.maxHeight = maxHeight + 'em';
    wrapper.style.overflow = 'hidden';
    wrapper.style.transition = 'max-height 0.3s ease';
    wrapper.style.position = 'relative';
    
    // 创建折叠按钮
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'code-toggle-btn-corner';
    toggleBtn.innerHTML = '展开';
    toggleBtn.type = 'button';
    toggleBtn.title = '展开/收起代码块';
    
    let isExpanded = false;
    
    toggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      isExpanded = !isExpanded;
      
      if (isExpanded) {
        wrapper.style.maxHeight = 'none';
        toggleBtn.innerHTML = '收起';
        toggleBtn.title = '收起代码块';
        wrapper.classList.remove('collapsed');
        wrapper.classList.add('expanded');
      } else {
        wrapper.style.maxHeight = maxHeight + 'em';
        toggleBtn.innerHTML = '展开';
        toggleBtn.title = '展开代码块';
        wrapper.classList.remove('expanded');
        wrapper.classList.add('collapsed');
      }
    });
    
    // 将代码块包装
    codeBlock.parentNode.insertBefore(wrapper, codeBlock);
    wrapper.appendChild(codeBlock);
    
    // 将按钮添加到包装器内（绝对定位到右上角）
    wrapper.appendChild(toggleBtn);
  });
  
  // 性能监控（开发时可用）
  const endTime = performance.now();
  if (endTime - startTime > 100) {
    console.warn(`Code collapse init took ${(endTime - startTime).toFixed(2)}ms`);
  }
}

// 页面加载完成后初始化
function setupCodeCollapse() {
  // 延迟执行，确保DOM完全加载
  setTimeout(initCodeBlockCollapse, 100);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupCodeCollapse);
} else {
  setupCodeCollapse();
}

// 如果使用了PJAX，需要在页面切换后重新初始化
document.addEventListener('pjax:complete', setupCodeCollapse);
