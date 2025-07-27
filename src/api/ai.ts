import { config } from '@/config.js'

const url = config.BACKEND_AI_URL


import { useUserStore } from '@/store/user';
const UserStore = useUserStore();

export const ai_chapter_summary = async (requestBody, onMessage) => {
    await fetchAiStrearm("/v1/ai/chapter-summary", requestBody, onMessage);
}



const fetchAiStrearm = async (path, requestBody, onMessage) => {
    try {
        // 1. 发起 Fetch 请求
        const response = await fetch(url+path , {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json',
                Authorization: UserStore.getAtoken(), // 自定义请求头
                Accept: 'text/event-stream'        // 声明接收 SSE
            },
            body: JSON.stringify(requestBody),
        });

        // 2. 获取可读流
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        // 3. 持续读取流数据
        while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            // 4. 解码并处理数据块
            const chunk = decoder.decode(value);
            const events = chunk
                .trim()
                .split('\n\n')  // SSE 事件以双换行符分隔
                .filter(Boolean);

            events.forEach(event => {
                const data = event.replace('data: ', '').replace('data:', '');
                // 调用回调函数处理数据
                onMessage(data);
            });
        }
    } catch (err) {
        if (err.name !== 'AbortError') {
            console.error('Fetch Error:', err);
            // 可以添加错误处理逻辑
        }
    }
};