import ollama from 'ollama'

export const summarizeWithOllama = async (content: string[]) => {
    const prompt = `Summarize the following memories:\n\n${content.join('\n\n')}`
    const res = await ollama.generate({
        model: 'qwen3',
        prompt,
    })
    return res.response.trim()
}
