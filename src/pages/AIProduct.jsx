import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../js/i18n';
import SEO from '../components/SEO';

const tools = [
  { 
    id: 'fisherai', 
    icon: '/assets/icon/fisherai.png', 
    path: 'https://chromewebstore.google.com/detail/fisherai-your-best-summar/ipfiijaobcenaibdpaacbbpbjefgekbj', 
    external: true,
    category: 'Chatbots'
  },
  { 
    id: 'chatgpt', 
    icon: '/assets/icon/openai_small.svg', 
    path: 'https://chatgpt.com', 
    external: true,
    category: 'Chatbots'
  },
  { 
    id: 'claude', 
    icon: '/assets/icon/anthropic_small.svg', 
    path: 'https://claude.ai', 
    external: true ,
    category: 'Chatbots'
  },
  { 
    id: 'gemini', 
    icon: '/assets/icon/google_small.svg', 
    path: 'https://aistudio.google.com', 
    external: true,
    category: 'Chatbots' 
  },
  { 
    id: 'poe', 
    icon: '/assets/icon/poe.png', 
    path: 'https://poe.com/', 
    external: true,
    category: 'Chatbots' 
  },

  { 
    id: 'kimi', 
    icon: '/assets/icon/moonshot_small.svg', 
    path: 'https://kimi.moonshot.cn', 
    external: true,
    category: 'Chatbots' 
  },
  { 
    id: 'doubao', 
    icon: '/assets/icon/doubao2.png', 
    path: 'https://www.doubao.com/chat/', 
    external: true,
    category: 'Chatbots' 
  },
  { 
    id: 'zhipu', 
    icon: '/assets/icon/glm_small.svg', 
    path: 'https://chatglm.cn', 
    external: true,
    category: 'Chatbots' 
  },
  { 
    id: 'yuanbao', 
    icon: '/assets/icon/yuanbao.png', 
    path: 'https://yuanbao.tencent.com/', 
    external: true,
    category: 'Chatbots' 
  },
  { 
    id: 'qwen', 
    icon: '/assets/icon/ali_small.svg', 
    path: 'https://tongyi.aliyun.com/', 
    external: true,
    category: 'Chatbots' 
  },
  { 
    id: 'hailuo', 
    icon: '/assets/icon/hailuo.png', 
    path: 'https://hailuoai.com/', 
    external: true,
    category: 'Chatbots' 
  },
  { 
    id: 'baichuan', 
    icon: '/assets/icon/baichuan.png', 
    path: 'https://ying.baichuan-ai.com/chat', 
    external: true ,
    category: 'Chatbots'
  },
  { 
    id: 'wenxin', 
    icon: '/assets/icon/wenxin_small.png', 
    path: 'https://ying.baichuan-ai.com/chat', 
    external: true ,
    category: 'Chatbots'
  },
  { 
    id: 'coze', 
    icon: '/assets/icon/coze.png', 
    path: 'https://www.coze.cn/', 
    external: true,
    category: 'Chatbots' 
  },
  { 
    id: 'midjourney', 
    icon: '/assets/icon/midjourney.png', 
    path: 'https://www.midjourney.com/', 
    external: true ,
    category: 'Image'
  },
  { 
    id: 'stableDiffusion', 
    icon: '/assets/icon/stability.png', 
    path: 'https://stability.ai/', 
    external: true ,
    category: 'Image'
  },
  { 
    id: 'tongyiwanxiang', 
    icon: '/assets/icon/ali_small.svg', 
    path: 'https://tongyi.aliyun.com/wanxiang/', 
    external: true ,
    category: 'Image'
  },
  { 
    id: 'wenxinyige', 
    icon: '/assets/icon/wenxin_small.png', 
    path: 'https://yige.baidu.com/', 
    external: true ,
    category: 'Image'
  },
  { 
    id: 'canva', 
    icon: '/assets/icon/canva.png', 
    path: 'https://www.canva.com/', 
    external: true ,
    category: 'Image'
  },
  { 
    id: 'meitu', 
    icon: '/assets/icon/meitu.jpg', 
    path: 'https://www.designkit.com/', 
    external: true ,
    category: 'Image'
  },
  { 
    id: 'keling', 
    icon: '/assets/icon/keling.png', 
    path: 'https://klingai.kuaishou.com/', 
    external: true ,
    category: 'AudioVideo'
  },
  { 
    id: 'runway', 
    icon: '/assets/icon/runway.png', 
    path: 'https://runwayml.com/', 
    external: true ,
    category: 'AudioVideo'
  },
  { 
    id: 'luma', 
    icon: '/assets/icon/luma.png', 
    path: 'https://lumalabs.ai/dream-machine', 
    external: true ,
    category: 'AudioVideo'
  },
  { 
    id: 'elevenLabs', 
    icon: '/assets/icon/elevenlabs.png', 
    path: 'https://elevenlabs.io/', 
    external: true ,
    category: 'AudioVideo'
  },
  { 
    id: 'tongyitingwu', 
    icon: '/assets/icon/ali_small.svg', 
    path: 'https://tingwu.aliyun.com/', 
    external: true ,
    category: 'AudioVideo'
  },
  { 
    id: 'suno', 
    icon: '/assets/icon/suno.png', 
    path: 'https://suno.com/', 
    external: true ,
    category: 'AudioVideo'
  },
  { 
    id: 'haimian', 
    icon: '/assets/icon/haimian.png', 
    path: 'https://www.haimian.com/', 
    external: true ,
    category: 'AudioVideo'
  },
  { 
    id: 'perplexity', 
    icon: '/assets/icon/perplexity.png', 
    path: 'https://www.perplexity.ai/', 
    external: true,
    category: 'Productivity' 
  },
  { 
    id: 'mita', 
    icon: '/assets/icon/mita.png', 
    path: 'https://metaso.cn/', 
    external: true ,
    category: 'Productivity'
  },
  { 
    id: 'cursor', 
    icon: '/assets/icon/cursor.png', 
    path: 'https://www.cursor.com/', 
    external: true ,
    category: 'Productivity'
  },
  { 
    id: 'gamma', 
    icon: '/assets/icon/gamma.png', 
    path: 'https://gamma.app/', 
    external: true ,
    category: 'Productivity'
  },
  { 
    id: 'aippt', 
    icon: '/assets/icon/aippt.png', 
    path: 'https://aippt.cn/', 
    external: true ,
    category: 'Productivity'
  },
  // 其他工具...
];

const AIProduct = () => {
  const { t } = useTranslation();

  // 按照分类对工具进行分组
  const groupedTools = tools.reduce((groups, tool) => {
    const category = tool.category || 'Others';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(tool);
    return groups;
  }, {});

  return (
    <>
      <SEO
        title={t('title')}
        description={t('slogan')}
      />
      <main>
        <section className="tools-section">
          {Object.keys(groupedTools).map(category => (
            <div key={category} className="category-group">
              <h2 className="category-title">{t(`categories.${category}`)}</h2>
              <div className="tools-grid">
                {groupedTools[category].map(tool => (
                  tool.external ? (
                    <a 
                      href={tool.path} 
                      key={tool.id} 
                      className="tool-card"
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <img 
                        src={tool.icon} 
                        alt={`${t(`aiproducts.${tool.id}.title`)} icon`} 
                        className="tool-icon" 
                        loading="lazy" 
                      />
                      <div className="tool-content">
                        <h3 className="tool-title">{t(`aiproducts.${tool.id}.title`)}</h3>
                        <p className="tool-description">{t(`aiproducts.${tool.id}.description`)}</p>
                      </div>
                    </a>
                  ) : (
                    <Link 
                      to={tool.path} 
                      key={tool.id} 
                      className="tool-card"
                    >
                      <img 
                        src={tool.icon} 
                        alt={`${t(`tools.${tool.id}.title`)} icon`} 
                        className="tool-icon" 
                        loading="lazy" 
                      />
                      <div className="tool-content">
                        <h3 className="tool-title">{t(`tools.${tool.id}.title`)}</h3>
                        <p className="tool-description">{t(`tools.${tool.id}.description`)}</p>
                      </div>
                    </Link>
                  )
                ))}
              </div>
            </div>
          ))}
        </section>
      </main>
    </>
  );
};

export default AIProduct;