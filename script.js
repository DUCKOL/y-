// 项目配置文件
// 在这个数组中添加您的HTML项目配置
const projects = [
    {
        name: "个人博客",
        // 当提供了url时，将优先跳转到此url
        url: "https://ysbk.vercel.app",
        description: "分享有用的内容，博客配备血小板AI助手，能够总结博文，并且有各种各样的能力，比如AI绘画，加粗文章内容等等",
        type: "博客"
    },
    {
        name: "AI论文协作",
        // 当提供了url时，将优先跳转到此url
        url: "https://yhep.vercel.app",
        description: "论文写作指令",
        type: "文档"
    },
    {
        name: "论文查重网站",
        // 当提供了url时，将优先跳转到此url
        url: "https://ycha.vercel.app",
        description: "一个论文查重网站点击跳转",
        type: "文档"
    },
    {
        name: "创意AI工具",
        // 当提供了url时，将优先跳转到此url
        url: "https://ychat-steel.vercel.app",
        description: "有创意的AI工具（需配置gemini密钥）",
        type: "AI"
    },
    {
        name: "双AI讨论",
        // 当提供了url时，将优先跳转到此url
        url: "https://ychatp.vercel.app",
        description: "AI辩证（需配置gemini密钥）",
        type: "AI"
    }
    ,
    {
        name: "AI绘画生成器",
        // 当提供了url时，将优先跳转到此url
        url: "https://yimg.ysunyang.dpdns.org",
        description: "Yimg,一个无限AI绘画的网站",
        type: "设计"
    }
    ,
    {
        name: "AI绘画提示词生成器",
        // 当提供了url时，将优先跳转到此url
        url: "https://yprt.vercel.app/zh",
        description: "一个AI绘画构想的AI绘画提示词的网站",
        type: "设计"
    }
    ,
    {
        name: "免费影视",
        // 当提供了url时，将优先跳转到此url
        url: "https://ytv.ysunyang.dpdns.org",
        description: "YTV一个观看所有影片的网站",
        type: "工具"
    },
    {
        name: "订阅转换器",
        // 当提供了url时，将优先跳转到此url
        url: "https://ysub.vercel.app",
        description: "一个订阅链接转换器，各种节点转换为clash格式",
        type: "工具"
    },
    {
        name: "快捷绑定",
        // 当提供了url时，将优先跳转到此url
        url: "https://ymotion-two.vercel.app",
        description: "一个3D快速绑定的网站",
        type: "网站"
    }
    // 添加新项目请按照上面的格式继续添加...
    // 
    // 示例：
    // {
    //     name: "项目显示名称",               // 必填：将显示在卡片上的标题
    //     fileName: "your-project-name",   // 可选：项目文件名（不含.html），如果提供了url，则此项可省略
    //     url: "https://example.com",      // 可选：项目的外部链接，优先级高于fileName
    //     description: "项目描述信息",       // 可选：项目的详细描述
    //     type: "项目类型"                  // 可选：项目分类（如：工具、游戏、博客等）
    // },
];


/* 
使用说明：
1. 文件结构要求：
   - 此 script.js 文件应放在根目录
   - 所有本地HTML项目文件应放在 pages/ 文件夹中
   - 例如：pages/page1.html, pages/page2.html
2. 配置字段说明（已优化）：
   - name: 必填，显示在卡片上的标题。
   - fileName: 项目文件名（不含.html）。如果项目是本地文件，则此项必填。
   - url: 外部网址。如果提供了此项，点击将跳转到该网址，优先级更高。
   - description: 可选，项目描述。
   - type: 可选，项目类型标签。
*/

// ====================================================================
// 以下为页面交互逻辑，通常无需修改
// ====================================================================

/**
 * 渲染所有项目卡片到页面上
 */
function renderProjects() {
    const container = document.getElementById('projectsContainer');
    const emptyState = document.getElementById('emptyState');
    
    if (typeof projects === 'undefined' || projects.length === 0) {
        container.style.display = 'none';
        emptyState.style.display = 'flex';
        return;
    }
    
    container.style.display = 'grid';
    emptyState.style.display = 'none';
    
    container.innerHTML = projects.map((project, index) => {
        // 将项目数据转换为安全的JSON字符串，并存储在data-*属性中
        const projectDataString = JSON.stringify(project);

        return `
            <div class="project-card" 
                 data-project='${projectDataString}' 
                 style="animation-delay: ${index * 0.1}s"
                 role="button" 
                 tabindex="0">
                <div class="project-icon">${getProjectIcon(project.type)}</div>
                <div class="project-content">
                    <h3 class="project-title">${project.name}</h3>
                    <p class="project-description">${project.description || '暂无描述'}</p>
                    <div class="project-tag">${project.type || '项目'}</div>
                </div>
                <div class="project-hover-effect"></div>
            </div>
        `;
    }).join('');
}


/**
 * 设置项目卡片的点击事件监听器
 */
function setupEventListeners() {
    const container = document.getElementById('projectsContainer');

    container.addEventListener('click', (event) => {
        // 通过事件委托，找到被点击的卡片元素
        const card = event.target.closest('.project-card');
        if (card) {
            try {
                const project = JSON.parse(card.dataset.project);
                navigateToProject(project);
            } catch (e) {
                console.error("无法解析项目数据:", e);
                showToast("打开项目时出错", "error");
            }
        }
    });
}


/**
 * 根据项目配置跳转到指定页面或URL
 * @param {object} project - 项目配置对象
 */
function navigateToProject(project) {
    // 优先使用 project.url，如果不存在，则使用 project.fileName 构建本地路径
    const targetUrl = project.url || `pages/${project.fileName}.html`;
    
    // 检查是否可以有效跳转
    if (!project.url && !project.fileName) {
        showToast("该项目未配置有效的链接", "error");
        return;
    }

    window.open(targetUrl, '_blank');
    showToast(`正在打开 ${project.name}`);
}


/**
 * 根据类型获取项目图标
 * @param {string} type - 项目类型
 * @returns {string} Emoji图标
 */
function getProjectIcon(type) {
    const iconMap = {
        '设计': '🎨', '博客': '📝', '游戏': '🎮', '工具': '🛠️', '画廊': '🖼️', 'AI': '✨', 
        '应用': '📱', '网站': '🌐', '文档': '📄', '音乐': '🎵', '视频': '🎬', '商城': '🛒', 
        '社交': '💬', 'error': '❌', '图片': '📷', '链接': '🔗', '日历': '📅', '新闻': '📰', 
        '书籍': '📚', '播客': '🎙️', '直播': '🔴', '附件': '📎', '用户': '👤', '团队': '👥', 
        '点赞': '👍', '收藏': '⭐', '分享': '🔗', '评论': '💬', '消息': '✉️', '提醒': '🔔',
        '主页': '🏠', '设置': '⚙️', '搜索': '🔍', '菜单': '☰', '刷新': '🔄', '删除': '🗑️', 
        '编辑': '✏️', '添加': '➕', '下载': '📥', '上传': '📤', '成功': '✅', '警告': '⚠️', 
        '信息': 'ℹ️', '帮助': '❓', '锁定': '🔒', '解锁': '🔓', '时间': '🕒', '电脑': '💻', 
        '手机': '📱', '数据库': '💾', '云端': '☁️', '代码': '💻', '支付': '💳', '数据': '📊',
        '目标': '🎯', '礼物': '🎁', '火焰': '🔥'

    };
    return iconMap[type] || '⭐';
}


/**
 * 在页面上显示一个Toast消息
 * @param {string} message - 要显示的消息
 * @param {string} type - 消息类型 ('info' 或 'error')
 */
function showToast(message, type = 'info') {
    const toastIcon = getProjectIcon(type === 'error' ? 'error' : '应用');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <div class="toast-content">
            <span class="toast-icon">${toastIcon}</span>
            <span>${message}</span>
        </div>
    `;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        toast.addEventListener('transitionend', () => toast.remove());
    }, 2800);
}


/**
 * 创建动态的星空背景
 */
function createStars() {
    const starsContainer = document.querySelector('.stars');
    if (!starsContainer) return;
    const numberOfStars = 80;
    
    for (let i = 0; i < numberOfStars; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 3}s`;
        star.style.animationDuration = `${Math.random() * 2 + 1}s`;
        starsContainer.appendChild(star);
    }
}


/**
 * 创建浮动的几何形状背景
 */
function createFloatingShapes() {
    const shapesContainer = document.querySelector('.floating-shapes');
    if (!shapesContainer) return;
    const shapes = ['circle', 'triangle', 'square'];
    const numberOfShapes = 6;
    
    for (let i = 0; i < numberOfShapes; i++) {
        const shape = document.createElement('div');
        shape.className = `floating-shape ${shapes[Math.floor(Math.random() * shapes.length)]}`;
        shape.style.left = `${Math.random() * 100}%`;
        shape.style.top = `${Math.random() * 100}%`;
        shape.style.animationDelay = `${Math.random() * 5}s`;
        shape.style.animationDuration = `${Math.random() * 10 + 10}s`;
        shapesContainer.appendChild(shape);
    }
}


// --- 页面初始化 ---
document.addEventListener('DOMContentLoaded', function() {
    createStars();
    createFloatingShapes();
    renderProjects();
    setupEventListeners(); // 设置全局事件监听器

    // 添加入场动画
    document.body.classList.add('loaded');

});
