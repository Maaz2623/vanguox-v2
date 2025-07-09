import { useState } from "react"


export const useFreshAssistantMessageId = () => {
    const [freshAssistantMessageId, setFreshAssistantMessageId] = useState<string | null>(null)

    return {freshAssistantMessageId,
        setFreshAssistantMessageId
    }

}