import React from 'react';
import '../styles/Timeline.css';

const events = [
  { 
    date: '2015年12月', 
    title: 'OpenAI 成立', 
    feature: '创建人工智能，造福全人类',  
    description: 'OpenAI的成立标志着人工智能研究的开端，致力于确保先进AI技术的安全和普及。'
  },
  { 
    date: '2016年4月', 
    title: 'OpenAI Gym 发布', 
    feature: '强化学习训练平台',  
    description: '提供了一套工具用于开发和比较强化学习算法，促进了AI社区的算法研究。'
  },
  { 
    date: '2016年12月', 
    title: 'Universe 发布', 
    feature: '通用AI开发与测试平台',  
    description: '支持AI在各种环境中进行训练和测试，拓展了强化学习的应用领域。'
  },
  { 
    date: '2018年6月', 
    title: 'GPT-1 发布', 
    feature: '自然语言生成模型',  
    description: '首个将Transformer与无监督预训练相结合的模型，开启了大规模语言模型的探索。'
  },
  { 
    date: '2019年2月', 
    title: 'GPT-2 发布', 
    feature: '文本生成',  
    description: '拥有15亿参数的语言模型，展示了在文本生成上的强大表现。'
  },
  { 
    date: '2020年6月', 
    title: 'GPT-3 发布', 
    feature: '自然语言处理',  
    description: 'GPT-3参数量达1750亿，显著提升了自然语言理解和生成能力。'
  },
  { 
    date: '2021年1月', 
    title: 'DALL·E 发布', 
    feature: '图像生成',  
    description: '通过文本描述生成图像，拓展了生成模型的应用场景。'
  },
  { 
    date: '2021年8月', 
    title: 'Codex 发布', 
    feature: '自然语言转代码',  
    description: '支持代码自动生成，成为GitHub Copilot的核心技术。'
  },
  { 
    date: '2022年4月', 
    title: 'DALL·E 2 发布', 
    feature: '高分辨率图像生成',  
    description: '生成的图像更细致，支持更高的分辨率。'
  },
  { 
    date: '2022年9月', 
    title: 'Whisper 发布', 
    feature: '语音识别',  
    description: '多语言语音识别模型，接近人类的识别水平。'
  },
  { 
    date: '2022年11月', 
    title: 'ChatGPT 发布', 
    feature: '对话模型',  
    description: '基于GPT-3.5的对话模型，能够进行自然语言交互。'
  },
  { 
    date: '2022年11月30日', 
    title: 'ChatGPT', 
    feature: '基于 GPT-3.5 的 ChatGPT 网页版',  
    description: '能够进行自然语言交互，回答任意问题的 AI 助手。'
  },
  { 
    date: '2023年1月27日', 
    title: 'ChatGPT Plus订阅服务推出', 
    feature: '付费订阅版ChatGPT，收费为每月20美元',  
    description: '提供更快的响应速度、高峰时段优先访问、优先使用新功能和改进等额外功能。'
  },
  { 
    date: '2023年3月14日', 
    title: 'GPT-4 发布', 
    feature: '多模态大模型',  
    description: '支持图像输入，其理解力和生成能力大幅提升。'
  },
  { 
    date: '2023年3月24日', 
    title: 'ChatGPT Plugins 推出', 
    feature: '对第三方插件的支持',  
    description: 'ChatGPT Plugins是进一步生态变革的开端，基于ChatGPT的改进包括：能够访问互联网实时数据、创建并编译代码、调用和创建第三方程序等等。'
  },
  { 
    date: '2023年5月18日', 
    title: 'ChatGPT iOS 版发布', 
    feature: 'iOS 版的 ChatGPT',  
    description: 'iOS 版的 ChatGPT。'
  },
  { 
    date: '2024年7月25日', 
    title: 'ChatGPT Android 版发布', 
    feature: 'Android 版的 ChatGPT',  
    description: 'Android 版的 ChatGPT。'
  },
  { 
    date: '2023年8月29日', 
    title: 'ChatGPT Enterprise 版发布', 
    feature: '面向企业的ChatGPT版本',  
    description: '提供企业级安全和数据隐私保护，提供无限速的GPT-4访问权限，支持32K上下文输入，高级数据分析功能，自定义选项等所有高级功能。'
  },
  { 
    date: '2023年9月26日', 
    title: 'GPT-4V (Vision) 发布', 
    feature: 'GPT-4 的视觉增强版本',  
    description: '它具有更强大的图像处理能力，可以执行更复杂的视觉分析任务，如详细的场景描述、物体识别、视觉推理等。'
  },
  { 
    date: '2023年11月6日', 
    title: 'GPT-4 Turbo、DALL-E 3、GPTs 发布', 
    feature: '增强版GPT-4',  
    description: '融合了文本和视觉能力的大模型。'
  },
  { 
    date: '2024年2月15日', 
    title: 'Sora 发布', 
    feature: '文本到视频生成AI',  
    description: '首个视频生成模型，能够生成长达一分钟的高清视频，同时保持视觉品质并遵循用户提示。'
  },
  { 
    date: '2024年5月14日', 
    title: 'GPT-4o 发布', 
    feature: 'GPT-4o的“o”代表“omni”，意为“全能”',  
    description: 'GPT-4o 是迈向更自然人机交互的一步，支持文本、音频和图像的多模态输入，提升了人机交互的自然性。'
  },
  { 
    date: '2024年6月26日', 
    title: 'Mac 版ChatGPT 发布', 
    feature: 'Mac 版 ChatGPT',  
    description: 'Mac 版 ChatGPT 旨在与用户日常操作无缝集成，提供方便的快捷键（Option + 空格键）以允许用户随时随地启动应用。用户可以轻松与聊天机器人进行交互，并可选择将文件、照片和屏幕截图等附加到信息中，供 ChatGPT 使用这些素材进行理解和创作。'
  },
  { 
    date: '2024年7月18日', 
    title: 'GPT-4o-mini 发布', 
    feature: '相当于是能力更强的“GPT-3.5”，同时支持文本和图像',  
    description: 'GPT-4o mini 成本比 GPT-3.5 Turbo便宜超过60%。'
  },
  { 
    date: '2024年9月12日', 
    title: 'o1-mini、o1-preview 发布', 
    feature: '通过强化学习训练的大语言模型，能执行复杂推理任务',  
    description: 'o1 会在回答前生成较长的内部思维链，水平接近博士生，擅长物理、化学、生物等领域的复杂任务。'
  },
  { 
    date: '2024年10月4日', 
    title: 'Canvas 发布', 
    feature: '在写作和代码方面展开协作',  
    description: '为ChatGPT引入新的写作和编程界面，提升用户与AI协作的体验。'
  },
  { 
    date: '2024年10月18日', 
    title: 'Windows 版ChatGPT 发布', 
    feature: 'Windows 版 ChatGPT',  
    description: '支持Windows系统，为用户提供更便捷的ChatGPT访问方式。'
  },
  { 
    date: '2024年10月31日', 
    title: 'ChatGPT搜索功能 发布', 
    feature: '实时网络搜索',  
    description: 'ChatGPT整合了实时互联网信息，提升了回答的准确性和时效性。'
  }
  
];

const Timeline = () => {
  return (
    <div className="container">
      <h1>OpenAI 产品发布时间线</h1>
      <ul className="timeline">
        {events.map((item, index) => (
          <li className="event" key={index}>
            <div className="event-content">
              <div className="event-date">{item.date}</div>
              <div className="event-title">{item.title}</div>
              <div class="event-feature">{item.feature}</div>
              <div class="event-description">{item.description}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Timeline;
