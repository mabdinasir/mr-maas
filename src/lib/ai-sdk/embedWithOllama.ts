import ollama from 'ollama'

export const embedWithOllama = async (inputs: string[]) => {
    const embeddings = await Promise.all(
        inputs.map(async (input) => {
            const res = await ollama.embeddings({
                model: 'nomic-embed-text',
                prompt: input,
            })
            return res.embedding
        }),
    )

    return embeddings
}

// const embeddings = await embedWithOllama(values)
