export const menuConfig = [
  {
    id: '1',
    title: '大模型基础概念',
    path: '/basic-concepts',
    children: [
      { id: '1-1', title: '什么是大语言模型', path: '/basic-concepts/what-is-llm' },
      { id: '1-2', title: '主流大模型介绍', path: '/basic-concepts/popular-models' },
      { id: '1-3', title: '大模型能力边界', path: '/basic-concepts/capabilities' },
      { id: '1-4', title: '大模型发展历程', path: '/basic-concepts/history' },
      { id: '1-5', title: '基础术语解释', path: '/basic-concepts/terminology' },
      { id: '1-6', title: '大模型应用开发技术栈', path: '/basic-concepts/technology-stack' },
    ]
  },
  {
    id: '2',
    title: 'Prompt Engineering',
    path: '/prompt-engineering',
    children: [
      { id: '2-1', title: 'Prompt基础概念', path: '/prompt-engineering/basics' },
      { id: '2-2', title: 'Prompt编写技巧', path: '/prompt-engineering/techniques' },
      { id: '2-3', title: 'Few-shot与Zero-shot', path: '/prompt-engineering/few-zero-shot' },
      { id: '2-4', title: 'Chain of Thought提示链', path: '/prompt-engineering/cot' },
      { id: '2-5', title: '常见Prompt模板', path: '/prompt-engineering/templates' },
      { id: '2-6', title: 'Prompt优化策略', path: '/prompt-engineering/optimization' }
    ]
  }
  // ... 其他菜单配置
] 