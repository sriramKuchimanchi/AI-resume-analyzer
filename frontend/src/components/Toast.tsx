import { useEffect, useState } from "react"

interface Props {
  message: string
  type?: "success" | "error"
  onClose: () => void
}

export default function Toast({ message, type = "success", onClose }: Props) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    
    const showTimer = setTimeout(() => setVisible(true), 10)

  
    const hideTimer = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 300)
    }, 3000)

    return () => {
      clearTimeout(showTimer)
      clearTimeout(hideTimer)
    }
  }, [onClose])

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border border-gray-100 bg-white transition-all duration-300"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
      }}
    >
    
      {type === "success" ? (
        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
          <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      ) : (
        <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0">
          <svg className="w-3 h-3 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      )}

      
      <p className="text-sm font-medium text-gray-700">{message}</p>

      
      <button
        onClick={() => {
          setVisible(false)
          setTimeout(onClose, 300)
        }}
        className="ml-2 text-gray-400 hover:text-gray-600 text-xs"
      >
        ✕
      </button>
    </div>
  )
}